#---------------------------
#      Stage 1: Build
#---------------------------

# We use multi-stage build. It helps us keep the built production image as small as possible
# by keeping all the dev dependencies in the intermediate layer, which result in faster deployments.

# Since we are using the multi-stage build, we are also using the AS statement to name the image development
FROM node:18-alpine As backend-build

# After setting WORKDIR, each command Docker executes (defined in the RUN statement) will be executed in the specified context.
WORKDIR /usr/src/tbot

# Copy only package.json and package-lock.json (if it exists).
COPY package*.json ./

# Install only devDependencies due to the container being used as a “builder”.
# that takes all the necessary tools to build the application and later send a clean /dist folder to the production image.
RUN npm ci

# After 'npm install' copy the rest of our application’s files into the Docker container.
COPY . .

# The order of statements is very important here due to how Docker caches layers. Each statement in the Dockerfile
# generates a new image layer, which is cached. If we copied all files at once and then ran npm install, each file
# change would cause Docker to think it should run npm install all over again. But now it will re-run 'npm install'
# only if package.json or package-lock.json change

# Finally, we make sure the app is built in the /dist folder
RUN npm run build


#---------------------------
#      Stage 2: Deploy
#---------------------------

# By using the FROM statement again, we are creating a new, fresh image "production".
FROM node:18-alpine as backend-production

# Using the ARG statement to define the default value for NODE_ENV, even though the default value is only
# available during the build time. Then we use the ENV statement to set it to either the default or the user-set value.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/tbot

COPY package*.json ./

# This time, we install only production dependencies. We don’t install packages that are needed only for build,
# such as TypeScript which makes this image smaller.
RUN npm ci --omit=dev

COPY . .

# Copy the built /dist folder from the development image. This way we are only getting the /dist, without the devDependencies.
COPY --from=backend-build /usr/src/tbot/dist ./dist

CMD [ "npm", "migration:run" ]
CMD ["node", "dist/main"]