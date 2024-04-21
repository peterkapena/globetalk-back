FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build 

ENV NODE_ENV production

EXPOSE 4000 4001

CMD ["node", "--env-file=.env.production", "dist/index.js"]

# git pull && docker compose up --build -d && docker ps -a
# git pull && docker compose up -d --no-deps --build globetalk-front globetalk-back && docker compose restart
