#---------------------------
#      Stage 1: Build
#---------------------------
FROM node:18-alpine As backend-build
WORKDIR /usr/src/tbot
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


#---------------------------
#      Stage 2: Deploy
#---------------------------

FROM node:18-alpine as backend-production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/tbot
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
COPY --from=backend-build /usr/src/tbot/dist ./dist

CMD [ "npm", "migration:run" ]
CMD ["node", "dist/main"]