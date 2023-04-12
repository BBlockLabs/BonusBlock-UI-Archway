FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

FROM nginx:1.21-alpine AS package

WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM builder AS build-development

COPY .env.kubernetes_dev ./.env

RUN npm run build-dev

FROM builder AS build-staging

COPY .env.kubernetes_staging ./.env

RUN npm run build-only

FROM builder AS build-production
COPY .env.kubernetes ./.env

RUN npm run build-only

FROM package AS package-development

COPY --from=build-development /usr/src/app/dist /app/

FROM package AS package-staging

COPY --from=build-staging /usr/src/app/dist /app/

FROM package AS package-production

COPY --from=build-production /usr/src/app/dist /app/
