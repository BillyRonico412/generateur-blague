FROM node:16-alpine3.18

COPY package.json package.json

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]