FROM docker.pkg.github.com/eyblockchain/zokrates-zexe/zokrates_zexe:latest as builder

# Actual application (for testing purposes)
FROM node:12
RUN mkdir /app
WORKDIR /app
COPY ./package.json ./package-lock.json ./
COPY --from=builder /home/zokrates/zokrates /app/zokrates
COPY --from=builder /home/zokrates/.zokrates* /app/stdlib
RUN npm ci
RUN npm install jest --g