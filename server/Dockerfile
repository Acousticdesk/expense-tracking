FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./entrypoint.sh

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ]
