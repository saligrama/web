---
title: "Portfolio"
draft: false
image: ""
framed: true
showLogo: true
showFooter: true
showCopyright: true
aliases:
    - /cs
    - /experience
    - /research
---

## Work experience

**Software Engineering Intern** at Lacework
: *San Jose, CA (remote), Jun 2022 -- Sep 2022*
* Engineered end-to-end virtualization of benchmarking system on Spark, reducing data import time by 20x vs. Snowflake.
* Contributed enhanced Snowflake and Spark parsing support to [SQLGlot](https://github.com/tobymao/sqlglot), an open-source SQL parser and transpiler. 3 PRs merged.

**Engineering Intern** at Uptycs
: *Waltham, MA (remote), Nov 2020 -- Apr 2021*
* Wrote and deployed production feature to Osquery monitoring software to inspect and detect malware in Java packages.
* Functionality used to detect and patch client software with Log4Shell vulnerabilities (10.0 CVSSv3 base score CVE).
* Code now [open-source](https://github.com/uptycslabs/uptycs_osquery_extensions/tree/master/extension_java_packages).

**Security consultant for early-stage startups**
: *Jun 2022 -- Present*
* Evaluating and strengthening initial setup and ongoing security of tech stack (incl. Firebase, AWS) for Stanford startups.

**Research Science Institute Intern** at Akamai
: *Cambridge, MA, Jun 2019 -- Aug 2019*
* Engineered realtime garbage collection monitoring system for Go programs with per-thread granularity.
* Detailed flagging of stop-the-world pauses used for profiling and boosting performance across Akamai Labs codebase.

## Teaching, leadership, and competition experience

**Teaching Assistant and Infrastructure Lead** at Stanford University (via [Stanford Internet Observatory](https://io.stanford.edu))
: *for INTLPOL 268 Hack Lab taught by Alex Stamos and Riana Pfefferkorn, Sep 2022 -- Dec 2022*
* Hack Lab is Stanford's intro cybersecurity, cyberlaw, and cyber policy class, with 170+ enrolled students.
* Taught two discussion sections (44 students),
* Designed and implemented course cloud infrastructure on GCP at scale.
* Designed and implemented several new lab exercises, including on cracking an encrypted WiFi packet capture, breaking into Windows machines with EternalBlue and psexec, and leaking data from an insecure Firebase mock chat app.
* Responded to an [incident]((https://saligrama.io/blog/post/hack-lab-got-hacked/)) involving an EternalBlue attack on course infrastructure.

**Vice President and CCDC Linux & Cloud Lead** at Stanford Applied Cyber
: *Stanford, CA, Jan 2021 -- Present*

* Securing Linux and AWS systems against external red team in CCDC competition environment.
* 3rd place finish at National CCDC 2022; 1st place at Western Regional CCDC 2022 and 2023.
* Lead security basics workshops for beginners (Apr '22, Oct '22) and application security workshops for entrepreneurs (Jan '23).
* Found and disclosed web, mobile, and cloud security vulnerabilities to 10+ Stanford student startups, leading to fixes to protect sensitive personal data. Work covered in the [Stanford Daily](https://stanforddaily.com/2022/11/01/opinion-fizz-previously-compromised-its-users-privacy-it-may-do-so-again/).
* Presented on vuln-finding in Firebase apps (Feb '22) and working around Google OAuth for security research (May '22).
* Contributed Google OAuth sign-in support to [Baserunner](https://github.com/iosiro/baserunner), an open-source Firebase exploration tool.

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

* [Securescope: a hardened Gradescope autograder](https://github.com/saligrama/securescope)
* [Concache: a fast lock-free concurrent hashmap for Rust](https://github.com/saligrama/concache)
* [Notes for Stanford CS courses](/notes)
* Linux dotfiles -- [desktop](https://github.com/saligrama/dotfiles) and [laptop](https://github.com/saligrama/laptop-dotfiles)

**Contributions**

* [Baserunner, a Firebase databse exploration tool](https://github.com/iosiro/baserunner). Added Google OAuth sign-in support (*Aug 2022*)
* [SQLGlot, a SQL parser and transpiler](https://github.com/tobymao/sqlglot). Added support for various Snowflake and Spark SQL expressions (*Aug 2022*)

## Publications

Guillaume Leclerc, **Aditya Saligrama**. [Revisiting Ensembles in an Adversarial Context: Improving Natural Accuracy](https://arxiv.org/abs/2002.11572). *ICLR 2020 Workshop on Towards Trustworthy ML: Rethinking Security and Privacy for ML*. Presented April 26, 2020.

**Aditya Saligrama**. [KnowBias: Detecting Political Polarity in Long Text Content](https://arxiv.org/abs/1909.12230). *AAAI 2020 Student Abstract and Poster Program*. Presented February 9, 2020.

**Aditya Saligrama**. [KnowBias: A Novel AI Method to Detect Polarity in Online Content](https://arxiv.org/abs/1905.00724). *CoRR*, 2019.

**Aditya Saligrama**, Andrew Shen, Jon Gjengset. [A Practical Analysis of Rust’s Concurrency Story](https://arxiv.org/abs/1904.12210). *CoRR*, 2019.

Nicholas Larus-Stone, Elaine Angelino, Daniel Alabi, Margo Seltzer, Vassilios Kaxiras, **Aditya Saligrama**, Cynthia Rudin. [Systems Optimizations for
Learning Certifiably Optimal Rule Lists](/files/sysml.pdf). *SysML (now MLSys) Conference*, 2018.

## Selected long-form blog posts

*Note: these posts were selected due to their exploration and synthesis of existing and new security vulnerabilities or techniques, providing a guide for future related security work.*

* [A student's dream: hacking (then fixing) Gradescope's autograder](/blog/post/gradescope-autograder-security/), February 28, 2023.
* [Dodging OAuth origin restrictions for Firebase spelunking](/blog/post/dodging-oauth-origin-restrictions/), November 23, 2022.
* [Firebase: Insecure by Default (feat. that one time our classmates tried to sue us)](/blog/post/firebase-insecure-by-default/), November 14, 2022.
* [Upgrading my personal security, part two: disk encryption and secure boot](https://saligrama.io/blog/post/upgrading-personal-security-evil-maid/), May 4, 2022.

## Talks

* [Hacking (then fixing) Gradescope's autograder](/files/talks/20230407-gradescope-autograder-security.pdf). April 7, 2023.
* [Hacking GraphQL for fun ~~and profit~~](/files/talks/20230310-graphql.pdf). March 10, 2023.
* [Applied Cyber x ASES Safety and Security Workshop](/files/talks/20230113-ases-security-workshop.pdf). *Joint w/ [Miles McCain](https://miles.land)*, January 13, 2023.
* [Stanford Applied Cyber Intro Security Workshop](/files/talks/20221014-intro-security-workshop.pdf). *Joint w/ [Cooper de Nicola](https://github.com/cdenicol)*, October 14, 2022.
* [A Trust and Safety Analysis of the Metaverse](/files/talks/20220524-metaverse-ts.pdf). May 24, 2022.
* [Fantastic OAuth tokens and where to find them](/files/talks/20220509-oauth.pdf). *Joint w/ [Glen Husman](https://github.com/glen3b)*, May 9, 2022. ([blog post](/blog/post/dodging-oauth-origin-restrictions/))
* [Firebase: Insecure by Default](/files/talks/20220218-firebase.pdf). *Joint w/ Miles McCain*, February 18, 2022. ([blog post](/blog/post/firebase-insecure-by-default))

## Education

**M.S. candidate in Computer Science**, Computer and Network Security track  
:  at Stanford University, *Feb 2023 -- Jun 2024 (expected)*
* **CS 255** *Introduction to Cryptography* (W '22)
* **CS 251** *Cryptocurrencies and Blockchain Technologies* (F '22)
* **CS 249I** *The Modern Internet* (W '23)
* **CS 229** *Machine Learning* (F '21)
* **CS 155** *Computer and Network Security* (S '22)
* **CS 153** *Applied Security at Scale* (W '23)
* **CS 144** *Introduction to Computer Networking* (S '23)
* **INTLPOL 268** *Hack Lab: Introduction to Cybersecurity* (F '21, TA F '22)
* **CS 199** *Independent Work -- Research with ESRG* (F '22, W '23)

**B.S. candidate in Computer Science**, Systems track  
:  at Stanford University, *Sep 2020 -- Jun 2024 (expected)*
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
* **DESIGN 151** *Designing your Business* (S '23)
* **LINGUIST 150** *Language and Society* (W '23)
* **PSYCH 1** *Introduction to Psychology* (F '22)
* **CLASSICS 136** *The Greek Invention of Mathematics* (S '22)
* **MI 70Q** *Photographing Nature* (W '22)
* **MUSIC 2C** *Introduction to Opera* (F '21)
* **ECON 50** *Economic Analysis I* (W '21)
* **SOC 9N** *2020 Election -- Introsem* (F '20)