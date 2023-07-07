FROM node:16-alpine3.18

COPY package.json /app/package.json

RUN cd /app && npm install

COPY . /app

WORKDIR /app

CMD ["npm", "run", "dev"]