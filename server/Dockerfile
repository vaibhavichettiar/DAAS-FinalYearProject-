FROM node:15.13-alpine
WORKDIR /295B/server
COPY package.json /295B/server
COPY package-lock.json /295B/server
RUN npm install
COPY . /295B/server
CMD ["npm","start"]