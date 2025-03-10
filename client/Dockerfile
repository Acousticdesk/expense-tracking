FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build
