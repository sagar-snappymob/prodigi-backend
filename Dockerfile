FROM node:14.10.1-alpine3.11

WORKDIR /usr/src/app
RUN npm install -g prisma
COPY ./package.json /usr/src/app/
RUN apk add openssl
RUN yarn

ARG PORT

EXPOSE ${PORT}

CMD yarn start
