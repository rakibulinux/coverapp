# syntax=docker/dockerfile:1.0.0-experimental

FROM node:10-alpine as build-stage

COPY package.json ./

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
