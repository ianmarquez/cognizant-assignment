# pull the official base image
FROM node:latest

WORKDIR /client/app

COPY package*.json ./

RUN yarn
# add app
COPY . ./

# start app
CMD ["yarn", "start"]
