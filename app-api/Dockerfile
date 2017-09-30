FROM node:8.6.0
COPY './4iiz-api' '/usr/src/app'
WORKDIR '/usr/src/app'
RUN npm install -g swagger
RUN npm install
ENV MONGODB 'mongo:27017'
ENV PORT 8080
EXPOSE 8080
CMD npm start