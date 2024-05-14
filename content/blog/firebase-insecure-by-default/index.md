---
title: "Firebase: Insecure by Default (feat. that one time our classmates tried to sue us)"
#description: <descriptive text here>
date: 2022-11-14T12:55:00-08:00 # TODO
draft: false
showToc: true
image: ""
tags: []
categories: []
aliases: [/blog/post/firebase-insecure-by-default]
---

By shifting the data authorization and access restriction burden from robust programmatic systems running on a server to static security rules, backend-as-a-service platforms like [Google Firebase](https://firebase.google.com) put new app developers and their products at risk of catastrophic data breaches if utmost care is not paid to the efficacy of these rules. 

This blog post details how to find such vulnerabilities in apps using Firebase as a backend. I also tell the story of one such vulnerability I found (along with [Miles McCain](https://miles.land) and [Cooper de Nicola](https://github.com/cdenicola)) in [Fizz](https://fizzsocial.app), a popular anonymous posting platform at Stanford and other universities. Fizz's improper handling of Firebase security rules allowed full deanonymization of all posts down to email and/or phone number and unauthorized granting of moderator permissions.

Lastly, I talk about legal threats we received in the course of disclosing these vulnerabilities.

<!--more-->

# Intro

With software and programming starting to become almost a lingua franca of today’s world, the state of tooling for app development has become better and better in recent years in terms of usability for new developers. One such tool is [Firebase](https://firebase.google.com/), Google’s flagship “backend-as-a-service” app platform. 

Firebase’s big selling point for early-stage app development is that it abstracts away the need to write a full backend and maintain one’s own database. Firebase can handle [authentication](https://firebase.google.com/docs/auth) (including MFA and SSO solutions) and its document-structured [Cloud Firestore (CFS)](https://firebase.google.com/docs/firestore) and [Realtime Database (RTDB)](https://firebase.google.com/docs/database) datastore offerings allow significant flexibility in terms of the data they can store. This is extremely appealing to developers in an early or prototyping stage as data models can change frequently.

# Firebase and data security

As Firebase serves as the backend itself, clients such as web and mobile apps connect directly to both the authentication system and to the datastore itself using a set of API keys that are distributed with every client instance (i.e., every app download has the same set of Firebase API keys embedded in it). There is no programmatic authorization system for restricting which clients can see what data, as there would be in a traditional client-server-database model. 

{{< figure src="https://uploads-ssl.webflow.com/5e39239f2e417c1a357f71f5/60927deba737083eb80929d0_traditional-firebase.svg" alt="Firebase's client model versus traditional (Iosiro Security)" position="center" style="border-radius: 8px;" caption="Firebase's client model versus traditional (Iosiro Security)" captionPosition="center" >}} 

Instead, data access limitations are configured in the admin view using [JSON-based security rules](https://firebase.google.com/docs/rules), which allows developers to specify which classes of users are allowed to read or write to and from each data path. When data models start to involve any modicum of complexity, configuring these security rules to properly restrict unauthorized access to data gets tricky. From [Firebase's documentation](https://firebase.google.com/docs/rules#how_do_they_work):

> Rules are applied as `OR` statements, not `AND` statements. Consequently, if multiple 
rules match a path, and any of the matched conditions grants access, Rules grant access to the data at that path. Therefore, if a broad rule grants access to data, you can't restrict with a more specific rule. You can, however, avoid this problem by making sure your Rules don't overlap too much. Firebase Security Rules flag overlaps in your matched paths as compiler warnings.

Exacerbating this issue is [“Test Mode”](https://firebase.google.com/docs/rules/insecure-rules#open_access), the default Firebase security configuration when initially setting up an app. Test Mode grants read and write access on all data to all users on the open internet (regardless of whether they have an app account or not) using the following rule:

```json
match /{document=**} {
  allow read, write: if request.time < timestamp.date(2022, 10, 13);
}
```

This is great in a pre-launch environment when nobody but the developers know of the existence of the Firebase project. However, in early-stage startups, security often takes a backseat to other development tasks, and it’s not a rare occurrence that Firebase collections are often left in Test Mode well after launch.

In fact, a 2020 [report](https://www.comparitech.com/blog/information-security/firebase-misconfiguration-report/#What_data_is_exposed) by Comparitech showed that nearly eight percent of Android apps on the Google Play Store using Firebase had security rules that allowed attackers to potentially read personal user information without even requiring authentication. More than 75 percent of these apps also allowed write access by arbitrary users on their database collections. There are likely even more apps that are vulnerable to data access by authenticated users of other users’ personal information (i.e., user authentication is required to access a collection, but once a user has authenticated they can access any other user’s data). 

These Firebase issues represent a larger class of security vulnerabilities known as [HospitalGown](https://symantec-enterprise-blogs.security.com/blogs/expert-perspectives/symantec-discusses-securing-private-mobile-app-data-cloud), where client-side applications connect to a completely exposed backend that simply allow malicious users to query for data they should not have access to.

# Anatomy of a Firebase data breach

The overarching idea of finding an unauthorized data access vulnerability in a Firebase client app is to pretend to be a client that can request anything from the datastore regardless of what data the real client queries for.

## Becoming a Firebase client

To identify oneself as a client to Firebase involves using a set of API tokens of the following format:

```json
{
  apiKey: "AIzaSyCad_1JSDfJBl399DFkseNqR63246PLEF4", // created by keyboard mashing
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project",
  storageBucket: "my-project.appspot.com",
  databaseURL: "https://my-project.firebaseio.com", // used only by RTDB
  messagingSenderId: "70263983361", // randomized
  appId: "1:70263983361:web:907b0c94510e7549e1ae94" // randomized
}
```

It's not particularly difficult to find these tokens:

* On Web apps, they are typically located somewhere in the minified Javascript source code for the page - typically, search for the phrase `appspot` and you should be able to find them (already in JSON format).
* For Android apps, you can download the app APK to your computer using a tool such as [this one](https://apps.evozi.com/apk-downloader/). After decompiling the app using `apktool`, you can find the keys in the file `res/values/strings.xml` by searching for the keyword `firebase`. You'll want the values associated with the following XML keys:
    - `gcm_defaultSenderId`
    - `google_api_key`
    - `firebase_url` (for RTDB client apps)
    - `google_storage_bucket`
    - `google_app_id`
    - `project_id`
* iOS apps are a little trickier, and finding the tokens usually requires access to a jailbroken iPhone or iPad. To find the tokens, `ssh` into the iPhone and navigate to the directory `/var/containers/Bundle/Application`. Find the UUID of the app by running `find | grep com.appdev.app_name`, then run `cd app_uuid/app_name.app`. The tokens are located in the file `GoogleService-Info.plist`. This file might be binary encoded and may require using a tool like `plistutil` to reveal in plaintext; this can be done by using `scp` to transfer the file back to your computer. You'll want the values associated with the following keys:
    - `API_KEY`
    - `DATABASE_URL` (for RTDB client apps)
    - `GCM_SENDER_ID`
    - `GOOGLE_APP_ID`
    - `PROJECT_ID`
    - `STORAGE_BUCKET`

## Probing the datastore

Once you have the API tokens, the easiest way to start spelunking around the database is to use [Baserunner](https://github.com/iosiro/baserunner), which allows you to set a Firebase config in JSON format for a particular app and then authenticate into that app if necessary. Authentication is supported via email/password, phone number/OTP, and via Google account (this was [my contribution](https://github.com/iosiro/baserunner/pull/12), and the motivation and implementation of this feature will be the subject of a future blog post).

{{< figure src="https://uploads-ssl.webflow.com/5e39239f2e417c1a357f71f5/60927ddd3ccc704c3bb86a9d_baserunner-in-action.png" alt="Baserunner UI (Iosiro Security)" position="center" style="border-radius: 8px;" caption="Baserunner UI (Iosiro Security)" captionPosition="center" >}} 

Once authenticated into the datastore for the app you're testing, you can use a query template to start trying to request data from CFS or RTDB (depending on what the app uses). Doing so requires knowing or guessing collection and potentially document names that correspond to valid data for the app. There are ways to make this easier, such as searching through Javascript source code in web or React Native apps, or by using a gRPC-capable proxy such as [mitmproxy](https://github.com/mitmproxy/mitmproxy) to intercept and inspect requests between mobile clients and Firebase.

Note that many Firebase client apps and websites often use SSL certificate pinning when accessing the database, making traffic proxying difficult. One workaround might be to use one of mitmproxy's suggested [certificate pinning bypass techniques](https://docs.mitmproxy.org/stable/concepts-certificates/#certificate-pinning), although I haven't tried any of them.

However, if you're blindly guessing at names, keep in mind how [Cloud Firestore](https://firebase.google.com/docs/firestore/data-model) and [Realtime Database](https://firebase.google.com/docs/database/web/structure-data) structure their data models, especially this restriction for Cloud Firestore:

> Notice the alternating pattern of collections and documents. Your collections and documents must always follow this pattern. You cannot reference a collection in a collection or a document in a document.

Note that if you try to access an invalid data path, Firebase's client library used in Baserunner will always return a permission denied error. This is due to a security feature in Firebase that prevents distinguishing on the frontend if a data path is invalid or if security rules prevent the authenticated user from accessing that data path. To make sure your tooling is working, try accessing a data path that you know you should have access to (which you can probably find by inspecting web requests or Javascript minified source).

# Case study: the Fizz vulnerabilities

[Fizz](https://fizzsocial.app), formerly Buzz, is an iOS-only social messaging platform for sharing posts and associated comments that’s popular at Stanford and other college campuses. The app is structured such that each user has an account that requires a community-affiliated email to verify membership, but can post anonymously. Users can accrue points based on the popularity of their posts.

{{< figure src="https://is4-ssl.mzstatic.com/image/thumb/Purple122/v4/55/c1/e7/55c1e701-b2df-a501-4f5a-48a506f7f0e5/c780362b-3e00-40ae-92dd-cdb75e12b6fb_Latest_Updates_6.5.png/230x0w.png" alt="Screenshot of Fizz (App Store)" position="center" style="border-radius: 8px;" caption="Screenshot of Fizz (App Store)" captionPosition="center" >}} 

Owing to its purportedly anonymous nature, Fizz posts can often consist of highly sensitive information. For example, users often use the platform to talk about their LGBTQ+ identity, even while in family situations that are not supportive of said identity.

## Conducting security testing on Fizz

In November 2021, [Miles McCain](https://miles.land), [Cooper de Nicola](https://github.com/cdenicola), and I did an [inspection](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html) of Fizz's security posture and found significant data leakage due to the app's developers having misconfigured their Firebase security rules. 

To do this testing, we first used the aforementioned iOS [token extraction technique](#becoming-a-firebase-client) to pull the Firebase API keys off a jailbroken iPhone 6S.

We did the inspection before we knew of Baserunner's existence, so we wrote a Node.js script based on the Firebase SDK that could identify itself to Firebase as Fizz using the tokens we found in the app files. 

```js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

const firebaseConfig = {
    // Fizz tokens go here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

createUserWithEmailAndPassword(
    auth,
    "not-real-user-" + Math.random() + "@test.com",
    "foo"
).then((userCredential)) => {
    getDocs(collection(db, "users")).then(x => {
        x.forEach((doc) => {
            console.log(JSON.stringify(doc.data()));
        });
    });

    deleteUser(auth.currentUser);
};
```

Fizz's minimal security rules required a user session to be active when data is requested from the database, and their user authentication model at the time consisted of sending a sign-in link to the user's email. Simulating this would have been extremely difficult with a script; Baserunner is much easier to use here as it saves such state for you in the session.

However, the email associated with a user session did not need to be affiliated with a member community in order to access data. Thus, we were able to make temporary users with email `not-real-user-RANDOM@test.com` for each run of the script.

## Pulling out the data

We first requested the `users` collection; this contained the expected information such as emails, phone numbers, app points accrued, and moderator status. We noticed there was also a `userID` field and theorized that this field would be what connected the `users` and `posts` collections.

{{< figure src="images/fizz_users.png" alt="Users collection" position="center" style="border-radius: 8px;" caption="Users collection" captionPosition="center" >}} 

We were then able to request the `posts` collection; finding this was a bit trickier because the table was namespaced under a specific member of the `communities` collection. That is, each community has its own posts table.

{{< figure src="images/fizz_posts.png" alt="Posts collection" position="center" style="border-radius: 8px;" caption="Posts collection" captionPosition="center" >}} 

This contained a treasure trove of information for each post including post content, pseudonyms, the user ID of the user that created it, the user IDs of the users that upvoted and downvoted the posts, and more. This effectively broke app anonymity because with a join of the `users` and `posts` collection on the user ID fields, each post’s author could be identified down to their email address and/or phone number. 

We also found that the `users` collection could be modified. We were able to change the points value of my user account to 99 trillion, and the modification was then reflected when opening the app.

{{< figure src="images/fizz_karma_mod.png" alt="Points value modified to 99 trillion" position="center" style="border-radius: 8px;" caption="Setting karma to 99 trillion" captionPosition="center" >}} 

More concerning, however, was that we could easily promote the account to be a moderator by simply changing the `isModerator` field on my account from `null` to `true`. This gave me access to a moderation UI and the ability to delete arbitrary posts from the app itself, including those made by accounts that were not my own (note that the only posts that were deleted were created by Miles for testing purposes). We reverted all modifications immediately after taking screenshots from the app for documentation purposes, and we only modified accounts that we had express consent from the owners to access (indeed, the only accounts we modified were our own).

{{< figure src="images/fizz_mod_ui.png" alt="Fizz moderator UI" position="center" style="border-radius: 8px;" caption="Fizz moderator UI" captionPosition="center" >}}

{{< figure src="images/fizz_mod_remove_post.png" alt="Option to remove post as mod" position="center" style="border-radius: 8px;" caption="Option to remove post as mod" captionPosition="center" >}}

{{< figure src="images/fizz_mod_remove_post_gone.png" alt="Removed post as mod" position="center" style="border-radius: 8px;" caption="Removed post as mod" captionPosition="center" >}}

## Disclosure

Concerned about user privacy and security — and consistent with [industry best practices](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html#responsible-or-coordinated-disclosure) — we wrote a detailed email to the Fizz team on November 8, 2021 documenting the issues and explaining how to fix them. Given how fundamental this vulnerability was, we believe it is possible that it was noticed (and perhaps even abused) by others before we discovered it. We felt strongly that Fizz had an obligation to notify their users of the issue. In order to give Fizz enough time to resolve the vulnerability itself, we agreed not to publicly disclose the issue ourselves until December 8.

### Fizz's response: initial courtesy, then a lawsuit threat

Fizz initially thanked us for our report, and they worked to fix the issue. Over the course of several emails, we thanked the Fizz team for handling our report well and advised them on the effectiveness of their fix. Things were looking good, and on November 22, Fizz let us know that they considered the original vulnerability fixed.

In that email, however, they also attached an [aggressive legal threat](https://stanforddaily.com/wp-content/uploads/2022/11/Buzz_Letter_Vulnerability_Disclosure_Redacted.pdf) from their lawyer at [Hopkins & Carley](https://www.hopkinscarley.com/), a Silicon Valley law firm. The letter demanded that, unless we agreed to various terms — including staying silent about vulnerabilities we discovered in Fizz and their misleading claims on encryption and user anonymity — they would “pursue charges.” If we didn't agree to gag ourselves within five calendar days (most of those days occurring over the Thanksgiving holiday), they threatened to "pursue charges" in the form of civil, criminal, and disciplinary action. They alleged that by performing a security audit on their systems, we had violated the Computer Fraud and Abuse Act (CFAA) and the Digital Millennium Copyright Act (DMCA).

The next day, our friend [Jack Cable](https://cablej.io/), a fellow Stanford student and security researcher, reached out to Kurt Opsahl and Andrew Crocker of the Electronic Frontier Foundation, who agreed to represent us pro bono in the dispute. On our behalf, they sent a [letter](https://stanforddaily.com/wp-content/uploads/2022/11/Response-to-Buzz-Vulnerability-Disclosure-Letter-vp_Redacted.pdf) that disputed Fizz's claims of DMCA and CFAA violations. Additionally, they noted that Fizz's lawyers conditioning of criminal charges on our signing of an NDA violated a California bar rule.

After the EFF’s letter was received, Fizz’s founders posted a public [security notice](https://archive.ph/Oc9lg) on their website on December 7, informing users that they had adequately remediated the issues following our disclosure. But the presentation of that statement was somewhat questionable, as it was presented to Fizz users only when opening the app for the first time post-disclosure and framed as mere "security improvements" rather than the severe data breach it really was. Additionally, their statement did not adequately disclose the fact that we were able to deanonymize every single post on the app.

Outside of some limited word-of-mouth communication, most Fizz users likely were not informed of how severe the vulnerabilities we found were until the Stanford Daily released its [article](https://stanforddaily.com/2022/11/01/opinion-fizz-previously-compromised-its-users-privacy-it-may-do-so-again/) about the situation nearly a year later.

# Remediation and conclusions

Firebase vulnerabilities are unfortunately all too common and can be quite devastating for certain business models, as the Fizz case study shows. Fizz was not the only app that we were able to find significant Firebase vulnerabilities in; we and other Stanford security researchers have identified this type of issue in numerous other startup apps.

For this class of Firebase-related vulnerabilities specifically, remediation must be done through careful application of security rules to the datastore in order to restrict data to only those that are authorized to see it. Due to the semantics of how these rules are interpreted, doing so is tricky. Many other apps I’ve inspected have made good attempts to write these rules but were still susceptible to unauthorized data accesses through edge cases. Developers must be extremely careful to test every potential user role and every data access path to confirm the efficacy of their rules.

Another thing I've seen apps do is use simplistic rules that are nearly as insecure as Test Mode, such as permitting all requests by authenticated users. Such rules sometimes end up being a [*suggested* implementation](https://cardinalkit.org/cardinalkit-docs/1-cardinalkit-app/2-setup.html#_5-setting-up-sign-in-with-google-optional) by introductory development tutorials.

Not all the blame can be placed entirely on developers. In my opinion, Google does not go far enough to help developers protect themselves against these vulnerabilities. When choosing Test Mode in the console for a Firebase database, there is a warning displayed about such issues, and by default Test Mode expires 30 days after creation. Google bombards developers with emails about Test Mode expiry containing a short warning about unauthorized data accesses.

However, I think developers tend to continuously reset the Test Mode timer well into the production cycle rather than working on better security rules, particularly if they are in a rapid-growth and feature-addition phase. In addition, Google has no way of warning developers of nearly-as-insecure rules such as those mentioned above.

{{< figure src="images/firebase_test_mode_warning.png" alt="Firebase test mode email warning" position="center" style="border-radius: 8px;" caption="Firebase test mode email warning" captionPosition="center" >}}

Google should add stronger warnings to Firebase documentation in addition to emails and the console, such that developers truly understand the importance of setting proper security rules in a timely manner. This documentation must be easily accessible and written in a way that new developers can understand and implement these rules, given Firebase's target market. Additionally, Google should also develop a way to click on any collection or document and see exactly which users or roles have access to that document. This would allow developers to self-test their rules without too much extra effort.

Broadly, startups having poor security is not just a Firebase problem, but rather a systemic one. Security is [almost never a required course](https://hbr.org/2019/08/every-computer-science-degree-should-require-a-course-in-cybersecurity) for any university computer science curriculum, including at Stanford, leading to student startups not knowing where to start in terms of securely designing their product. Even when they do, the "move fast, break things" mindset of the wider startup culture and ecosystem incentivizes startups to concentrate on rapid growth and scale rather than robust and secure development.

This means that the culture around early-stage startups and computer science curricula must change to incorporate the importance of security and safety as a core foundation. Such a change must be embraced by educators, entrepreneurs, and venture capitalists to further a security culture. 

As the Fizz case study demonstrates, Stanford is one place this culture shift is desperately needed. As such, I'm trying to focus many of my efforts this year as Vice President of Stanford's Applied Cybersecurity club on two goals: making security cool, and making people take security seriously. I plan to write more on this topic in the near future.