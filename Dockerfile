# syntax=docker/dockerfile:1.0.0-experimental

FROM node:10-alpine as build-stage

RUN apk add git openssh-client

COPY package.json ./

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts && ssh-keyscan gitlab.com >> ~/.ssh/known_hosts

RUN --mount=type=ssh,id=github npm install

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
