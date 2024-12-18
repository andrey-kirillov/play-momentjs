FROM node:18.18.0-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY . ./

RUN npm install