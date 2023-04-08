function addCsrfToken(req, res, next) {
  // 유저에게 CSRF 토큰 제공(by res.locals)
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;