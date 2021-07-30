# syntax=docker/dockerfile:1.0.0-experimental

FROM node:10-alpine as build-stage

WORKDIR /app

RUN apk add git

ARG NPM_TOKEN

COPY .npmrc .npmrc

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
