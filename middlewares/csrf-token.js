function addCsrfToken(req, res, next) {
  // CSRF 토큰을 res.locals에 저장
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;