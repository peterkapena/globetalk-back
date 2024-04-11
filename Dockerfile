FROM arm64v8/node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV NODE_ENV production
EXPOSE 4000 4001

CMD ["node", "./dist/index.js"]

#                           docker build -t grower_management .
#                           docker run -dp 4000:4000 grower_management (optional)
#                           docker tag grower_management  kapenapeter/grower_management
#                           docker push kapenapeter/grower_management

#                           sudo docker pull kapenapeter/grower_management
#                           sudo docker run -dp 4000:4000 kapenapeter/grower_management   