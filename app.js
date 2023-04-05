const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const database = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

app.use(expressSession(createSessionConfig())); // 세션 생성

app.use(csrf()); // CSRF 토큰이 없는 POST 요청은 거부한다
app.use(addCsrfTokenMiddleware); // CSRF 토큰을 전역 변수 res.locals에 저장

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);

app.use(errorHandlerMiddleware); // 에러가 발생하면 express에 의해서 자동으로 호출된다

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