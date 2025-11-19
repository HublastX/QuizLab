FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


EXPOSE 9081


CMD ["npm", "start"]