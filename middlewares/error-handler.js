// 다른 미들웨어 또는 라우트 핸들러에서 어떠한 에러라도 발생하면 express에 의해서 자동으로 호출된다
function errorHandler(error, req, res, next) {
  console.log(error);

  if (error.code === 404) {
    res.status(404).render("shared/404");
    return;
  }

  res.status(500).render("shared/500");
}

module.exports = errorHandler;