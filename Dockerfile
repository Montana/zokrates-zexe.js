FROM zokrates/zokrates:0.6.3 as builder

# Actual application (for testing purposes)
FROM node:12
RUN mkdir /app
WORKDIR /app
COPY ./package.json ./package-lock.json ./
COPY --from=builder /home/zokrates/.zokrates/bin/zokrates /app/
COPY --from=builder /home/zokrates/.zokrates/stdlib/ /app/
ENV ZOKRATES_HOME='/app'
RUN npm ci
RUN npm install jest --g
