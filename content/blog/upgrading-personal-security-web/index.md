---
title: "Upgrading my personal security, part one: password generation, 2FA, YubiKey"
#description: <descriptive text here>
date: 2022-05-04T01:42:44-07:00
draft: false
showToc: true
image: ""
tags: []
categories: []
---

I'm someone who's been reasonably technical for a long time, but was not really interested in security until about a year and a half ago. This means I had a lot of configuration set up for convenience, but without much in the way of security.

In the last few weeks, I started to change that and significantly upgraded my personal security. This post covers the first steps I took towards that end, starting with password generation and better two-factor authentication.

<!--more-->

# Threat model

Before delving into the details, we should take a moment to lay out a threat model -- the types of attacks that an attacker is permitted to perform and that our setup should be able to reasonably defend against. 

This is important because an adversary with significant resources (e.g. a nation-state actor) will *always* win. If you have such a determined attacker trying to break into your system, then you probably have bigger problems than reading this blog post.

## Remote threat model

This is the situation where an attacker doesn't have physical access to your system. Such an attacker's capabilities include:

* Browser-based malware
* Phishing/social engineering
* Password cracking
* Open-source intelligence (OSINT)
* [SIM-swapping](https://www.wired.com/story/sim-swap-attack-defend-phone/)
* [Shoulder-surfing](https://en.wikipedia.org/wiki/Shoulder_surfing_(computer_security))
* Personal information dumps from poorly secured services

An attacker, even with these tools, should not be able to get into our accounts. If an account or password has been compromised, our data and accounts on other services should still be protected.

## Physical threat model

This is the situation where an attacker has physical access to a device (i.e. an [evil maid attack](https://en.wikipedia.org/wiki/Evil_maid_attack)). For now, the way I think about this scenario is that an attacker can have physical access to one of the following:

* Phone
* Laptop
* YubiKey

Even with any one of these devices in their possession, the adversary should never be able to access any of our data or accounts. Additionally, we should not be locked out of our own accounts even with one device missing.

Addressing the remote threat model will be the subject of this post, whereas the physical threat model will be addressed in part two.

# Baseline setup

## Hardware

For this post, I'll be using the following hardware:

* Laptop: Lenovo ThinkPad X1 Carbon Gen 9
* Phone: Apple iPhone 13 Pro Max
* Hardware security key: YubiKey 5C NFC

## Security misconfigurations

This is the fun part: detailing a number of missteps I've made with security in the name of convenience over the last several years.

1. Password generation.
    - My previous password generation algorithm was something I came up when I was *much* younger and dumber
    - This scheme was likely brute-forceable by a determined adversary, and in addition if my password on one insecure site got leaked, it would also compromise all of my other account passwords.
2. Inconsistent use of two-factor authentication.
    - It took me an embarassingly long time to add 2FA to my password manager, Bitwarden.
    - Yet my Epic Games account had 2FA on -- and I'm not even that much of a gamer.
3. Leaving my laptop hard drive unencrypted.
    - Given physical access to an unencrypted laptop, an evil maid attack is extremely easy. A trivial example is to boot a live USB, mount the Linux root partition, and edit `/etc/passwd` and `/etc/shadow` to give yourself a backdoored user with root privileges.
    - Fully preventing an evil maid attack is difficult on Linux, as will be detailed later in this post, but it's not an excuse to have an unencrypted disk!

# Stage one: fixing bad passwords

The interesting bit here is generating a random secure password that's also reasonably fast to type (if not memorable). I use [`hsxkpasswd`](https://github.com/bbusschots/hsxkpasswd) on my laptop, which generates a random [XKCD-style](https://xkcd.com/936/) password with additional digit and special-character padding. A convenience script to do the generation is as follows:

```bash
~ » cat /usr/local/bin/genpwd
#!/bin/bash

hsxkpasswd -c ~/.hsxkpasswdrc 2>/dev/null | xclip -r -selection c
```

This script generates a password using the JSON configuration file found at `~/.hsxkpasswdrc` and immediately copies it into the clipboard for easy pasting. You can generate a configuration file with the format you want at [xkpasswd](https://xkpasswd.net).

On my phone, I use [gjPwd](https://apps.apple.com/gb/app/gjpwd/id1532589670#?platform=iphone), which is essentially a `hsxkpasswd` frontend for iOS.

Actually resetting the passwords is a simple, though tedious, game of whack-a-mole. Every time I logged into a service with a password generated using the old algorithm, I would immediately reset the password.

I started with banks, and then moved onto other services that stored financial information. This led to my [Twitter rant](https://twitter.com/saligrama_a/status/1519010724650971136) about airlines' poor digital security policies.

# Stage two: consistently using 2FA

At this point, there's no excuse to not use 2FA when a site offers it. This is especially true for anything that has access to financial information such as banks or credit card issuers.

## Why FIDO2/WebAuthn 2FA is the way to go

My strong preference for 2FA is to use the YubiKey to do [FIDO2/WebAuthn](https://www.yubico.com/authentication-standards/webauthn/)-based 2FA. 
* Why this instead of SMS-based or authenticator/TOTP app-based 2FA?
* SMS-based 2FA puts you at risk of your OTP code being stolen through a SIM-swapping attack.
* Using an authenticator app such as Authy is better, but still leaves you vulnerable to a phishing attack that requests your login information *and* your TOTP code, and then passes the details along to the actual service to log in as you. It is up to you to scrutinize the website you've navigated to and make sure it's not fraudulent.
* Using a YubiKey will prevent both these attacks, because the key will simply refuse to authenticate if the domain doesn't match the profile saved in the hardware.

Unfortunately, the list of services supporting hardware security key-based authentication is mostly limited to big tech companies and security-focused products. For these services, adding a security key is fairly easy; you just follow the prompts in the service's security settings.

## Securing TOTP 2FA behind a YubiKey, plus some phishing protection

For everything else, most services that support any 2FA do support TOTP-based authentication, and the YubiKey can store TOTP codes for use with such services. However, the TOTP code storage is limited to only 32 codes, even on the latest models such as my YubiKey 5C NFC (2020). As more and more services start to support 2FA, 32 TOTP codes will probably not cut it long-term.

I currently pay for Bitwarden Premium, which now allows me to select FIDO2/WebAuthn using the YubiKey as my only means of 2FA. I now rely on Bitwarden to do TOTP 2FA (which is also a Premium feature), since I can store TOTP secrets for an unlimited amount of services. This also offers some protection against phishing attacks, since Bitwarden won't bring up the TOTP entry for a website whose domain mismatches the saved one.

Freshly adding Bitwarden TOTP is fairly easy for most services; you just go through the prompts to set up 2FA, click on "I can't scan the QR code", and then paste the TOTP secret into the Bitwarden browser extension.

Migrating from Authy, my previous TOTP provider, is a different story, since Authy doesn't allow you to export TOTP secrets for use with a different service. Instead, you need to remove the Authy 2FA option from each service and add a new 2FA option for Bitwarden. Some websites make this extra annoying and force you to disable 2FA altogether and re-enable it in order to switch TOTP providers.

## Bad (and nonexistent) 2FA implementations

Some services either only allow SMS-based 2FA, or force you to use SMS-based 2FA as a backup for TOTP or FIDO2/WebAuthn 2FA solutions. You're only as secure as your weakest backup -- so even if SMS 2FA isn't the primary 2FA method, as long as it exists as an option, you're still vulnerable to a SIM-swap attack. A non-exhaustive name-and-shame list from my personal experience:
* Yahoo
* Microsoft
* Uber
* Lyft
* Bank of America
* Barclays
* Credit Karma

Seriously, why do the financial services -- those with arguably the most sensitive data at stake -- only allow the least secure form of 2FA?

Even worse are services that store financial information, yet have no support for any form of 2FA. In my experience this has mostly been airline frequent flyer programs -- again, refer to my [Twitter rant](https://twitter.com/saligrama_a/status/1519010724650971136) about all the security issues that airlines have.
* As far as I know, Qantas, British Airways, and Singapore Airlines support 2FA. No US carriers do.

# Closing

At this point, we've significantly decreased our attack surface for a remote adversary. Our passwords are now truly random for every service, and every service with sensitive information on it (save for airline frequent flyer accounts) has some form of 2FA on it. When TOTP 2FA is needed, it's locked behind Bitwarden, which requires FIDO2/WebAuthn to log in.

Unfortunately, this is not necessarily comforting when someone with physical access to your laptop can simply just reset your root password by booting from a USB stick, thereby gaining full compromise of your assets. 

Preventing these attacks is the focus of the [next post](/blog/post/upgrading-personal-security-evil-maid).