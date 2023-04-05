function checkAuth(req, res, next) {
  const uid = req.session.uid;
  // 유저가 로그인하지 않았다면
  if (!uid) {
    next();
    return;
  }

  // 유저가 로그인했다면 인증
  res.locals.uid = uid;
  res.locals.isAuth = true;
  next();
}

module.exports = checkAuth;