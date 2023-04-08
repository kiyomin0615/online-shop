// 에러 처리
function errorHandler(error, req, res, next) {
  console.log(error);

  if (error.code === 404) {
    res.status(404).render("shared/404"); // not found
    return;
  }

  res.status(500).render("shared/500"); // server-side error
}

module.exports = errorHandler;