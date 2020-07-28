FROM node:12.14-alpine3.10

WORKDIR /app

COPY . . 
RUN yarn install
RUN yarn build

COPY ormconfig.js ./dist/


EXPOSE 8080
ENTRYPOINT yarn start
