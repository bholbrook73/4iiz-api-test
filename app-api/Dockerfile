FROM node:8.6.0
COPY './4iiz-api' '/usr/src/app'
WORKDIR '/usr/src/app'

# swagger required to run
RUN npm install -g swagger
RUN npm install

# mongo config
ENV MONGO_HOST 'mongo:27017'
ENV MONGO_DB '4iiz'

# port configuration
ENV PORT 8080
EXPOSE 8080

# away we go!
CMD npm start