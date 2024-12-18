FROM node:18.18.0-alpine

WORKDIR /app

COPY . ./

RUN npm install