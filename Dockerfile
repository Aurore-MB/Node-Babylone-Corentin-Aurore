# syntax=docker/dockerfile:1

FROM node:26.13.0-alpine3.24 AS development
USER node
WORKDIR /home/node

FROM node:26.13.0-alpine3.24 AS build
USER node
WORKDIR /home/node
COPY --chown=node:node . .
RUN npm install && npm run build

FROM node:26.13.0-alpine3.24 AS production
RUN apk add --no-cache curl
USER node
WORKDIR /home/node

COPY --from=build --chown=node:node /home/node/dist /home/node/dist
COPY --from=build --chown=node:node /home/node/package*.json /home/node/
RUN npm install --omit=dev

CMD [ "node", "dist/index.js" ]
EXPOSE 8000
