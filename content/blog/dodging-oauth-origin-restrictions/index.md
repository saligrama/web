---
title: "Dodging OAuth origin restrictions for Firebase spelunking"
#description: <descriptive text here>
date: 2022-11-23T2:30:00-05:00
draft: false
showToc: true
image: ""
tags: []
categories: []
---

In my [last post](/blog/post/firebase-insecure-by-default), I covered the marvelous world of Firebase database spelunking: when app developers misconfigure their Firestore security rules, the resulting ability to perform unauthorized data accesses can lead to terrifying data breaches for those apps. Thanks to tools like [Baserunner](https://github.com/iosiro/baserunner), testing apps for such misconfigurations is easier than ever.

By saving authorization state when logging into Firebase databases using email/password or phone/OTP sign-in methods, Baserunner lets you focus on actually querying the database for data. However, what happens when client apps only allow sign-in using a Google account?

This blog post covers how [Glen Husman](https://github.com/glen3b) and I conducted security testing of such a Firebase client app, using a clever solution to grab the Google OAuth token to sign into the database with. I then used lessons learned from that engagement to [contribute](https://github.com/iosiro/baserunner/pull/12) Google sign-in functionality back to Baserunner.

<!--more-->

# Conducting security testing on a Google OAuth-only Firebase app

The motivation for this exploration was a security inspection that [Glen Husman](https://github.com/glen3b) and I conducted in February 2022 on a Stanford student-created website that stored some moderately sensitive user data. The site was a Javascript single-page application (SPA) backed by a Firebase database that only allowed Google sign-in via Firebase authentication.

We found minor issues relating to Firebase security rule misconfigurations leading to some unauthorized data accesses. We disclosed these vulnerabilities on February 27, 2022 and received confirmation that they had been fixed on March 28, 2022.

To respect the student's and app's request for anonymity, I won't disclose any further details about the engagement, and the examples I use will relate to a demo app I created solely for this post.

# A brief background on OAuth

OAuth is an protocol meant to delegate access between applications that decouples authentication from authorization. That is, the identity and authorization provider (e.g., Google) can be a different entity from the application the user is actually logging into (e.g., Notion). Furthermore, OAuth usage can be scoped to allow the requesting application to access data owned by the identity provider.

## OAuth vocabulary and basic flow

* **Client Application/Relying Party**: An application which receives delegated authorized access from another server, or relies on another server for authentication. In our case, the Firebase database.
* **Authorization Server/Identity Provider (IdP)**: Server that conducts a sign-in flow that allows the user to authenticate, and on which the user consents to authorizing the app. In our case, Google.
* **OAuth 2.0**: An authorization standard. Client apps prompt for authorization and receive an opaque access token to access a resource (identified by "scopes").
* **OpenID Connect (OIDC)**: An authentication standard built on OAuth 2, used by Sign In With Google and other protocols. This extends OAuth to return a verifiable ID token making authentication claims (e.g. *user Aditya Saligrama owns email address aditya@saligrama.io*), in addition to the access token.

To explain the flow as simply as possible, a client application will make a request to the identity provider, which opens a popup window or browser tab containing the sign-in flow for the identity provider. A user will then sign into their account with the identity provider, which then provides the client a scoped token to identify the user, and, if necessary, to access data from the identity provider. The client can then pass the token or a derivative thereof to the user's browser, which is then included on subsequent requests to the client for resource authorization.

For more information, refer to this [blog post](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth) by Okta and the [official OAuth documentation](https://oauth.net/articles/authentication/).

## OAuth security flows

Here's a potential security problem with OAuth: suppose that our favorite example banking site `https://bank.com` supports logging in with OAuth using Google as an authentication provider. When a user (Alice) goes through the Google sign-in flow on `bank.com`, `bank.com` is provided a token used to authorize access to Alice's data on `bank.com`, which is then passed to her browser.

Now suppose Alice received a phishing email leading them to click on `https://b4nk.com`, a phishing site that looks exactly the same as `bank.com`. Just like the legitimate bank site, Alice is asked to sign in with Google. If `b4nk.com` uses its own client ID for Google sign-in, then all is well, as the scoped token that is returned only allows access to data on `b4nk.com`.

However, suppose `b4nk.com` identifies itself to Google as `bank.com` using the latter's public client ID. If the flow completes successfully, then `b4nk.com` has successfully obtained a token for Alice's account on `bank.com`, which can then be used to access Alice's banking data. This is a clear security violation, and should not be allowed to happen!

Thus, applications themselves must have some way of authenticating themselves to the identity provider such that only legitimate applications can request access tokens for their sites.

### 3-legged flow

A traditional web application will typically feature a client and a dedicated application server; the three "legs" are the user's browser (and therefore the frontend client), the application server, and the authorization (IdP) server. This means that the application server is capable of holding secrets that can be used to authenticate the application itself to the identity provider.

When an OAuth sign-in flow is conducted, the application will pass along its client secret to the identity provider, which will only return the access token if the client secret can be verified.

### 2-legged flow

In contrast, a JS SPA is a case where all requests are made from the user's browser; i.e. there is no application server that can hold a client secret. But such an application can still fall prey to the phishing attack mentioned earlier.

Thus, to ensure that only legitimate applications can obtain a user access token, the identity provider can enforce a restriction on what *origin* the sign-in flow request can come from. Typically, these origins are configurable when setting up OAuth with the identity provider.

To cite [Zakir Durumeric](https://zakird.com/)'s excellent [web security](https://saligrama.io/notes/cs155/2022-04-18-web-security/) [lecture](https://cs155.stanford.edu/lectures/08-web.pdf) from Stanford's *CS 155 Computer and Network Security* course, an origin is defined as a unique `scheme://domain:port` tuple. To illustrate:

* The following are different origins:
    ```
    http://saligrama.io
    http://www.saligrama.io
    http://saligrama.io:8080
    https://saligrama.io
    ```
* The following are the same origin:
    ```
    https://saligrama.io
    https://saligrama.io:443
    https://saligrama.io/blog
    ```

This effectively stops the phishing attack: `https://b4nk.com` is a different origin than `https://bank.com`, so the identity provider can block the request rather than responding with an access token.

# Signing into a Firebase database with Google OAuth

For more details on exploiting Firebase misconfigurations, including a case study, please refer to my [last post](/blog/post/firebase-insecure-by-default).

## The Firebase OAuth sign-in flow

Recall that to make requests against a Firebase database, we need a set of API tokens found on the client side, as well as an authorization header. For an SPA, the former is easily found by inspecting the minified JS source code of the page.

However, the authorization header depends on the sign-in method. When using email/password authentication, the email and password are passed directly to Firebase's authentication server, which then returns the authorization header. 

Similarly, with phone/OTP authentication, the phone number is passed to Firebase's authentication server, which then sends an OTP to the phone. This OTP is then entered on the client side, passed back to the Firebase authentication server, which then returns the authorization header.

But with Google OAuth sign-in, the process is a little more complicated:

1. The client makes a request to Google's OAuth server including the site's Google client ID.
2. The Google OAuth server conducts the user-facing sign-in flow, either listing Google accounts already logged in on the browser to use, or requesting email/password/MFA (if applicable).
3. The Google server then checks if the requesting client's origin is registered under the Google developer project for Google sign-in. If not, an origin mismatch error is shown to the user.
4. An OAuth token is then returned to the client. For SPAs, these tokens typically expire after one hour.
5. The Firebase app consumes the OAuth token to create an authorization header for the corresponding database.

As Baserunner did not support this flow when Glen and I first investigated a Google OAuth-only Firebase client app, we had to cobble this together ourselves.

## Demo setup

To demonstrate this process, I created a demo Firebase project that only accepts Google sign-in. Note that I've taken this down by now, so trying to hit this endpoint will get you nowhere. The API tokens were as follows; again, you can find these from the JS source code of an SPA.

```json
{
  "apiKey": "AIzaSyAcfgDIqP8NuzNctjznZELFfvW3wGw8YcU",
  "authDomain": "saligrama-oauth-demo.firebaseapp.com",
  "projectId": "saligrama-oauth-demo",
  "storageBucket": "saligrama-oauth-demo.appspot.com",
  "messagingSenderId": "915380107062",
  "appId": "1:915380107062:web:39f937f22655442c46a597"
}
```

I then created a user account for the project backed by my Google account (`aditya@saligrama.io`), as well as some test data in Cloud Firestore to be queried for.

![Demo user](images/oauth-demo-user.png)
![Test data](images/oauth-test-data.png)

The objective here is to get the Google OAuth token for `aditya@saligrama.io` corresponding to the demo app that can then produce a Firebase authorization header. This can then be used in a Node.js script to query the database.

## Attempt 1: running a local web server

As OAuth is a communication protocol between web applications, we need to actually be running a web server to try to get the OAuth token. Let's use the simplest possible option: Python's `http.server` module, serving a simple HTML and Javascript page.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta name="google-signin-cookiepolicy" content="single_host_origin">
    <meta name="google-signin-scope" content="openid https://www.googleapis.com/auth/userinfo.email profile">

    <script src="googleauth_import.js"></script>
</head>
<body>
    <!-- Script providing the Google sign-in functionality -->
    <!-- Note: callback function for Google sign-in needs to be in a separate file -->
    <!-- Contains Client ID for saligrama-oauth-demo -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <div id="g_id_onload"
         data-client_id="915380107062-5500mntg10so5r623ga9c6nq6tdjv36r.apps.googleusercontent.com" 
         data-callback="onSignIn">
    </div>
    <div class="g_id_signin" data-type="standard"></div>
</body>
</html>
```

```js
// googleauth_import.js
function onSignIn(googleUser) {
  console.log(googleUser);
}
```

When the sign-in is successful, we should expect to see the Google sign-in info printed in the console.

Run the server:

```
❯ python3 -m http.server -d http-root -b 127.0.0.1 8080
Serving HTTP on 127.0.0.1 port 8080 (http://127.0.0.1:8080/) ...
```

This loads a page with a Google sign-in button, as expected:

![Google sign-in basic page](images/oauth-attempt-1-load.png)

Clicking on the button yields a pop-up with the Google sign-in flow; after succesfully signing in with `aditya@saligrama.io`, the pop-up abruptly closes. Checking the console, we see the following:

![Google sign-in failure due to origin mismatch 1](images/oauth-attempt-1-fail.png)

Clearly, the issue was with the domain we were loading: `http://localhost:8080` is not a registered origin for the demo app. We've run up against the aforementioned origin restriction issue! Let's try using the Firebase project's domain itself.

## Attempt 2: domain-jacking

We now want to use `saligrama-oauth-demo.firebaseapp.com` as the domain. While this is a host with its own public IP address (`199.36.158.100` at the time of writing), we can tell our local machine to point the hostname to any IP address of our choosing (including the local host, `127.0.0.1`).

This is done by editing the hosts file, adding a line containing the following:
```
127.0.0.1 saligrama-oauth-demo.firebaseapp.com
```
* On Linux and macOS: `/etc/hosts`
* On Windows: `C:\Windows\system32\drivers\etc\hosts`

Recalling that an origin is comprised of a scheme, a host, and a port, we should probably also run the web server on port 80, which requires administrator permissions on Linux:

```
❯ sudo python3 -m http.server -d http-root -b 127.0.0.1 80
Serving HTTP on 127.0.0.1 port 80 (http://127.0.0.1:80/) ...
```

Now, we load this in our web browser, conduct the sign-in flow, and check the console:

![Google sign-in basic page 2](images/oauth-attempt-2-load.png)

![Google sign-in failure due to origin mismatch 1](images/oauth-attempt-2-fail.png)

Another failure. Maybe changing the scheme and port, using HTTPS over port 443, will help.

## Attempt 3: HTTPS, where the S stands for Success

Running a HTTPS server requires a little more legwork. First, we need to generate a self-signed SSL certificate:

```
❯ openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
  -keyout server.pem -out server.pem \
  -subj "/CN=saligrama-oauth-demo.firebaseapp.com" \
  -addext "subjectAltName=DNS:saligrama-oauth-demo.firebaseapp.com"
```

We then need to actually allow our Python HTTP server to serve over HTTPS; a light modification to [this GitHub Gist](https://gist.github.com/Alexufo/2303bff77f0a16ba83568f0260b8cf47) suffices:

```python
import http.server
import ssl

server_address = ("0.0.0.0", 443)

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        "": "application/octet-stream",
        ".manifest": "text/cache-manifest",
        ".html": "text/html",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".svg": "image/svg+xml",
        ".css": "text/css",
        ".js": "application/x-javascript",
        ".wasm": "application/wasm",
        ".json": "application/json",
        ".xml": "application/xml",
    }

    def end_headers(self):
        # Include additional response headers here. CORS for example:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        http.server.SimpleHTTPRequestHandler.end_headers(self)

httpd = http.server.HTTPServer(server_address, CORSHTTPRequestHandler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.check_hostname = False
ctx.load_cert_chain(certfile="../server.pem")  # with key inside
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
httpd.serve_forever()
```

Run the server:

```
❯ sudo python3 simple-https-server.py
```

Naturally, as the certificate is self-signed, Firefox throws a warning that can be bypassed. In some cases, if you've already navigated to `https://PROJECT_ID.firebaseapp.com`, your browser will actually refuse to let you see the self-hosted page due to HSTS settings. HSTS is a policy that stores HTTPS certificates associated with websites and prevents users from accessing those websites again if the certificate does not match the stored one.

In this case, you'll need to clear HSTS settings by clearing all data associated with the site from your browser.

![Self-signed cert warning](images/oauth-attempt-3-self-signed-err.png)

We again go through the Google sign-in flow and check the console, which yields the token!

![Auth success](images/oauth-attempt-3-success.png)

I should note that I've seen some projects follow Firebase default settings to allow `http://localhost` (port 80) as an origin, which would shortcut the hostname and certificate process. However, I've also seen projects remove `localhost` as an acceptable origin once in production, so it's more reliable to use the actual Firebase project's domain over HTTPS as above.

## Querying for data

Now that we have the token, we can query the Firebase database for data using a Node.js script, similar to the [example](/blog/post/firebase-insecure-by-default/#conducting-security-testing-on-fizz) from my last post.

```js
// oauth-demo.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAcfgDIqP8NuzNctjznZELFfvW3wGw8YcU",
    authDomain: "saligrama-oauth-demo.firebaseapp.com",
    projectId: "saligrama-oauth-demo",
    storageBucket: "saligrama-oauth-demo.appspot.com",
    messagingSenderId: "915380107062",
    appId: "1:915380107062:web:39f937f22655442c46a597"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const id_token = "PASTE_OAUTH_TOKEN_HERE";

const credential = GoogleAuthProvider.credential(id_token);

signInWithCredential(auth, credential)
    .then((_) => {
        let docRef = doc(db, "test", "EsjmpXTOSnAb9o6JZufF");
        getDoc(docRef).then(x => {
                console.log(x.data());
            }
        );
    })
    .catch((error) => {
        console.error(error);
    });
```

Running the script, we get the desired data.

```
❯ node oauth-demo.mjs
{ message: 'Spooky scary user data, send shivers down your spine' }
```

# Contributing to Baserunner

Coincidentally, the lack of Google sign-in support was an [open issue](https://github.com/iosiro/baserunner/issues/2) in Baserunner for nearly 18 months. With what I'd learned from this engagement, I was able to add this support to Baserunner. This required adding a way to set the Google client ID on the frontend and dynamically generating a Google sign-in button based on that input client ID, then plumbing the resulting credential through to the saved Firebase state for login.

My [pull request](https://github.com/iosiro/baserunner/pull/12) was merged in August 2022. We can now use Baserunner to query for the data!

![Succesful query using Baserunner](images/oauth-baserunner-success.png)

# Conclusion

While Google sign-in can make it more difficult to sign into Firebase databases for exploratory purposes outside the official app context, it's not impossible, as this work shows. Bypassing the origin restriction enforced by the Firebase authentication requires some finagling, but I hope this post serves as a guide on how to do so.

With mainline Baserunner support for Google sign-in added by my pull request, exploring Firebase databases has never been easier.