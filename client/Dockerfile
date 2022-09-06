FROM node:15.13-alpine
WORKDIR /295B/client
COPY package.json /295B/client
COPY package-lock.json /295B/client
RUN npm install
COPY . /295B/client
CMD ["npm","start"]

