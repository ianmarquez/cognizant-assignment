FROM node:latest

WORKDIR /server/app

RUN yarn global add nodemon

COPY package*.json ./

RUN yarn

COPY . ./

EXPOSE 3001

EXPOSE 9229

CMD ["yarn", "start"]