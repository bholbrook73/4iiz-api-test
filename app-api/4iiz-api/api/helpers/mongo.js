'use strict';

// mongo libraries
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

// parameters
const HOST = process.env.MONGO_HOST || "localhost:27018";
const DB = process.env.MONGO_DB || "4iiz";
const URL = `mongodb://${HOST}/${DB}`;

// connection wrapper
function connect(){

    return MongoClient.connect( URL );

}

//exports
module.exports = {
    Client: MongoClient,
    ObjectId: ObjectId,

    connect: connect
};