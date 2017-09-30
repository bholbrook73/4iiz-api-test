# 4iiz API

This application runs in multiple docker containers (named 'mongo', 'mongo-admin', 
and 'api') respectively. Once you've pulled this repo and have docker running, 
you can start it by running `docker-compose up -d`.


| Container     | Description           | Connection String                     |
|---------------|-----------------------|---------------------------------------|
| mongo         | Mongo Database        | `mongodb://localhost:27018/dbname`    |
| mongo-admin   | Mongo-Express Server  | `http://localhost:8081`               |
| api           | 4iiz API Server       | `http://localhost:8080`               |

#### Running the API Locally

If you want to run the application locally, you will need to install swagger globally 
( `npm install -g swagger` ). *Note: The mongo container must be running for the API 
to run locally.*

##### Local API

After swagger installation is complete, run `swagger project start` 
and access the application on `http://localhost:10010`. Both the Local API and the 
API container can simultaneously run.

##### Tests

The tests can be run using `swagger project test`.

## Containers

#### Mongo

To connect to the mongo instance from another linked container, use the url 
`mongodb://mongo:27017/dbname`. To access the mongo instance from the host machine, use 
`mongodb://localhost:27018/dbname`.

#### Mongo-Admin

Mongo-Admin is a stock installation of the `mongo-express` image from Docker Hub.
You can run mongo-express by navigating to`http://localhost:8081`.

###### Known Issues

- Mongo-express does sporadically fail to start if it tries to connect to the mongo 
  container before it's ready to accept connections. In this case simply re-run the 
  `docker-compose up -d` command.

#### 4iiz API

This is the Swagger API for the presented snail problem. All documentation on how to use
the api, including the ability to call the api, is available at `http://localhost:8080/`.