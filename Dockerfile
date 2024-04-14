FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

# RUN npm install -g typescript

COPY . .

RUN npm run build 

ENV NODE_ENV production

EXPOSE 4000 4001

CMD ["node", "--env-file=.env.production", "dist/index.js"]
