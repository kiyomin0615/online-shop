const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

function createSessionStore() {
  const MongoDbStore = mongoDbStore(expressSession);

  const sessionStore = new MongoDbStore({
    uri: "mongodb://0.0.0.0:27017",
    databaseName: "online-shop",
    collection: "sessions"
  });

  return sessionStore;
}

function createSessionConfig() {
  return {
    secret: "this-is-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2
    }
  }
}

module.exports = createSessionConfig;