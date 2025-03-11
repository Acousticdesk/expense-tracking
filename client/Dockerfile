FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY ./env.docker ./env

COPY . .
RUN npm run build
