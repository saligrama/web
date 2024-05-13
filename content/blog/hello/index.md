---
title: "Hello, world!"
date: 2022-05-02T00:06:06-07:00
draft: false
showToc: false
image: ""
tags: []
categories: []
aliases: [/blog/post/hello]
---

Test post for this blog.

<!--more-->

```c
char code[] = 
    "\xe9\x1e\x00\x00\x00\xb8"
    "\x04\x00\x00\x00\xbb\x01"
    "\x00\x00\x00\x59\xba\x0f"
    "\x00\x00\x00\xcd\x80\xb8"
    "\x01\x00\x00\x00\xbb\x00"
    "\x00\x00\x00\xcd\x80\xe8"
    "\xdd\xff\xff\xff\x48\x65"
    "\x6c\x6c\x6f\x2c\x20\x57"
    "\x6f\x72\x6c\x64\x21\x0a";


int main(int argc, char **argv)
{
    (*(void(*)())code)();

    return 0;
}
```