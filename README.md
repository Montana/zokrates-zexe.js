<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [zokrates-zexe.js](#zokrates-zexejs)
  - [Instructions](#instructions)
    - [installing the npm package](#installing-the-npm-package)
    - [using in a docker container](#using-in-a-docker-container)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# zokrates-zexe.js

This is a Node.js wrapper around [zokrates-zexe](https://github.com/EYBlockchain/zokrates-zexe.js).

## Instructions

### installing the npm package

To use install package, you must be logged in to the github npm package repository. To do that you
need a personal access token (it's easy to
[generate](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
if you don't have one - the same token can be used for docker too). Log in like this (when you are
asked for a username, paste your access token):

```sh
$ npm login --registry=https://npm.pkg.github.com
```

After that, you can install it with:

```sh
$ npm install --save npm install @eyblockchain/zokrates-zexe.js
```

or add it to your package.json file. _If you push code changes, you will (for now) need to manually
bump the package.json version or the npm package won't publish. We'll automate that soon_

### using in a docker container

This library is meant to be used through Docker containers running a Linux OS. In the Dockerfile
that will be running this library, you need to include the ZoKrates library as a builder, as such:

```Dockerfile
FROM docker.pkg.github.com/eyblockchain/zokrates-zexe/zokrates_zexe:latest as builder
```

In the same Dockerfile, you then need to copy over the ZoKrates executable as well.

```Dockerfile
  COPY --from=builder /home/zokrates/zokrates /app/zokrates
  COPY --from=builder /home/zokrates/.zokrates* /app/stdlib
```

From then, you can import and use ZoKrates as any other standard Node library.
