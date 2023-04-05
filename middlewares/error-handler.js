// 다른 미들웨어 또는 라우트 핸들러에서 어떠한 에러라도 발생하면 express에 의해서 자동으로 호출된다
function errorHandler(error, req, res, next) {
  console.log(error);
  res.status(500).render("shared/500"); // 500 is server-side error
}

module.exports = errorHandler;