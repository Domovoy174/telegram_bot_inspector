# Set the base image.
FROM node:18

# Create and define the node_modules's cache directory.
RUN apt-get update && apt-get install -y iputils-ping
RUN mkdir /Bot
WORKDIR /Bot

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY package-lock.json ./

RUN npm install && npm install pm2 -g

COPY ./dist ./dist
ENV PORT 3100
EXPOSE $PORT

CMD ["pm2-runtime", "./dist/index.js"]

