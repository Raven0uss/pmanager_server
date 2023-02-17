FROM node:14-alpine3.12

WORKDIR /usr/src/app

# Copying packages first helps take advantage of docker layers
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "run", "start"]