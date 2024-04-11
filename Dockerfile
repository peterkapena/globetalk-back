FROM arm64v8/node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g typescript

COPY . .

RUN npm run build && ls -al dist

ENV NODE_ENV production

EXPOSE 4000 4001

CMD ["node", "./dist/index.js"]
