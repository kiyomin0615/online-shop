const path = require("path");

const express = require("express");

const database = require("./data/database");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

app.use(authRoutes);

database.connectToDatabase()
  // 데이터베이스 연결에 성공
  .then(function() {
    app.listen(3000);
  })
  // 데이터베이스 연결에 실패
  .catch(function(error) {
    console.log("데이터베이스 연결에 실패했습니다!");
    console.log(error);
  })