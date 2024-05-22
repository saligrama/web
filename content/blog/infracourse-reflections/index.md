---
title: "Reflections on teaching a Stanford cloud course"
#description: <descriptive text here>
date: 2024-05-22T10:00:00-07:00
draft: false
toc: false
image: ""
tags: []
categories: []
---

*This is the third post in a three-part retrospective on teaching [CS 40](https://infracourse.cloud).*

Teaching CS 40 was an incredible experience, and I'm proud of the impact we made in helping students learn how to implement their ideas on the cloud. It was my first time being the principal instructor of a course, and I learned a lot about teaching in the process -- both in ways specific to CS 40, and more generally. 

In this post, I share a number of reflections from the teaching process for CS 40. These are insights I would have loved to have known before the quarter started, and they inform some changes that I'd like to make before the course's next offering.

<!--more-->

Some of these insights came from difficulties encountered during the quarter, both by us and by students:

* [You don't know in advance how well lecture material will land](#you-dont-know-in-advance-how-well-lecture-material-will-land)
* [We could have better calibrated assignment difficulty](#we-could-have-better-calibrated-assignment-difficulty)
* [Designing IaC assignments is tough](#designing-iac-assignments-is-tough)
* [AWS CDK made students' lives harder](#aws-cdk-made-students-lives-harder)

On the other hand, I also wanted to take note of and express gratitude for what worked really well:

* [Building course infrastructure on limited notice was a fun challenge](#building-course-infrastructure-on-limited-notice-was-a-fun-challenge)
* [Guest speakers who drive course content forward are your greatest asset](#guest-speakers-who-drive-course-content-forward-are-your-greatest-asset)
* [We didn't know how novel CS 40 was](#we-didnt-know-how-novel-cs-40-was)

# You don't know in advance how well lecture material will land

Given our [motivations](/blog/infracourse-how-to-setup/#course-motivation) in launching CS 40 and our desire to make the course as accessible as possible to a broad audience, we wanted to keep the barrier to entry as low as possible while ensuring students would still be able to stay on top of the course. Our official prerequisite for the course was programming maturity to the level of [CS 107](https://web.stanford.edu/class/cs107/) *Computer Organization and Systems* as well as some Unix command-line experience. We didn't expect students to have any prior web development or computer networking experience. Thus, some students might be seeing basic web and networking content for the very first time, which we didn't have much time to cover in the beginning of the course.

Yet, I implicitly targeted some of the lecture material towards what I would have wanted to learn two years ago -- a past self that had strong CS, web, and software development expertise, but limited cloud knowledge. However, this wasn't well aligned with a student who had completed all our stated prerequisites.

I often found myself in the middle of a lecture talking about some concept, not sure how well students were understanding the material, especially when students didn't have any questions for me. This became even more difficult as student attendance steadily declined to around 20% by mid-quarter; as we didn't release recordings, we didn't know if the lecture slides were enough for students to stay on top of the course. Moreover, since our lecture content didn't correspond exactly to what was covered in assignments, the questions we got about assignments in office hours and on Ed (our discussion forum) weren't helpful for calibration.

Ultimately, I think the vast majority of students *did* take away the core learnings we expected them to glean from the lecture content. That being said, most students also had some cloud or web experience coming into the course -- neither of which we expected them to have. 

{{< figure src="images/intro-survey.png" alt="Students' prior experience with web and cloud technologies" position="center" style="border-radius: 8px;" caption="Students' prior experience with web and cloud technologies" captionPosition="center" >}}

At Stanford, I've frequently heard that the first offerings of new courses will generally have a self-selecting batch of students with more prior experience in the given subject area than expected, but that the average student prior experience level drops in subsequent offerings. Thus, we might need to spend more time on background concepts in the future -- in particular, networking and web apps. Additionally, we might add more to Assignment 1 in order to help students build up some of these background skills that would help them throughout the course.

# We could have better calibrated assignment difficulty

From the moment we first started working on course material over the summer, we knew that [Assignment 2](https://infracourse.cloud/assignments/2) -- deploying the Yoctogram frontend and backend to AWS using infrastructure-as-code -- would be the most difficult for students to complete. This assignment had by far the most moving parts, both for us and for students, and we had planned to give students nearly three weeks to complete it, anticipating that it would take about 10-15 hours to complete, including debugging.

We released Assignment 2 on January 25 and had it initially due on February 13, warning students of its difficulty, especially compared to Assignment 1. But as the weeks ticked by, we observed that students didn't start the assignment until very close to the due date. By February 11, two days before the due date, only two of 50 students had submitted; one day later, that number had only risen to seven. We wound up giving students an extra late day with which to complete the assignment, and offered nearly continuous office hours coverage on February 13.

Students later told us that they severely misjudged the difficulty of Assignment 2. We gave students the same amount of time to complete [Assignment 1](https://infracourse.cloud/assignments/1) (out January 8, due January 26), but that assignment was a simple AWS account setup exercise that involved deploying a static webpage to an EC2 instance running Nginx; most students spent less than an hour on it. When we told them that Assignment 2 was much harder, they assumed we meant something in the 3-5 hour range -- doable within a productive evening -- rather than the 10-15 hour range we expected.

Assignment 1 was as simple as it was primarily due to the add-drop deadline being on January 26. We didn't want to give students $200 each in AWS credits before that date, and as such we had them use free tier-eligible AWS resources only for that assignment.

However, this constraint won't prevent us from better calibrating the difficulty of Assignment 1 to the rest of the course; we can still achieve plenty on free EC2 instances. Next year's Assignment 1 will go further than this year's -- potentially involving deploying the full Yoctogram frontend and backend on a single EC2 instance. 

# Designing IaC assignments is tough

One of the challenges we anticipated CS 40 students might struggle with was the sheer amount of fully new content we were throwing at them. Given our stated prerequisites, we tried to keep the assignment content fairly straightforward in order to give students experience with cloud constructs while not being overwhelming. For example, we chose the AWS Cloud Development Kit (CDK) in Python as the IaC language used to deploy example web apps in AWS, to ensure that students wouldn't need to learn a new language to deploy IaC.

The starter code for Assignment 2 gave students a number of fully predefined CDK constructs, as well as some shell definitions that they needed to further fill in in order to declare AWS resources such as subnets in a Virtual Private Cloud (VPC), an Aurora Serverless v2 for Postgres database, container hosting on Elastic Container Service (ECS), and frontend hosting using S3 and Cloudfront.

Given our experiences in designing the assignment, we tried to abstract away the parts that we thought might be too painful for students to do on their own. For example, we predefined some of the S3 buckets and Cloudfront CDNs for hosting images, as they required intricate Cross-Origin Resource Sharing (CORS) rules to make things work.

In practice, this meant that the parts that students actually had to complete boiled down to adding configurations to shell CDK constructs exactly as we told them in the assignment handout, such as the password policy for the database and resource limits and networking configuration for the ECS cluster and containers. 

This meant that students didn't fully get the chance to think through the logical organization of cloud resources they would need for deploying an app like Yoctogram. Moreover, I think students could have learned more if we provided less scaffolding and actually had them interface with some of the sharp edges we encountered during development. 

The other downside of this approach was that it also made it difficult for students to learn to debug IaC. We found that students had difficulty isolating what about their IaC was causing any particular deployment failure, although properties intrinsic to AWS and CDK definitely contributed to this issue (see below). Unfortunately, this also left students with less preparation than we would have liked to tackle the final project, which involved deploying a web app of their choice from scratch using IaC. The final project wound up being many students' first experience with troubleshooting IaC failures without our scaffolding. 

Next year, we'll try to significantly reduce the scaffolding we provide students, focusing on letting them make more architectural deployment choices and honing their debugging skills.

# AWS CDK made students' lives harder

We ran into a number of sharp edges with CDK's state management such that failures became very difficult for students to debug. Many of these issues stem from the fact that CDK is a leaky abstraction over AWS CloudFormation: when you write CDK configuration in (e.g.) Python, CDK will transpile or "synthesize" it to a big JSON blob that will then be deployed via CloudFormation. Thus, CDK inherits CloudFormation's well-known state management issues.

For example, take what happens when you attempt to deploy a container to ECS. Assignment 2 (deploying Yoctogram) had students write CDK for a an ECS cluster, load-balanced Fargate service pattern, and task and container definitions to deploy the Yoctogram backend. This involved, among other tasks, defining environment variables in the container definition to ensure the Python/FastAPI code within could connect to the Aurora Serverless database.

When students had typos in their environment variables, the FastAPI code in the container would refuse to initialize as it couldn't connect to the database. This would cause the container to crash, sending ECS into a [restart loop](https://dev.to/aws-builders/aws-ecs-restart-loops-1lj4) that would take up to 10 minutes to drain the container and another few minutes to reinitialize it. Unfortunately, CloudFormation assumes the restart loop is its own fault, and keeps attempting to force the ECS deployment for up to 5 loops, all while displaying a `CREATE_IN_PROGRESS` status that doesn't indicate any failures.

Students would often come to office hours not knowing how to debug this deployment that looked stuck; we would often have to guide them through the process of looking through the CloudFormation and ECS consoles for more signal. In particular, figuring out what was wrong about the container specification was hard because the default filter for ECS task logs in the console selects only running tasks; in a restart loop it's common to only see stopped tasks if looking at the console.

Next year, we'll look into using different IaC frameworks for student deployments; in particular, Terraform or OpenTofu.

# Building course infrastructure on limited notice was a fun challenge

While we were able to plan and build some of the [infrastructure](/blog/infracourse-infra) we needed for the course before the quarter started, there was still a substantial amount that we had to build on very short notice. Much of this stemmed from not knowing the specifications of what we needed to build until we were at the point of needing that particular piece of infra.

## Distributing AWS credits

It wasn't until well into the quarter that we could confirm how students' AWS accounts would be set up. Initially, we expected to have each student set up their own AWS accounts, to which AWS would either deposit credits directly or email students links to deposit credits.

After our request for $200 of credits per student was approved, our account reps recommended that we colocate student AWS accounts on Stanford's [Cardinal Cloud](https://uit.stanford.edu/cardinal-cloud), a joint purchasing program that has volume discounts and could make it easier for students to get GPU resources for a possible machine learning assignment. This scheme would have Stanford's University IT team set up student accounts, to which students would sign into using their Stanford login and AWS could distribute credits directly. However, this required us to link the course to a research billing account, which appeared nontrivial. 

Eventually, we settled on students using their own AWS accounts, mainly with free tier resources until the add/drop deadline, at which point they could get credits. However, one week before students needed the credits to start Assignment 2, AWS just sent us a spreadsheet with a number of credit codes rather than distributing to students individually, so we had to come up with a way to distribute these credits ourselves within that week. We [integrated](/blog/infracourse-infra/#distributing-aws-credits) that functionality into our [DNS provisioner](https://github.com/infracourse/dns-provisioner).

## Provisioning DNS A records

Downstream of the AWS account structure issue was the question of how students would complete Assignment 1, for which they needed a DNS record pointing to their EC2 instance serving a static site in order to set up Let's Encrypt. 

While we were working on releasing Assignment 1, we were still evaluating the possibility of having students switch to a Cardinal Cloud-issued AWS account for subsequent assignments. At this point we'd had the [NS record provisioner](/blog/infracourse-infra/#dns-delegation) built out for a while, but we realized that Route 53 hosted zones cost $0.50 per month and were not free-tier eligible. If we were going to have students apply credits to a different account, they would incur a $0.50 charge that they would have to pay themselves, but we didn't want students to pay any out-of-pocket cost for the course. 

Thus, just before we released Assignment 1, we had to make a quick change to our DNS provisioner for Assignment 1 to simply assign `A` records of the form `a1.SUNETID.infracourse.cloud` directly to a student's EC2 IP address.

## Autograders

Since our pre-quarter preparation was mostly focused on creating assignments and lecture material, we didn't start building the [autograders](/blog/infracourse-infra/#autograding) until after the assignments were released (though we knew what student deliverables would need to look like in order to give us something that could be autograded).

Since one of our goals was to give students early feedback on assignments to let them know if their implementation was up to specification, we tried to release the autograders before most students had submitted the assignment. Often, this would involve sitting down on late nights and weekends and writing thousands of lines of Go, Python, and Rego to get it done in time.

Difficulties included making sure the autograder didn't assign undeserved points, making sure it didn't penalize students with a correct implementation, and hardening the architecture against the [Gradescope attack](/blog/gradescope-autograder-security) I wrote about previously -- especially since one of our course policies included potential extra credit for confirmed vulnerability reports. 

# Guest speakers who drive course content forward are your greatest asset

When developing the course, we knew we wanted to feature lectures by guest speakers from industry as a way to inform students about how the tools and concepts they were learning are applied at a larger scale.

At Stanford, many other courses invite industry guests to give lectures, too, but often guest speakers will talk broadly about the course topic space as a whole with limited direct connection to course material. With CS 40, we knew we had limited time to cover all the content we wanted to get through over the quarter, and we were hoping our guest speakers would be able to give students a unique industry perspective on cloud infrastructure.

I'm happy to say that all of our guest speakers for CS 40 slotted in perfectly to drive course content forward in ways well tailored to their expertise. [Benjamin Bercovitz](https://www.linkedin.com/in/benjaminbercovitz/) (Verkada) gave a lecture on cloud databases and optimal application design around databases; [Maria Zhang](https://www.linkedin.com/in/mariarenhuizhang/) (formerly Google and Meta) and [Mike Abbott](https://www.linkedin.com/in/michaelabbott/) (GM, formerly Apple and Twitter) talked about solving large-scale problems using the cloud; [Corey Quinn](https://x.com/QuinnyPig) (Duckbill Group) gave a hilariously entertaining talk on cloud billing; and last but not least [Ruslan Meshenberg](https://www.linkedin.com/in/ruslanmeshenberg/) (Google, formerly Netflix) delivered incredibly useful content on the history of the cloud ecosystem and solving reliability problems in the early days of cloud. 

{{< figure src="images/infracourse-quinn-billing-lecture.jpg" alt="Corey Quinn's lecture on cloud billing" position="center" style="border-radius: 8px;" caption="Corey Quinn's lecture on cloud billing" captionPosition="center" >}}

This is a huge shoutout to all our guest speakers -- thank you!

# We didn't know how novel CS 40 was

While building and teaching the class, it was easy to get caught up in the day-to-day and the overwhelming number of tasks that needed to be done at any given time. It wasn't until well after we had submitted the final grades to the registrar and I'd started my spring-quarter teaching role as a Course Assistant for [CS 155](https://cs155.stanford.edu) *Computer and Network Security* that I started to reflect on CS 40 in a broader context.

## The existing landscape of cloud courses

One of the first, unnoticed signs of novelty was probably the significant difficulty we encountered over the summer in finding any prior art for a hands-on cloud course. At the time, I think I assumed that this was simply due to other universities' CS departments being less open with their course materials than Stanford. 

As far as what was publicly available, the vast majority of what we found were online courses in non-degree granting programs, usually targeted at mid-career professionals experienced in on-premise systems administration looking to make a career change to cloud DevOps. Unfortunately, the course material wouldn't work for our target audience, as they assumed more background with Unix, virtualization, and networking than our students would have.

We also found a number of undergraduate and masters-level courses from universities such as [UC Berkeley](https://web.archive.org/web/20211230144202/https://calcloud.org/) (student-taught), [UIUC](https://ws.engr.illinois.edu/sitemanager/getfile.asp?id=510), and [Cornell](https://www.cs.cornell.edu/courses/cs5412/2022fa/), as well as one offered at [Stanford](https://web.stanford.edu/class/cs349d/) by our advisors [Christos Kozyrakis](https://web.stanford.edu/~kozyraki/) and [Mike Abbott](https://www.linkedin.com/in/michaelabbott/). However, these tended to be focused on either application-level tools in isolation from the cloud, data analysis using the cloud, or the theory of cloud computing.

In contrast, we wanted to offer a course that taught fundamental cloud fluency and skills to students with some software development background. We wanted our course to focus on application deployment via the cloud, as that would best enable the types of tasks that students might see in industry or while launching a startup. 

Setting the framing aside, we were also not able to find any instance of a course teaching students how to use infrastructure-as-code, which we thought was a foundational concept in terms of systematically deploying cloud resources. Additionally, no existing course had assignments tailored towards serverless application design, which is a principal benefit that modern public cloud providers offer over traditional data centers.

## CS 40's unique niche

The lack of prior art forced us to think through all aspects of what students might learn from lectures and assignments.

For us, CS 40's unique niche, beyond just enumerating the types of services offered by cloud providers, was the "scalable application deployment" aspect of the course title. We designed the lectures with significant emphasis on application design in a way that best takes advantage of modern cloud services for scalability to a broad number of users with minimal cost and system administration overhead. For example, our [final lecture](https://infracourse.cloud/lectures/2024-03-13-everything-we-forgot-to-tell-you.pdf) featured some examples on application architecture in ways that might be useful in designing a new startup app, or that might come up on a new-grad system design interview.

Meanwhile, as far as assignments went, our goal above all was to offer students a safe sandbox in which to experiment with cloud deployments, while providing some structure in learning how to do so systematically. This involved designing a novel set of assignments that gave students practice in actually deploying applications in serverless patterns using infrastructure-as-code.

After receiving evaluations from the winter, I'm happy to say that we achieved our stated goals: students broadly praised CS 40 for helping them learn how modern web applications work under the hood. I'm particularly proud of the review from the student for which CS 40 was "the missing building block in building full-stack cloud awareness" coming from a mostly frontend background. Getting there was no easy task.