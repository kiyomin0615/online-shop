function checkUser(req, res, next) {
  const uid = req.session.uid;

  // 유저가 uid가 없으면(=로그인 하지 않았다면)
  if (!uid) {
    next();
    return;
  }

  // 유저가 uid가 있으면(=로그인 했다면)
  // 유저에게 로그인 정보(uid, isAuth, isAdmin) 제공
  res.locals.uid = uid;
  res.locals.isAuth = req.session.isAuth;
  res.locals.isAdmin = req.session.isAdmin;
  next();
}

module.exports = checkUser;