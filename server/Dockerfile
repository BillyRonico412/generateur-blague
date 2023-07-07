FROM node:16-alpine3.18

COPY package.json /app/package.json

RUN npm install

COPY . /app

WORKDIR /app

CMD ["npm", "run", "dev"]