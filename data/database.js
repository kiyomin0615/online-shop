const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://0.0.0.0:27017")
  database = client.db("oninle-shop");
}

function getDb() {
  if (!database) {
    throw new Error("데이터베이스에 연결해 주세요!");
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
}