---
title: "Upgrading my personal security, part two: disk encryption and secure boot"
#description: <descriptive text here>
date: 2022-05-04T01:42:46-07:00
draft: false
showToc: true
image: ""
tags: []
categories: []
---

This is a continuation of my [previous post](/blog/post/upgrading-personal-security-web) about upgrading personal security. This post focuses on preventing [evil maid attacks](https://en.wikipedia.org/wiki/Evil_maid_attack) using disk encryption and secure boot.

With this post, I compiled and summarized all of the resources I used to do all of this configuration. The hope is that having a set of steps in one place reduces the need to go hunting across different Reddit posts, blog posts, and wiki articles as I did.

<!--more-->

# Recap: physical threat model

An evil maid attack is a situation where an attacker has physical access to a device. For now, the way I think about this scenario is that an attacker can have physical access to one of the following:

* Phone
* Laptop
* YubiKey

Even with any one of these devices in their possession, the adversary should never be able to access any of our data or accounts. Additionally, we should not be locked out of our own accounts even with one device missing.

**Disclaimer**: Full physical security is impossible to achieve on standard consumer laptops. This is a best effort using commonly available tools and methods, and will not protect against a determined (e.g. nation-state) adversary.

# Recap: hardware

To recap, I'll be using the following hardware for this post:

* Laptop: Lenovo ThinkPad X1 Carbon Gen 9
    - Runs a dual-boot setup with Arch Linux and Windows 11
    - Initially, both the Linux and Windows partitions were unencrypted
* Hardware security key: YubiKey 5C NFC

# Stage three: Linux disk encryption with FIDO2/YubiKey authentication

These instructions will demonstrate how to encrypt the Linux partition in-place. If you were smarter than me when you initially set up the laptop and encrypted the disk, skip to the next step.

Now it's time to encrypt Linux data at rest using LUKS2. We start with the following disk setup:

```bash
~ » lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk  
├─nvme0n1p1 259:1    0   260M  0 part  /boot # EFI ESP, systemd-boot
├─nvme0n1p2 259:2    0    16M  0 part  # Windows reserved
├─nvme0n1p3 259:3    0 153.4G  0 part  # Windows C:
├─nvme0n1p4 259:4    0 322.3G  0 part  / # Arch Linux root, ext4
└─nvme0n1p5 259:5    0  1000M  0 part # Windows reserved
```

Observe that the Linux root is currently unencrypted and not part of an LVM setup. I wanted to do the encryption without having to wipe the partition, set up LUKS2 on LVM, and then restore the data; I just wanted to encrypt-in-place. The [Arch Linux wiki](https://wiki.archlinux.org/title/Dm-crypt/Device_encryption#Encrypt_an_existing_unencrypted_file_system) has documentation on how to do so, but hopefully my instructions below are a bit clearer.

**Disclaimer**: For these steps to work, your `/boot` partition must be separate from your root partition. `/boot` must be unencrypted so the bootloader can load a kernel and initramfs that are capable of decrypting your root partition.

**Disclaimer**: These steps are specific to a system that uses the `systemd-boot` bootloader. If you use GRUB or rEFInd, your configuration will likely look different.

**Disclaimer**: I AM NOT RESPONSIBLE FOR ANY DATA LOSS YOU MIGHT ENCOUNTER FOLLOWING THESE INSTRUCTIONS.


With that out of the way, boot into an Arch Linux live USB and run the following commands.

```bash
# 1. Check the file system for errors
e2fsck -f /dev/nvme0n1p4

# 2. Reduce filesystem size by 32M 
#    to make space for the LUKS header
resize2fs -p /dev/nvme0n1p4 $(expr `fdisk -l | grep nvme0n1p4 | awk '{print $4}'` - 32768)s

# 3. Encrypt the partition, reducing partition size by 32M.
#    Give it a secure password when requested.
cryptsetup reencrypt --encrypt --reduce-device-size 32M /dev/nvme0n1p4

# 4. Open the encrypted partition with your password and mount it.
cryptsetup open /dev/nvme0n1p4 root
mount /dev/mapper/root /mnt
mount /dev/nvme0n1p1 /mnt/boot
```

Now we need to do some config editing.

5. Chroot into your system: `arch-chroot /mnt`
6. Edit `/etc/mkinitcpio.conf`, add the following to the `HOOKS` section:
    - `systemd`
    - `keyboard`
    - `sd-vconsole`
    - `sd-encrypt`

7. Regenerate your initramfs: `mkinitcpio -P linux`
8. Find the UUID of your root partition (not the encrypted volume within):
    ```bash
    blkid | grep nvme0n1p4 | awk '{print $2}'
    ```
    You want the value inside the quotes (i.e. `UUID="YOUR_UUID"`).
9. Edit your `systemd-boot` bootloader entry for Arch Linux (mine was in `/boot/loader/entries/arch.conf`). 
    - Find your kernel command-line parameters (the line starting with `options`)
    - If you have a section in your kernel-line options for your root partition (e.g. `root=/dev/nvme0n1p4` or `root=UUID=SOME_UUID`), remove it.
    - Directly after `options`, add 
        ```
        rd.luks.name=YOUR_UUID=root root=/dev/mapper/root
        ```
10. Exit the chroot: `exit`
11. Reboot: `reboot`; then pull out the live USB.

If everything has gone correcty, you should be all set. Now, select the `Arch Linux` boot entry at the `systemd-boot` menu and you should be prompted to enter your LUKS passphrase during the boot process.

Our disk configuration should now display as follows.

``` bash
~ » lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk  
├─nvme0n1p1 259:1    0   260M  0 part  /boot
├─nvme0n1p2 259:2    0    16M  0 part  
├─nvme0n1p3 259:3    0 153.4G  0 part
├─nvme0n1p4 259:4    0 322.3G  0 part  
|  └─root   254:0    0 322.3G  0 crypt /  
└─nvme0n1p5 259:5    0  1000M  0 part  
```

## Disk decryption with FIDO2/YubiKey

Since `systemd` version 248 (March 2021), it has been [possible](https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html) to enroll a YubiKey as a way to do LUKS decryption at boot. Doing so only takes a few steps on your running system (no need for a live USB here).

1. Enroll the key:
    ```bash
    systemd-cryptenroll --fido2-device=auto /dev/nvme0n1p4
    ```
2. Edit `/etc/crypttab.initramfs` (may be nonexistent or empty) and add the following line:
    ```
    # <name>    <device>    <password>  <options>
    root	/dev/nvme0n1p4	-	fido2-device=auto
    ```
3. Edit your bootloader entry for Arch Linux (i.e. `/boot/loader/entries/arch.conf`). Before the `root=/dev/mapper/root` entry in the options line, add
    ```
    rd.luks.options=fido2-device=auto
    ```
4. Reboot, and you should be all set.

# Stage four: evil maid hardening

Unfortunately, disk encryption is not enough to defend against an evil maid attack, even when the attacker only has at most a few minutes with your device. Up until now, the code running before you decrypt your disk during boot is both unencrypted (sitting on an unencrypted `/boot` partition) and unverified. 
* This means that an attacker can replace your kernel (i.e. `/boot/vmlinuz-linux`) and/or initramfs (i.e., `/boot/initramfs-linux.img`) with a backdoored one, which can, for example, steal your LUKS decryption passphrase with a keylogger.

To remedy this, we enable UEFI Secure Boot in order to make sure all the code running at boot is trusted.
* Secure boot verifies that all code running at boot is cryptographically signed using a private key whose public key is embedded in the computer's NVRAM.
    - Secure Boot is [not a panacea](https://www.youtube.com/watch?v=74SzIe9qiM8), but it at least allows us to move the chain of trust from the unencrypted boot partition to the laptop firmware.
    - Your laptop firmware is [also not great](https://www.welivesecurity.com/2022/04/19/when-secure-isnt-secure-uefi-vulnerabilities-lenovo-consumer-laptops/), but chances are there's no way around that short of buying a new laptop.
* When you buy a laptop running Windows, the key embedded in the NVRAM is Microsoft's key. However, it is possible to enroll your own key in the NVRAM as well.
* The way most mainstream Linux distributions deal with secure boot is to load [Shim](https://docs.fedoraproject.org/en-US/Fedora/18/html/UEFI_Secure_Boot_Guide/sect-UEFI_Secure_Boot_Guide-Implementation_of_UEFI_Secure_Boot-Shim.html), a UEFI bootloader that is signed by Microsoft, that then loads the actual Linux bootloader (usually GRUB or rEFInd). Shim then verifies the GRUB EFI loader and the loaded kernel. 
    - However, Shim does *not* verify the initramfs -- in practice, this is difficult to do because the initramfs is highly machine-dependent and also changes with every kernel update.
    - This means that a standard Shim-based secure boot setup still does not protect you from an evil maid attack, since the initramfs can still be backdoored.

Instead, our setup will involve embedding our own public key for verification into the laptop's NVRAM, whose private key will sign our kernel, initramfs, and associated resources. The only code that is allowed to boot on our machine is code signed by either our private key or Microsoft's private key.
* Why do we need to keep Microsoft's key, considering we could just sign the Windows bootloader ourselves? 
* Unfortunately, my laptop, a Lenovo ThinkPad X1 Carbon Gen 9, has [Option ROM](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/uefi-validation-option-rom-validation-guidance?view=windows-10) firmware for a hardware device, which means that the Microsoft key is required to even initialize the device in the first place.
* There are plans to support initializing these devices without the Microsoft key in Linux secure boot managers such as [`sbctl`](https://github.com/Foxboron/sbctl). However, the current implementation is experimental. 

Actually implementing a fully trusted boot chain on Linux is tricky, and there have been reports that doing this improperly can [brick your laptop](https://old.reddit.com/r/thinkpad/comments/epadb5/psa_dont_install_custom_secure_boot_keys_on_x1/).

As such, treat the following instructions as specific to my laptop (a Lenovo ThinkPad X1 Carbon Gen 9). These instructions follow from a [Reddit comment](https://old.reddit.com/r/archlinux/comments/ug9pu0/sbctl_how_do_i_use_it_to_with_a_windowsarch_linux/i72v541/) I made on the subject in early May.

**Disclaimer**: I AM NOT RESPONSIBLE FOR ANY DATA OR EQUIPMENT LOSS YOU MIGHT ENCOUNTER FOLLOWING THESE INSTRUCTIONS.

## Preparation: booting from a unified kernel image

A [Unified Kernel Image](https://wiki.archlinux.org/title/Unified_kernel_image) is a compilation containing the following:
* UEFI bootloader executable
* Linux kernel
* initramfs
* Kernel command-line arguments
* An optional splash screen

Setting one up and configuring your system to boot from it is not particularly difficult. Morten Linderud/Foxboron, an Arch Linux maintainer, has a great [guide](https://linderud.dev/blog/mkinitcpio-v31-and-uefi-stubs/) on the subject. To summarize:

1. Edit `/etc/mkinitcpio.d/linux.preset`
    - Add the following lines:
        ```
        ALL_microcode=(/boot/*-ucode.img)
        default_efi_image="/boot/EFI/Linux/linux.efi"
        default_options="--splash /usr/share/systemd/bootctl/splash-arch.bmp"
        fallback_efi_image="/boot/EFI/Linux/fallback.efi"
        ```
    - Edit the line starting with `fallback_options` to contain
        ```
        fallback_options="-S autodetect --splash /usr/share/systemd/bootctl/splash-arch.bmp"
        ```
2. `cat /proc/cmdline > /etc/kernel/cmdline`
    - Remove any references to initrd/initramfs.
3. `mkinitcpio -P linux`
4. Reboot and make sure that you have two new entries in your `systemd-boot` menu: one for Arch Linux, and one for Arch Linux fallback
5. You can now safely remove `/boot/loader/entries/arch.conf`.

## Enrolling your key into secure boot

Doing this used to be an [extremely painful process](https://linderud.dev/blog/improving-the-secure-boot-user-experience/), but luckily the `sbctl` tool makes this significantly easier. 

These instructions were what worked on my system, and many steps were previously scattered across numerous blog posts, wiki pages, and Reddit comments. Part of my motivation for writing this post was to centralize these steps, at least for my newer ThinkPad, since the system *will* brick if this is done improperly.

1. Reboot into your UEFI interface and enable secure boot. Set the secure boot mode setting to "Setup mode," which allows enrolling new keys. Then boot back into Arch.

```bash
# Execute the following instructions as root

# 2. Install sbctl
pacman -S sbctl

# 3. Create a keypair
#    The private key in this keypair is used to sign all
#    EFI code loaded at boot, which means that without the
#    signature, you will not be able to boot into Linux.
#    MAKE SURE YOU DO NOT LOSE THE PRIVATE KEY.
sbctl create-keys

# 4. Enroll your keys while keeping Microsoft's keys.
#    Experimentally, Option ROM devices can be supported
#    using `sbctl enroll-keys --tpm-eventlog`, but I have
#    not tested this and IT COULD LEAD TO EQUIPMENT LOSS.
sbctl enroll-keys --microsoft

# 5. Sign each of the EFI files that may appear somewhere
#    in the boot chain. The following files are specific
#    to my configuration, double check that you sign everything
#    you need to for your setup.
sbctl sign -s /boot/EFI/Linux/linux.efi
sbctl sign -s /boot/EFI/Linux/fallback.efi
sbctl sign -s /boot/EFI/systemd/systemd-bootx64.efi
sbctl sign -s /boot/EFI/Boot/bootx64.efi
sbctl sign -s /boot/EFI/Microsoft/bootmgfw.efi
sbctl sign -s /boot/EFI/Microsoft/bootmgr.efi
sbctl sign -s /boot/EFI/Microsoft/memtest.efi

# 6. Verify that all the files you need are signed
sbctl list-files

# 7. Verify that the sbctl pacman hook works on a kernel upgrade.
#    Ensure that the string "Signing EFI binaries..." appears.
pacman -S linux
```

8. Reboot into the UEFI interface and ensure that Secure Boot is still enabled. Verify that the Secure Boot mode setting has changed to "User mode."

9. Test booting into Arch, Arch fallback, and Windows. All should succeed without issues.

## Securing the Windows partition with BitLocker

At this point we can go ahead and simply enable BitLocker in Windows settings. Why did we need to wait this long?
* The modern BitLocker implementation uses the [hardware trusted platform module](https://en.wikipedia.org/wiki/Trusted_Platform_Module) (TPM) to store the disk decryption key.
* Windows requires everything in the boot chain to be signed before it can retrieve the key from the TPM. This requires secure boot to be enabled.
* Without secure boot, we would be prompted for a long, randomly generated recovery password every single time we wanted to start Windows.

## Setting a UEFI password

We're not quite done yet: with access to the UEFI interface, an attacker could simply turn secure boot off, completely nullifying all the work we just did.

Nearly every UEFI implementation allows setting a password, so go ahead and do so. Make sure the password protects both the firmware interface itself and the boot device selector.
* Why do we need to protect the boot list?
* We want to prevent an attack where the adversary can boot an Ubuntu or Fedora LiveUSB (whose loaders are Shim, trusted with Microsoft's key), and then plant Shim, a signed kernel, and a backdoored initramfs on the unencrypted boot partition.
    - Protecting the boot list both prevents an adversary from booting a LiveUSB and from being able to boot Shim once the attack is carried out.

## Finishing up: disabling Windows recovery

Lastly, in Windows, we want to [disable the recovery environment](https://www.windowscentral.com/how-enable-windows-recovery-environment-windows-10), which allows manipulating boot priority or booting to a USB.
* This is pretty simple.
* Open Command Prompt as administrator and run `reagentc /disable`.

# Closing

At this point, you should be reasonably protected from Evil Maid attacks. An adversary would probably need to carefully manipulate the boot priority list in the NVRAM in order to have any chance at mounting an attack. This requires a flash programmer and lots of time.

Of course, this still leaves you susceptible to an [\$5 wrench attack](https://xkcd.com/538/). But this isn't in the threat model, and if you've reached this point, you probably have bigger problems than your data.

**Acknowledgement**: Thanks to [Cody Ho](https://gitlab.com/Aesrentai) for suggestions and edits.
