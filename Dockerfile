# Build Stage
FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Production Stage
FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
EXPOSE 80
CMD [ "node", "src/index.js" ]
