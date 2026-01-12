FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

#Usuwanie dev-dependencies
RUN npm prune --production

EXPOSE 3100

CMD ["node", "dist/index.js"]
