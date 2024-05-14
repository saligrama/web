---
title: "What infra do you need for an infra course?"
#description: <descriptive text here>
date: 2024-05-02T16:00:00-07:00
draft: false
showToc: true
image: ""
tags: []
categories: []
aliases: [/blog/post/infracourse-infra]
---

*This is the second post in a three-part retrospective on teaching CS 40.*

With 50 students enrolled in CS 40 in Winter 2024 and only three members of the teaching staff, we knew that we would need to automate as much of the course management as possible. Given how novel our course material was, this necessitated building a *lot* of custom infrastructure, both for students to use, and for us to manage the course.

<!--more-->

# A typical CS course software stack

In any Stanford CS course, you can usually expect to see the same few key EdTech software-as-a-service [products](https://twitter.com/itsandrewgao/status/1771408009388020080) being used to manage the class. Typically, these are:

* A static course website for general course information, often hosted on GitHub Pages or [AFS hosting](https://uit.stanford.edu/service/web/centralhosting).
    - Stanford CS classes typically use their own websites rather than an LMS like Canvas, often in the interest of making some course material public.
* A discussion forum; [Ed](https://edstem.org) has generally replaced Piazza since 2020 due to [privacy concerns](https://stanforddaily.com/2020/10/04/concerned-with-piazzas-data-privacy-management-some-professors-look-to-alternative-discussion-forums/).
* A grading platform; Gradescope has been widely used for both manual and autograding in recent years.

To nobody's surprise, CS 40 used all of these components. We used Ed and Gradescope, and since we were interested in having all our course material be public, eschewed Canvas and hosted our main website on Cloudflare Pages.

That said, to my knowledge, CS 40 is the only university course that focuses on hands-on deployments of web applications to the cloud using infrastructure-as-code (IaC). This created a number of interesting infrastructure challenges for us as instructors.

# Yoctogram

Since web development expertise was beyond the scope of the course, we needed to have an example web app with both a backend and a frontend for students to deploy. Inspired by [this article on Instagram's early architecture](https://read.engineerscodex.com/p/how-instagram-scaled-to-14-million), we decided to build a minimal image-sharing app in its vein. 

{{< figure src="images/instagram-architecture.png" alt="Instagram's architecture as an early-stage startup" position="center" style="border-radius: 8px;" caption="Instagram's architecture as an early-stage startup" captionPosition="center" >}}

We decided to modernize the architecture a little and adopt serverless design wherever we could. Instead of dedicated VMs for application servers, we used containers via [AWS Elastic Container Service](https://aws.amazon.com/ecs/). We hosted the Postgres database using [AWS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) rather than managing Postgres on an EC2 VM. We cut down on some of the application features (in particular, the entire follower-following social model) which allowed us to simplify the data model and avoid needing to use Redis.

Over the course of fall 2023, I steadily built out the [backend](https://github.com/infracourse/yoctogram-app) for Yoctogram using Python and FastAPI. Our friend [Ruslan Al-Jabari](https://www.linkedin.com/in/ruslan-al-jabari-67277619a/) helped us out majorly by building out the [frontend](https://github.com/infracourse/yoctogram-web) using React.

For deployment, we wrote the IaC in [AWS CDK](https://aws.amazon.com/cdk/) using Python. To form the assignment starter code, we simply ripped out some sections from the finished code that we wanted students to write.

# DNS delegation

That our assignments let students deploy publicly accessible cloud resources necessitated letting each student have a full domain name and control over their DNS zone. Using raw IP addresses may have worked in some cases, but we wanted all deployments to be accessible over HTTPS, since only offering unencrypted HTTP for a deployed web resource is *so 2014*.

When developing the course, our first thought was to let students buy their own domain names from AWS's Route 53 domain registrar using credits we'd give them. Unfortunately, AWS doesn't allow you to buy domain names using credits. 

Since we needed to buy a domain name for the course, we decided to instead let students delegate a subzone hanging off the course's main domain name to their own AWS Route 53 environment.

Originally, we had planned to buy `infracourse.dev` for the main course domain, but we realized that the entire `.dev` TLD is on the [HSTS preload list](https://hstspreload.org/). That is, if the service on any subzone of `.dev` doesn't offer HTTPS, a browser will refuse to load it -- which meant that students wouldn't be effectively able to test a new deployment using HTTP before adding HTTPS support. Thus, we settled on `infracourse.cloud` and bought it from Cloudflare's domain registrar given their easy-to-use DNS REST API.

To let students delegate a subzone of `infracourse.cloud` to their AWS Route 53 environment, we built a small [utility](https://provisiondns.infracourse.cloud) using Cloudflare Pages, where after students sign in using their Stanford Google account, the site checks their membership in the CS 40 Canvas course. Upon validation, the student can enter their Route 53 nameservers, and the site adds each nameserver as an NS record for `SUNET.infracourse.cloud`, where `SUNET` denotes a Stanford username (mine is `akps`).

The source code for this utility is [public](https://github.com/infracourse/dns-provisioner).

# Distributing AWS credits

CS 40 made extensive use of AWS cloud resources, which have a reputation for being expensive. Of course, we didn't want students to incur any out-of-pocket costs for taking the course, and as such AWS graciously agreed to sponsor the class with $200 of credit per student.

From AWS we received an Excel spreadsheet with a credit code per student, which meant that we were in charge of distributing the codes to students. We didn't want to use email as we didn't want to risk credit codes getting lost in delivery.

Instead, we added functionality to the DNS provisioner that stored the codes in [Cloudflare KV](https://developers.cloudflare.com/kv/) and displayed a popup with a student's assigned code on login.

# Autograding

With 50 students enrolled, hand-grading students' IaC submissions seemed like a frustrating endeavor. We wanted to therefore build an autograder with two main goals:

1. Ensure that the infrastructure being used for an assignment deployment met the set of specifications laid out in the assignment handout.
2. Ensure that the resulting deployed web app works as intended.

Our code is [open-source](https://github.com/infracourse/iac-grader).

## Static checks

To meet the first criterion, we first explored the option of using [CDK unit tests](https://docs.aws.amazon.com/cdk/v2/guide/testing.html). Unfortunately, this requires the grading code to import student code as a module and run it in its process, which is a bad idea for [reasons I've written about in the past](/blog/post/gradescope-autograder-security), especially in the context of Gradescope. 

From my time interning at Verkada in summer 2023, I'd learned about using [Open Policy Agent](https://www.openpolicyagent.org/) to enforce security policies (such as *make sure an S3 bucket denies public/anonymous access*) on IaC before production deployment. OPA supports evaluating policies over arbitrary JSON, and the output of synthesizing imperative CDK to CloudFormation declarative configuration is JSON, so this seemed like the right direction to go.

We reasoned that as long as we could separate where `cdk synth` (which actually runs the student code) gets run from where the OPA static checks get run, the grading flow would be safe against attempted student tampering.

This still left the open question of where to actually run each component. We first considered using [GitHub Classroom](https://classroom.github.com), which would let us treat the grading flow as a GitHub Action and simply use separate containers for each component. Unfortunately, we ran into a number of limitations here with regards to the interface for scoring student code; in particular, it expected us to use its own test case format rather than simply declaring a final student score.

So we ended up back on Gradescope, with the limitation that student code couldn't run anywhere in Gradescope. Moreover, `cdk synth` requires authorization to *some* AWS account, in order to make some ostensibly account-specific feature availability lookups (even though the result is nearly always the same across accounts). Unfortunately, Gradescope autograders don't support environment variables, so doing this securely would be a challenge. 

We instead decided to have the `cdk synth` run within an [AWS Lambda](https://aws.amazon.com/lambda/), receiving the student-submitted CDK Python code in an HTTP request from the Gradescope grading container and responding with the synthesized CloudFormation JSON. Gradescope then ran our suite of OPA checks and outputted the grade.

## Liveness checks

To meet the second criterion, we needed to have the grader interact with both the  backend and frontend of the deployed student app. Ensuring that the backend worked was fairly straightforward, as we could just call the API routes to register and log in with a randomly generated test user, upload an image, and retrieve the uploaded image. 

However, scoring the frontend was harder. Since the frontend was being served as a static collection of files via [S3](https://aws.amazon.com/s3/) and [Cloudfront](https://aws.amazon.com/cloudfront/), we were relatively confident that a student's frontend loaded at all, it would function as intended. However, we realized that trying to directly compare the served frontend Javascript bundle to a reference collection wouldn't work, since JS minification is not necessarily deterministic. 

Thus, we spun up a headless Chrome instance in the Gradescope grading container via [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/), which would browse to the student site and capture a screenshot. We then compared the [PDQ perceptual hash](https://about.fb.com/news/2019/08/open-source-photo-video-matching/) of the screenshot to a reference we had saved, and gave credit as long as a close match was detected.

## Verifying usage of the Datadog console

[Assignment 3](https://infracourse.cloud/assignments/3) had students integrate Datadog for better observability within their deployment. While we added some OPA checks to make sure students configured the Datadog ECS sidecar container properly in CDK, we also wanted to make sure that it was properly reporting logs, metrics, and profiles to Datadog without having access to student Datadog accounts.

Given that AWS by default doesn't log HTTP requests made to an [Elastic Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html), we decided to embed a randomized flag in an HTTP request header that would only be easy to find using Datadog. To do so, we added some more functionality to the DNS provisioner on Cloudflare where students could log in and generate the HTTP request, and we stored the generated flag in Cloudflare KV. Students then included the flag on submission, and we had another endpoint in the provisioner where the Gradescope grader could check that the submitted flag was correct for the student. 

# Conclusion

Building CS 40's course infrastructure wasn't just a necessity; it was fun for me too! While teaching, I would often joke that CS 40 ran more infra than an average small startup. In retrospect, building and teaching CS 40 allowed me to experiment with solving novel infrastructure and technical challenges, just as a startup would, but without immediate pressure to keep a company afloat at the same time too.

I'm happy with most of the tech stack decisions we made, but a few of them caused some pain for us and students and weren't the right choices in retrospect. I'll write about these, as well as other reflections on teaching, soon.

*To be continued: reflections on teaching CS 40.*