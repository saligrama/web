---
title: "My April Fools' Day prank got waylaid by a Google Workspace footgun"
#description: <descriptive text here>
date: 2025-04-01T23:55:00-07:00
draft: false
toc: false
image: ""
tags: []
categories: []
---

What better April Fools' Day prank for a group of security researchers than a fake lawsuit threat?

That's what I decided to send a bunch of my friends from [Stanford Applied Cyber](https://applied-cyber.stanford.edu) this morning. Using ChatGPT as a creativity crutch allowed me to actually write the letter in no time, so I was able to focus the rest of my Caltrain commute time on actually orchestrating the prank -- and hiding the fact it came from me.

Unfortunately, due to a Google Workspace footgun, it didn't take long for my friends to discover that I was behind the prank.

<!--more-->

# The lawsuit threat letter

Before describing my prank orchestration, I do want to attach the fake threat letter I sent, as I was surprisingly happy with the output from a one-shot ChatGPT prompt. I included myself as one of the recipients of the threat to cover my tracks.

> **Peregrine Strategem** \
> Innovative Defense Solutions for a Safer Tomorrow™ \
> 200 Patriot Way, Suite 1776 \
> Arlington, VA 22201 \
> legal@peregrinestratagem.com \
> www.peregrinestratagem.com
>
> **April 1, 2025** \
> **Via Electronic Mail**
>
> Stanford Applied Cyber \<<redacted@stanford.edu>\>
>
> **Re: Unauthorized Access to Peregrine Stratagem Systems**
>
> To REDACTED, REDACTED, REDACTED, REDACTED, REDACTED, REDACTED, REDACTED, REDACTED, REDACTED, REDACTED, REDACTED, and REDACTED (the “Group”),
>
> This firm represents **Peregrine Stratagem, Inc.** (“Peregrine”), a privately held defense technology company specializing in next-generation security infrastructure for critical national systems. We are writing in regard to the Group’s recent unauthorized interaction with Peregrine’s production environment, which may give rise to serious civil and criminal liability.
>
> Based on information voluntarily disclosed by the Group in an email dated March 28, 2025, and supported by metadata captured during your session, it appears the Group gained unauthorized access to one or more protected components of Peregrine’s internal services, including (but not limited to) its employee recognition dashboard, development sandbox, and a lightly obfuscated admin panel labeled “DO NOT CLICK – UNDER CONSTRUCTION.”
>
> The Group’s access was not authorized, not invited, and not appreciated.
>
> As such, the Group’s actions appear to constitute violations of:
>
> - The **Computer Fraud and Abuse Act** (18 U.S.C. § 1030) (“CFAA”) – for intentionally accessing a protected computer without authorization;
> - The **Digital Millennium Copyright Act** (17 U.S.C. § 1201) (“DMCA”) – for circumvention of digital security measures clearly labeled “security through obscurity”;
> - And, of less legal but equal concern, a breach of our internal **Morale Assurance Policy**, which strictly forbids actions that may result in LinkedIn discourse exceeding 500 comments.
>
> Although Peregrine appreciates responsible disclosure and values the role of security researchers in the broader tech ecosystem, our internal policy requires that all interactions with Peregrine systems be pre-authorized through our Vulnerability Reporting Program (VRP) that directs mail to our most moral and effective employees. No such authorization was granted, and as such, the Group’s access falls outside of accepted norms.
>
> Accordingly, we request that each member of the Group confirm the following in writing by April 5, 2025:
>
> That they will not further access Peregrine’s systems, endpoints, or dashboards, including any dev/staging instances labeled “pls-ignore”;
>
> That they have deleted any data, screenshots, or performance reviews accessed during this interaction;
>
> That they will not publicly disclose or discuss this incident outside of a brief, tasteful “lessons learned” blog post approved by Peregrine’s Media Integrity Team.
>
> If the Group complies with these reasonable requests, Peregrine will consider this matter resolved and will not pursue further action. However, Peregrine reserves all rights and remedies available under law and equity should future access occur without prior coordination.
>
> Please direct all further communications to legal@peregrinestratagem.com.
>
> Sincerely, and happy April Fools’ Day,
>
> **Liberty A. Falcon** \
> General Counsel \
> Peregrine Stratagem, Inc. \
> CC: Internal Morale Assurance

# Orchestrating the prank

I timeboxed my prank orchestration (i.e., sending the mail in a way that best hid that it came from me) to my ~45 minute Caltrain commute this morning.

## Domain acquisition

ChatGPT gave me a corporate name and domain, so to truly commit to the bit I of course had to actually register the domain name and send the letter from `legal@`. Fortunately, `peregrinestratagem.com` was only about $10 for a year, so I bought it on the spot from [Cloudflare](../migrating-personal-infra). Cloudflare defaults to redacting WHOIS information for newly acquired domains, so I figured I was safe there:

```
asaligrama@volta ~> whois peregrinestratagem.com
...
Registrar WHOIS Server: whois.cloudflare.com
Registrar URL: https://www.cloudflare.com
Updated Date: 2025-04-01T16:46:39Z
Creation Date: 2025-04-01T16:46:35Z
Registrar Registration Expiration Date: 2026-04-01T16:46:35Z
Registrar: Cloudflare, Inc.
Registrar IANA ID: 1910
Domain Status: addperiod https://icann.org/epp#addperiod
Domain Status: clienttransferprohibited https://icann.org/epp#clienttransferprohibited
Registry Registrant ID:
Registrant Name: DATA REDACTED
Registrant Organization: DATA REDACTED
Registrant Street: DATA REDACTED
Registrant City: DATA REDACTED
Registrant State/Province: DATA REDACTED
Registrant Postal Code: DATA REDACTED
Registrant Country: US
Registrant Phone: DATA REDACTED
Registrant Phone Ext: DATA REDACTED
Registrant Fax: DATA REDACTED
Registrant Fax Ext: DATA REDACTED
...
```

## Email account setup

The easiest way for me to send mail from this domain was to simply add it as a [user alias domain](https://support.google.com/a/answer/7502379?hl=en) in my `saligrama.io` Google Workspace. Using this feature, any primary email address and aliases on `saligrama.io` get aliased to `peregrinestratagem.com` -- thus, I could create `legal@saligrama.io` as an alias for `aditya@saligrama.io` and then `legal@peregrinestratagem.com` would automatically alias to `aditya@saligrama.io` as well.

Configuring this was very easy: after I bought the domain on Cloudflare, I simply used the Google Workspace admin portal to go through the UI flow for adding a user alias domain. Google now actually supports authenticating with Cloudflare to automatically set up the necessary DNS `TXT` records to verify domain ownership and for SPF as well as the `MX` records for sending mail. This took under a minute, with the only wrinkle being that I'll need to get the records into Terraform eventually to avoid drift.

Because I'd configured `legal@peregrinestratagem.com` as both a sending and receiving alias, and because there were actual `MX` and `TXT` records for the domain, I expected the email would authentically look like it was coming from `legal@peregrinestratagem.com` with no hint of `aditya@saligrama.io`.

## Sending the email, then quickly getting busted

Confident in my belief that it'd be difficult to figure out I was sending the fake threat, I blasted it out to my friends. At first, I got some "fell for it" responses.

{{< figure src="images/fell-for-it.png" alt="A friend asking me to triage the fake lawsuit threat" position="center" >}}

Meanwhile, other friends quickly realized it was probably an "insider threat", though I wasn't initially suspected.

{{< figure src="images/investigation-begins.png" alt="Others quickly realize it's an insider" position="center" >}}

But soon after, it was quickly game over, as one friend looked at the SMTP protocol headers and saw references to `saligrama.io`.

```
Authentication-Results: spf=pass (sender IP is 209.85.128.174)
 smtp.mailfrom=saligrama.io; dkim=pass (signature was verified)
 header.d=saligrama-io.20230601.gappssmtp.com;dmarc=none action=none
 header.from=peregrinestratagem.com;compauth=pass reason=106
Received-SPF: Pass (protection.outlook.com: domain of saligrama.io designates
 209.85.128.174 as permitted sender) receiver=protection.outlook.com;
 client-ip=209.85.128.174; helo=mail-yw1-f174.google.com; pr=C
Received: from mx0a-00000d07.pphosted.com (67.231.149.169) by
 BN1PEPF00004688.mail.protection.outlook.com (10.167.243.133) with Microsoft
 SMTP Server (version=TLS1_2, cipher=TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384) id
 15.20.8606.22 via Frontend Transport; Tue, 1 Apr 2025 16:56:01 +0000
Received: from pps.filterd (m0342460.ppops.net [127.0.0.1])
	by mx0a-00000d07.pphosted.com (8.18.1.2/8.18.1.2) with ESMTP id 531ENE0B015239
	for <redacted@stanford.edu>; Tue, 1 Apr 2025 09:56:00 -0700
Authentication-Results-Original: ppops.net;	spf=pass
 smtp.mailfrom=aditya@saligrama.io;	dkim=pass
 header.d=saligrama-io.20230601.gappssmtp.com header.s=20230601;	dmarc=none
Return-Path: aditya@saligrama.io
```

{{< figure src="images/jig-is-up.png" alt="My friends quickly discovered it was me" position="center" >}}

# The Google Workspace footgun

So where had I gone wrong?

It's reasonable to expect that the user alias domain abstraction would ensure that anyone looking at the mail protocol headers would only see an email from `peregrinestratagem.com` rather than `saligrama.io`. Nowhere in the Google Workspace documentation is it explained that the actual SMTP `From` header as well as some SPF information reveals that `saligrama.io` is the actual sending mail server.

> Interestingly, Stanford's Outlook mail client doesn't reveal the domain mismatch without intentionally clicking on "View > View Message Details", but Gmail shows it when mousing over the sender's email address.
> {{< figure src="images/gmail-domain-mismatch.png" alt="Gmail shows the domain mismatch when mousing over the sender's email address" position="center" >}}

As it turns out, Google Workspace derives the domain name for SPF, DKIM, and DMARC records from the primary domain (`saligrama.io`) associated with the Google Workspace account. This has been an [open issue](https://www.googlecloudcommunity.com/gc/Workspace-Q-A/SPF-records-for-workspace-or-domain-email/m-p/542947) for several years, and has sometimes caused [issues](https://support.google.com/a/thread/6821943?msgid=7023731) with DMARC alignment. This can lead to emails being incorrectly marked as spam or rejected by receiving mail servers.

The only native mitigation appears to be to use separate Google Workspace accounts for each domain, which was infeasible given my time and cost constraints for this project.

# Conclusion

In retrospect, I could have better covered my tracks by using a dedicated email relay service (e.g., Mailgun, Cloudflare Email Routing) that could have masked the domain mismatch. However, that would have probably taken much more time than I had available for this bit. The silver lining was that my friends didn't have to stress out too long about the fake threat.

This was instructive about a limitation of Google Workspace's privacy limitations for sending emails with multiple domains. When needing to send an email from a different domain with no reference to `saligrama.io`, I'll be sure to avoid adding that domain to my Google Workspace account.
