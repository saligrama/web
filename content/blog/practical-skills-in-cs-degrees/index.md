---
title: "How practical should computer science degrees be, anyway?"
#description: <descriptive text here>
date: 2024-06-17T00:05:00-07:00
draft: false
toc: false
image: ""
tags: []
categories: []
---

The question of how much CS curricula should focus on theory and fundamentals versus practical applications ends up being the broken record of Reddit and Twitter CS discourse every few months. Having taught a [course](https://infracourse.cloud) that skews on the practical side of this spectrum, I strongly support efforts to incorporate practical skills into CS degrees.

But I also think that the discourse tends to treat the type of content that can be covered within a CS degree as a zero-sum game. Defining practical skills in opposition to the theoretical foundations of the subject is a false dichotomy; many courses, including those at Stanford, do successfully complement these fundamentals with their practical applications. 

Rather, I think that there are a number of seamless avenues for CS programs to incorporate such practical skills into their existing, more fundamental courses. Moreover, with CS being a young and constantly changing field, we should also constantly reevaluate our understanding of what in the field we consider to be fundamental, and universities should update their curricula accordingly.

<!--more-->

# The theory versus practice debate in context

Usually, this kind of discourse starts with a Reddit post in a subreddit such as `/r/csMajors` or `/r/cscareerquestions`, with the OP typically worrying about how their CS curriculum didn't teach them enough practical skills to be able to apply what they learned to the real world. 

In recent memory, these are two such posts that have blown up first on Reddit, and screenshots of these posts have subsequently gone viral on Twitter:

{{< figure src="images/r-csmajors-hackathon-202403.png" alt="\"Went to a hackathon, realized I don't know anything AT ALL\" -- /r/csMajors, March 24, 2024" position="center" caption="\"Went to a hackathon, realized I don't know anything AT ALL\" -- /r/csMajors, March 24, 2024" captionPosition="center" >}}

{{< figure src="images/r-csmajors-api-202406.png" alt="\"I'm about to graduate with a CS degree and have never used a \"library\", \"framework\", or \"API\", and not really sure what they are\" -- /r/csMajors, June 9, 2024" position="center" caption="\"I'm about to graduate with a CS degree and have never used a \"library\", \"framework\", or \"API\", and not really sure what they are\" -- /r/csMajors, June 9, 2024" captionPosition="center" >}}

Over on Twitter, discourse on the latter post also got mixed in with the idea that CS graduates don't know how to use Git, thanks to a quote tweet by YouTuber [Theo Browne](https://t3.gg).

{{< figure src="images/twitter-t3gg-git-202406.png" alt="\"The number of CS grads who don’t even know basic git commands is astounding\" -- Theo - t3.gg on Twitter, June 13, 2024" position="center" caption="\"The number of CS grads who don’t even know basic git commands is astounding\" -- Theo - t3.gg on Twitter, June 13, 2024" captionPosition="center" >}}

These posts then spawn a decent bit of debate on whether university CS curricula should teach practical tools such as Git, web frameworks, or cloud services. 

## The battle lines

Of what I've seen so far, a number of popular arguments in favor of teaching practical tools include:

* Given that the majority of CS graduates seek careers in software engineering, CS graduates should try to give students at least some preparation for some careers, which involves learning practical tools.
* Certain tools like Git and the Unix command line make students' lives easier even within the context of their own work, so it makes sense for students to learn these tools.
* Students never actually use what they learn in more theoretical courses, so CS education should focus primarily on the tools that students might see in industry.

Whereas a sampling of arguments against might include:

* CS students should primarily learn the fundamentals of computer science (i.e., the foundational principles that are naturally true of the field and will remain true N decades from now), rather than the frameworks and tools of the day that will become obsolete within a few years.
* The distinction between CS degrees and Software Engineering degrees is the focus on *theory* within a CS degree. If students want to learn practical skills, they should major in Software Engineering instead.
* Introducing too many practical tools within a CS degree (or a university in general) cheapens them to no different than bootcamps, or trade/vocational schools.

## Aside: the distinction between theory and fundamentals

You might notice the emphasis I added on the word *theory* above. I think a lot of nuance in this discourse gets lost in the overloaded use of the word *theoretical* to describe a foundational approach to teaching CS. In CS, *theory* refers to a specific branch of the field concerned with the capabilities and limitations of computation -- the mathematical bounds on the kinds of problems various computing models can solve. 

When people argue in favor of a "theoretical" approach to teaching CS, some really mean such a mathematically grounded approach. But I often see [posts](https://old.reddit.com/r/cscareerquestions/comments/akcmyx/will_a_more_theoretical_computer_science_degree/) -- often from high schoolers trying to choose between universities for CS -- describing courses like Operating Systems as "theoretical", even though that subject is anything but. They often assume that programs with (e.g.) a heavy systems focus will not teach them the practical skills they need to succeed in the field beyond college, even though such programs often do incorporate the use of practical tools within systems-focused foundational courses. 

As such, I want to be very careful about using the word "foundational" or "fundamental" rather than "theoretical" to describe the kinds of core courses that most CS programs require of undergraduates. Typically, this set of topics includes discrete mathematics, probability, data structures, design and analysis of algorithms, intro systems programming, and operating systems.

I should also point out that a number of people in favor of keeping CS "theoretical" have expressed that CS graduates should be expected to pick up any tool they might encounter in a career just by understanding the foundational principles. For example, the argument goes, "*if we teach students what a DAG is in an algorithms class, they should be able to understand how Git works*." Thus, they say, it is unnecessary to have any time set aside to teach practical skills -- which they argue is similar to a natural sciences approach: "*we shouldn't need to teach a biologist how to use a microscope; they should be expected to figure out how to use a microscope within an hour of needing to use it.*"

This analogy breaks down, however, because natural sciences programs *do* teach their students the practical skills relevant to their field. Lab work is a significant component of any such degree, and students *do* learn how to use microscopes and any other specialized equipment that better furthers the foundations they learn in their lecture courses. To have students better be able to apply the foundational knowledge they learn in their CS classes, then, CS students should also learn relevant practical tools, just as natural sciences students do.

# What should we expect from CS graduates?

Much of the discourse on the specific skills that should be taught in CS programs also veers into questioning what the goal of a CS program should be. Some think the primary role is to prepare graduates for industry software engineering careers, whereas others suggest it should only teach the natural foundations of the field similar to a math or natural sciences degree. 

But I think we can better answer the original question about course content through the context of what universities themselves express to be the objectives of their CS programs. If we take a look at the learning goals that CS programs themselves expect from their students (sampling top programs such as [Stanford](https://bulletin.stanford.edu/programs/CS-BS), [MIT](https://www.eecs.mit.edu/academics/undergraduate-programs/program-objectives-and-accreditation/), [UC Berkeley](https://eecs.berkeley.edu/academics/undergraduate/eecs-bs/objectives-outcomes/), [CMU](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/undergraduatecomputerscience/), [UIUC](http://catalog.illinois.edu/undergraduate/engineering/computer-science-bs/)), we see an obvious common thread between each of their stated objectives.

Namely, each program aims to educate students on the fundamentals of CS in a way that allows them to apply these principles to real-world problems. Beyond just understanding the foundations of the field, students should also be able to design and implement real systems by drawing on their foundations and other skills they learn. Thus, the idea that CS programs should exhibit an ivory tower-like focus on the fundamentals in isolation is unfounded within the context of the educational objectives of these programs themselves.

# Practical skills in support of CS fundamentals

If we acknowledge that university CS programs do have a responsibility to help their students make practical use of the fundamentals they learn, we can consider how opportunities to do so can be (or already are) incorporated into existing CS courses. 

Stanford generally does well at teaching practical skills in upper-division courses. A non-exhaustive set of such examples I've seen during my time at Stanford includes:

* [CS 144](https://cs144.stanford.edu) *Introduction to Computer Networking*'s intro assignment involves writing a simple HTTP client and an email client that can send (perhaps spoofed) emails across the internet.
* [CS 149](https://cs149.stanford.edu) *Parallel Computing* has students write CUDA code to build a [renderer](https://github.com/stanford-cs149/asst3) for overlapping colored circles.
* [CS 152](https://cs152.stanford.edu) *Trust and Safety Engineering*'s final project involves building a Discord moderation bot that calls the OpenAI API to protect against potential user harms.
* [CS 155](https://cs155.stanford.edu) *Computer and Network Security* (which I TA'd in Spring 2024) has students write attacks against a real web app and a simulated network environment.
* [CS 249I](https://cs249i.stanford.edu) *The Modern Internet* has students set up infrastructure to capture live data from the real internet (e.g., building route tables, scraping websites, and running a rudimentary honeypot for attacks) and respond to analytics questions on that data for homework.
* [CS 255](https://cs255.stanford.edu) *Introduction to Cryptography* has students implement a password manager and a secure messaging client using the cryptography APIs that real browser-based apps would use.

Stanford also has a number of supplementary courses that are more dedicated to teaching practical skills, although sometimes these don't count towards major requirements. Examples include:

* [CS 104](https://saraachour.github.io/stanford-cs104.github.io/) *Introduction to Essential Software Systems and Tools* covers development tools such as the shell, TUI editors, version control, and build systems essential to writing and maintaining code.
* [CS 147L](https://hci.stanford.edu/courses/cs147l/2023/au/) *Cross-Platform Mobile App Development*, which is a requirement for the Human-Computer Interaction track, teaches students how to build iOS and Android apps using React Native.
* [CS 40](https://infracourse.cloud) *Cloud Infrastructure and Scalable Application Deployment* (which I designed and taught in Winter 2024) teaches students how to deploy and maintain large-scale web applications using public cloud infrastructure.
* [INTLPOL 268](https://archive.ph/PfEXU) *Hack Lab: Introduction to Cybersecurity* (which I TA'd in Fall 2022) has students attack real web, network, and Windows systems using practical tools like Burp Suite, Metasploit, and `aircrack-ng`.

That being said, none of the above courses are anywhere close to a requirement for *all* CS majors. I think Stanford could make some improvements on weaving practical material into its core CS courses. [CS 107](https://web.stanford.edu/class/archive/cs/cs107/cs107.1246/) *Computer Organization and Systems* does introduce students to using the [Unix command line](https://web.stanford.edu/class/archive/cs/cs107/cs107.1246/resources/unix.html) and [TUI editors such as Emacs](https://web.stanford.edu/class/archive/cs/cs107/cs107.1246/resources/emacs.html), but other courses could make small tweaks in this direction as well.

For example, [CS 106B](https://cs106b.stanford.edu) *Programming Abstractions* uses a custom data structure library without significant benefits over STL C++, but locks students into using the nonstandard QT Creator editor to write their code. In my opinion, it wouldn't take much more effort for students to learn STL C++ directly, with the added benefit of using more standard editor and build tools.

Similarly, both CS 107 and [CS 111](https://cs111.stanford.edu) *Operating Systems Principles* use a Git-based submission mechanism, but obscure the fact that Git is what is being used under the hood. These courses could expose more of the Git functionality to students and teach them a little bit about version control in the process. 

# Rethinking what counts as a CS fundamental

What I think has been most lost in the discourse has been the question of what we should actually consider to be a fundamental topic in CS. Proponents of keeping CS degrees foundational consider mathematical, algorithmic, and systems principles to be fundamental to the field; therefore, any other concepts taught within a CS degree are merely auxiliary. To be somewhat charitable to this argument, if we went back 30 or so years in time, it *was* probably the case that many computing problems could be solved building on such fundamental approaches.

But I would argue that within the last 30 years, the *scope* of the computing problems that CS graduates solve has expanded such that we now need to consider a supplemental set of topics to be fundamental to a CS education. In no particular order, I would additionally designate the following topics as fundamental:

* **Computer networking**. Few computing solutions today are designed to work within the isolated context of a single machine; thus, I think CS graduates need to have a solid understanding of the groundwork that allows machines to talk to each other. 
    - Students should at least know enough about network (link, internet, transport, application) protocols and routing to be able to intuitively and deeply answer a question like "What happens when you navigate to `google.com` in your browser?"
    - This doesn't need to be a full-fat networking course like [CS 144](https://cs144.stanford.edu) (although this was a well-taught class that I greatly enjoyed), but enough material from such a course appears so many times elsewhere in computing that I've had to recap CS 144 in a single lecture for teaching roles in [CS 40](https://infracourse.cloud/lectures/2024-01-10-networking-crash-course.pdf) and [CS 155](https://saligrama.io/files/talks/20240517-internet-protocols-network-security.pdf).

* **Web systems**. For better or worse, nearly every computer system an end user interacts with involves web clients and servers in some way. Thus, students should know how scalable, real-time, and responsive web systems -- those involving complex backends, frontends, and supporting infrastructure -- are put together and how and why they deliver fast user-friendly experiences.
    - Such a course unfortunately doesn't exist at Stanford -- before [CS 110](https://cs110.stanford.edu) *Principles of Computer Systems* was sunset in Winter 2022, that course did cover useful web and backend (HTTP, APIs, MapReduce) content, but its replacement in CS 111 no longer teaches this. CS 40 was my effort at demystifying the cloud infrastructure aspect of web systems for Stanford students.
    - These courses do exist at other universities. For example, [EECS 485](https://eecs485.org/) *Web Systems* at UMich teaches students how to build rich web applications with complex frontends and backends.

* **Computer security**. If we implicitly entrust CS graduates to building widely used future computing applications, then we should also [ensure](https://hbr.org/2019/08/every-computer-science-degree-should-require-a-course-in-cybersecurity) that students have a solid understanding of security principles in order to build in a way that doesn't leave user data or privacy at risk of compromise.
    - Here, I think the choice of which security techniques to cover is less important than ensuring that graduates are left with the impression of a [security mindset](https://cubist.cs.washington.edu/Security/2007/11/22/why-a-computer-security-course-blog/) -- the instinct to question what vulnerabilities might be lurking in any system you work on, and how to defend against possible such attacks.

While I think students would greatly benefit from taking a full course in each of these areas, I do think it's possible to condense these topics into a single course if there isn't much space to add additional requirements to a CS degree. This would at least give students an introduction to the basic and most important principles in these areas, and provide a jumping-off point for further exploration.

Who knows what we'll consider to be fundamental topics in computing 10, 30, or 50 years from now? It's entirely possible that the current rapid innovation within the LLM space manages to meaningfully change how we approach computing problems, or that quantum computing will blow the doors off of modern cryptography and significantly speed up other algorithmic techniques.

Thus, just as we should update curricula today to reflect the new fundamentals of the 2000s and 2010s, we should also take care to ensure that at no point the understanding of what CS topics are fundamental is frozen in amber. Universities would be well-served to continuously reevaluate this understanding and update their curricula accordingly, perhaps every five to ten years or so. They should make sure to embrace the innovations that have widely become best practices in industry and elsewhere, while rejecting the inclusion of the latest hype technology of the year solely based on that hype.

# Concluding thoughts

A sometimes-explicit undercurrent that I often see within this discourse is the idea that students should really be learning practical skills on their own time, and that the ability to self-learn these concepts is an important signal to employers of students' drive and resourcefulness.

I can't deny that self-learning can be effective. After all, my path towards my current work in security and infrastructure started with installing Linux on my laptop and learning Python in middle school.

But if we accept this argument as is, I do think that universities should retain some responsiblity in guiding students towards what kinds of concepts and tools they should be learning. After all, what else is the point of an education that costs up to hundreds of thousands of dollars if a student needs to do *all* of the work of both figuring out what to learn *and* doing that learning on their own time? This is especially an issue for those who might be newer to the field, as there's more legwork involved in figuring out what more to learn coming in with less background.

Regardless, there's an old adage that states that "unapplied knowledge benefits no one." I don't think this is unreservedly true within CS: even if I haven't directly applied certain concepts I learned in my automata theory and algorithms classes, they did substantially influence how I think about computing problems. But it is undeniable that applying the concepts you learn helps your understanding of those concepts. 

Thus, universities should make sure students have as many opportunities as possible to apply the fundamentals they learn. This necessarily involves teaching practical skills alongside these foundations, as well as expanding the scope of what we consider to be fundamental to leave students better rounded.