---
title: "Portfolio"
description: "Aditya Saligrama's portfolio"
draft: false
image: ""
aliases:
    - /cs
    - /experience
    - /research
hideWordCount: true
---

## Work experience

**Software Engineering Intern** at [Cloudflare](https://www.cloudflare.com)
: *Austin, TX, Jun 2024 -- Sep 2024*
* Zero-Trust Connectivity team.

**Software Engineering Intern, Security and Privacy** at [Verkada](https://www.verkada.com)
: *San Mateo, CA, Jun 2023 -- Sep 2023*
* Established automated firmware and network security testing program and Linux hardening standards for physical security devices.
* Test implementation and enforcement substantially reduced device attack surface and improved security and compliance posture.

**Software Engineering Intern** at [Lacework](https://www.lacework.com)
: *San Jose, CA (remote), Jun 2022 -- Sep 2022*
* Engineered end-to-end virtualization of benchmarking system on Spark, reducing data import time by 20x vs. Snowflake.
* Contributed enhanced Snowflake and Spark parsing support to [SQLGlot](https://github.com/tobymao/sqlglot), an open-source SQL parser and transpiler. 3 PRs merged.

**Engineering Intern** at [Uptycs](https://www.uptycs.com)
: *Waltham, MA (remote), Nov 2020 -- Apr 2021*
* Wrote and deployed production feature to Osquery monitoring software to inspect and detect malware in Java packages.
* Functionality used to detect and patch client software with Log4Shell vulnerabilities (10.0 CVSSv3 base score CVE).
* Code now [open-source](https://github.com/uptycslabs/uptycs_osquery_extensions/tree/master/extension_java_packages).

**Head of Infrastructure and Security** at [Medeloop](https://medeloop.ai)
: *Palo Alto, CA, Jun 2022 -- Jun 2023*
* Led client and API deployment on AWS and organizational security posture for rare disease data platform startup.

**Security consultant for early-stage startups**
: *Jun 2022 -- Present*
* Evaluating and strengthening initial setup and ongoing security of client tech stacks.

**Research Science Institute Intern** at [Akamai](https://www.akamai.com)
: *Cambridge, MA, Jun 2019 -- Aug 2019*
* Engineered realtime garbage collection monitoring system for Go programs with per-thread granularity.
* Detailed flagging of stop-the-world pauses used for profiling and boosting performance across Akamai Labs codebase.

## Teaching, leadership, and competition experience

**Prinicpal Instructor** at Stanford University
: *for [CS 40 Cloud Infrastructure and Scalable Application Deployment](https://infracourse.cloud), Jan 2024 -- Mar 2024*

* Taught Stanford's first-ever intro cloud computing course, with 50 students enrolled in Winter 2024.
* Created and delivered lectures detailing cloud resources available for application deployment and their best-practice usage.
* Designed hands-on programming assignments involving web application deployment on AWS using CDK to create a containerized and serverless architecture, integrating Datadog for observability and GitHub Actions for CI/CD.
* Built course management infrastructure for resource [provisioning](https://github.com/infracourse/dns-provisioner) and [autograding](https://github.com/infracourse/iac-grader) using AWS, Cloudflare, and Gradescope.

**President, CCDC Linux & Cloud Lead, and CPTC Web Lead** at [Stanford Applied Cyber](https://applied-cyber.stanford.edu)
: *Stanford, CA, Jan 2021 -- Present*

* Securing Linux and AWS systems against external red team in CCDC competition environment. Member of the 2023 National CCDC Championship (1st place) Stanford team; 3rd place finish at National CCDC 2022; 1st place at Western Regional CCDC 2022 and 2023.
* Leading web and Linux penetration testing in CPTC competition environment. 2nd place finish at CPTC9 Global Finals (2024); 1st place finish at Western Regional CPTC 2023.
* Found and disclosed web, mobile, and cloud security vulnerabilities to 10+ Stanford student startups, leading to fixes to protect sensitive personal data. Work covered in the [Stanford Daily](https://stanforddaily.com/2022/11/01/opinion-fizz-previously-compromised-its-users-privacy-it-may-do-so-again/).
* Led security basics workshops for beginners (Apr '22, Oct '22, May '23, Oct '23, Apr '24, May '24) and application security workshops for entrepreneurs (Jan '23).
* Presented on vuln-finding in Firebase apps (Feb '22), in GraphQL client apps (Mar '23), Gradescope autograders (Apr '23), and AWS (Mar '24), influencing autograder design for Stanford CS courses.
* Contributed Google OAuth sign-in support to [Baserunner](https://github.com/iosiro/baserunner), an open-source Firebase exploration tool.

**Course Assistant** at Stanford University
: *for [CS 155 Computer and Network Security](https://cs155.stanford.edu) taught by Dan Boneh and Zakir Durumeric, Apr 2024 -- Jun 2024*

* Course assistant for Stanford's main computer security course (200+ enrolled students in Spring 2024) covering low-level, web, and network attacks and defenses.

**Co-Director** at [Stanford Security Clinic](https://securityclinic.org)
: *Stanford, CA, Nov 2023 -- Present*

* *Pro bono* digital security and safety consultations for the Stanford community.

**Teaching Assistant and Infrastructure Lead** at Stanford University (via [Stanford Internet Observatory](https://io.stanford.edu))
: *for INTLPOL 268 Hack Lab taught by Alex Stamos and Riana Pfefferkorn, Sep 2022 -- Dec 2022*

* Hack Lab is Stanford's intro cybersecurity, cyberlaw, and cyber policy class, with 170+ enrolled students in Fall 2022.
* Taught two discussion sections (44 students),
* Designed and implemented course cloud infrastructure on GCP at scale.
* Designed and implemented several new lab exercises, including on cracking an encrypted WiFi packet capture, breaking into Windows machines with EternalBlue and psexec, and leaking data from an insecure Firebase mock chat app.
* Responded to an [incident](https://saligrama.io/blog/post/hack-lab-got-hacked/) involving an EternalBlue attack on course infrastructure.

## Research experience

**Software patching dynamics** (*Stanford ESRG, Oct 2022 -- Present*)
* Exploring how different organizations and enterprises patch software security vulnerabilities over time on the open internet, and on how and when attackers target those vulnerabilities.
* Advised by [Zakir Durumeric](https://zakird.com).

**Parallel, human-interpretable machine learning** (*Harvard/UBC/Duke, Jun 2017 -- Feb 2022*)
* Significant contributor and co-author to work and papers on Certifiably Optimal Rule Lists (CORELS), a system to generate human-interpretable machine learning models for tasks such as crime recidivism prediction.
* Key contributor to parallel implementation of the algorithm, achieving linear speedup and increasing tractability on 250k+ sample datasets.
* Co-wrote short paper on systems optimizations presented at SysML Conference (now MLSys) 2018.
* Created [NodeJS web UI](https://corels.eecs.harvard.edu) and [R API](https://github.com/saligrama/rcorels). 
* Advised by [Margo Seltzer](https://seltzer.com/margo) and [Cynthia Rudin](https://users.cs.duke.edu/~cynthia/).

**Rust concurrency evaluation** (*MIT PDOS, Jan 2018 -- Apr 2019*)
* Wrote a [lock-free concurrent hashmap](https://github.com/saligrama/concache) (over 140 stars on GitHub), one of the fastest available for Rust at the time.
* Released final report analyzing how the Rust language aids developers in writing concurrent code.
* Joint w/ Andrew Shen. Advised by [Jon Gjengset](https://thesquareplanet.com) and [M. Frans Kaashoek](https://www.csail.mit.edu/person/frans-kaashoek).

**Adversarial machine learning** (*MIT Madry Lab, Jan 2019 -- Jun 2020*)
* Explored effectiveness of ensembling with robust and non-robust features for robustness under adversarial attack.
* Developed ensemble schemes that yield same adversarial robustness as a single model but improve natural accuracy.
* Paper published in ICLR 2020 workshop on trustworthy machine learning (44% acceptance rate).
* Advised by [Aleksandr Madry](https://madry.mit.edu/).

**Virtual assistants for customer support queries** (*Stanford OVAL, Apr 2021 -- Dec 2021*)
* Created virtual assistant pipeline to classify customer support requests with GPT-3 data augmentation; increased sample data size by 4x.
* Advised by [Monica Lam](https://suif.stanford.edu/~lam/).

## Open-source projects and contributions

**Owned projects**

* [CS40 IaC Grader](https://github.com/infracourse/iac-grader): secure autograding for AWS CDK infrastructure-as-code
* [CS40 DNS Provisioner](https://github.com/infracourse/dns-provisioner): delegate Cloudflare DNS subzones to AWS nameservers, as a service
* [Securescope](https://github.com/saligrama/securescope): a hardened Gradescope autograder
* [Concache](https://github.com/saligrama/concache): a fast lock-free concurrent hashmap for Rust
* [Notes](/notes) for Stanford CS courses
* Linux dotfiles -- [desktop](https://github.com/saligrama/dotfiles) and [laptop](https://github.com/saligrama/laptop-dotfiles)

**Contributions**

* [Baserunner](https://github.com/iosiro/baserunner), a Firebase databse exploration tool. Added Google OAuth sign-in support (*Aug 2022*)
* [SQLGlot](https://github.com/tobymao/sqlglot), a SQL parser and transpiler. Added support for various Snowflake and Spark SQL expressions (*Aug 2022*)

## Publications

**Aditya Saligrama**, Guillaume Leclerc. [Revisiting Ensembles in an Adversarial Context: Improving Natural Accuracy](https://arxiv.org/abs/2002.11572). *ICLR 2020 Workshop on Towards Trustworthy ML: Rethinking Security and Privacy for ML*. Presented April 26, 2020.

**Aditya Saligrama**. [KnowBias: Detecting Political Polarity in Long Text Content](https://arxiv.org/abs/1909.12230). *AAAI 2020 Student Abstract and Poster Program*. Presented February 9, 2020.

**Aditya Saligrama**. [KnowBias: A Novel AI Method to Detect Polarity in Online Content](https://arxiv.org/abs/1905.00724). *CoRR*, 2019.

**Aditya Saligrama**, Andrew Shen, Jon Gjengset. [A Practical Analysis of Rust’s Concurrency Story](https://arxiv.org/abs/1904.12210). *CoRR*, 2019.

Nicholas Larus-Stone, Elaine Angelino, Daniel Alabi, Margo Seltzer, Vassilios Kaxiras, **Aditya Saligrama**, Cynthia Rudin. [Systems Optimizations for
Learning Certifiably Optimal Rule Lists](/files/sysml.pdf). *SysML (now MLSys) Conference*, 2018.

## Selected long-form blog posts

*Note: these posts were selected due to their exploration and synthesis of infrastructure and security techniques, providing a guide for future related work.*

* [What infra do you need for an infra course?](/blog/post/infracourse-infra/), May 2, 2024.
* [How to create a Stanford course](/blog/post/infracourse-how-to-setup/), April 15, 2024.
* [A student's dream: hacking (then fixing) Gradescope's autograder](/blog/post/gradescope-autograder-security/), February 28, 2023.
* [Dodging OAuth origin restrictions for Firebase spelunking](/blog/post/dodging-oauth-origin-restrictions/), November 23, 2022.
* [Firebase: Insecure by Default (feat. that one time our classmates tried to sue us)](/blog/post/firebase-insecure-by-default/), November 14, 2022.
* [Upgrading my personal security, part two: disk encryption and secure boot](https://saligrama.io/blog/post/upgrading-personal-security-evil-maid/), May 4, 2022.

## Talks

* [Web Hacking for Social Good](/files/talks/20240521-web-hacking-for-social-good.pdf). *[CS 106S](https://web.stanford.edu/class/cs106s) Week 8 (w/ [Cooper de Nicola](https://github.com/cdenicol))*, May 21, 2024.
* [Ethical Web Hacking for Fun and (maybe) Profit](/files/talks/20240518-ethical-web-hacking.pdf). *Stanford Splash*, May 18, 2024.
* [Internet Protocols and Network Security](/files/talks/20240517-internet-protocols-network-security.pdf). *[CS 155](https://cs155.stanford.edu) Section 7*, May 17, 2024.
* [Intro to Ethical Web Hacking](/files/talks/20240426-intro-ethical-hacking.pdf). *Stanford Admit Weekend*, April 26, 2024.
* [Fundamentals and Footguns of Cloud Security](/files/talks/20240308-cloud-security.pdf). *Stanford Applied Cyber Weekly Meeting (ACWM)*, March 8, 2024.
* [Reflections on a Quarter of Security Clinic](/files/talks/20231215-security-clinic.pdf). *ACWM (w/ [Miles McCain](https://miles.land))*, February 16, 2024.
* [About the Stanford Security Clinic](/files/talks/20231215-security-clinic.pdf). *Stanford CERT (w/ Miles McCain)*, December 15, 2023.
* [Stanford Applied Cyber Intro Security Workshop](/files/talks/20231013-intro-security-workshop.pdf). *ACWM*, October 13, 2023.
* [Web Hacking for Social Good](/files/talks/20230524-web-hacking-for-social-good.pdf). *CS 106S Week 8 (w/ Cooper de Nicola)*, May 24, 2023.
* [Hacking (then fixing) Gradescope's autograder](/files/talks/20230407-gradescope-autograder-security.pdf). *ACWM*, April 7, 2023. ([blog post](/blog/post/gradescope-autograder-security))
* [Hacking GraphQL for fun ~~and profit~~](/files/talks/20230310-graphql.pdf). *ACWM*, March 10, 2023.
* [Applied Cyber x ASES Safety and Security Workshop](/files/talks/20230113-ases-security-workshop.pdf). *ASES Bootcamp (w/ Miles McCain)*, January 13, 2023.
* [Stanford Applied Cyber Intro Security Workshop](/files/talks/20221014-intro-security-workshop.pdf). *ACWM (w/ Cooper de Nicola)*, October 14, 2022.
* [A Trust and Safety Analysis of the Metaverse](/files/talks/20220524-metaverse-ts.pdf). *PWR 1CK Final Presentation*, May 24, 2022.
* [Fantastic OAuth tokens and where to find them](/files/talks/20220509-oauth.pdf). *ACWM (w/ [Glen Husman](https://github.com/glen3b))*, May 9, 2022. ([blog post](/blog/post/dodging-oauth-origin-restrictions/))
* [Firebase: Insecure by Default](/files/talks/20220218-firebase.pdf). *ACWM (w/ Miles McCain)*, February 18, 2022. ([blog post](/blog/post/firebase-insecure-by-default))

## Education

**M.S. Candidate in Computer Science**, Computer and Network Security track  
:  at Stanford University, *Feb 2023 -- Jun 2025 (expected)*
* **CS 356** *Topics in Computer and Network Security* (F '23)
* **CS 255** *Introduction to Cryptography* (W '22)
* **CS 251** *Cryptocurrencies and Blockchain Technologies* (F '22)
* **CS 249I** *The Modern Internet* (W '23)
* **CS 229** *Machine Learning* (F '21)
* **CS 155** *Computer and Network Security* (S '22, CA S '24)
* **CS 153** *Applied Security at Scale* (W '23)
* **CS 145** *Data Management and Data Systems* (F '23)
* **CS 144** *Introduction to Computer Networking* (S '23)
* **INTLPOL 268** *Hack Lab: Introduction to Cybersecurity* (F '21, TA F '22)
* **CS 399/199** *Independent Work -- Research with ESRG, Teaching CS 40* (F '22, W '23, F '23, W '24, S '24)

**B.S. Candidate in Computer Science**, Systems track  
:  at Stanford University, *Sep 2020 -- Jun 2024 (expected)*
* **CS 244B** *Distributed Systems* (S '24)
* **CS 224U** *Natural Language Understanding* (S '21)
* **CS 191W** *Senior Project -- Research with ESRG* (S '23)
* **CS 161** *Design and Analysis of Algorithms* (W '22)
* **CS 154** *Introduction to the Theory of Computer Science* (F '21)
* **CS 152** *Trust and Safety Engineering* (S '23)
* **CS 149** *Parallel Computing* (F '22)
* **CS 143** *Compilers* (S '22)
* **CS 140E** *Operating Systems Design and Implementation* (W '22)
* **CS 110L** *Safety in Systems Programming* (S '21)
* **MATH 104** *Applied Matrix Theory* (S '21)
* **ENGR 76** *Information Science and Engineering* (S '24)
* **DANCE 146** *Social Dance II* (S '24)
* **DANCE 46** *Social Dance I* (W '24)
* **DESIGN 268** *Designing for Democracy: Election Administration* (W '24)
* **ARTHIST 1B** *Introduction to the History of Western Art* (F '23)
* **DESIGN 151** *Designing your Business* (S '23)
* **LINGUIST 150** *Language and Society* (W '23)
* **PSYCH 1** *Introduction to Psychology* (F '22)
* **CLASSICS 136** *The Greek Invention of Mathematics* (S '22)
* **MI 70Q** *Photographing Nature* (W '22)
* **MUSIC 2C** *Introduction to Opera* (F '21)
* **ECON 50** *Economic Analysis I* (W '21)
* **SOC 9N** *2020 Election -- Introsem* (F '20)
