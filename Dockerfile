FROM node:latest

WORKDIR /usr/app

COPY package.json ./

RUN yarn install 

COPY src ./src

RUN yarn build

EXPOSE 3333
CMD ["yarn", "start"]
