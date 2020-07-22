<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [zokrates-zexe.js](#zokrates-zexejs)
  - [Instructions](#instructions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# zokrates-zexe.js

This is a Node.js wrapper around [zokrates-zexe](https://github.com/EYBlockchain/zokrates-zexe.js).

## Instructions

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
