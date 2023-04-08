function protectRoutes(req, res, next) {
  // 유저가 로그인 상태가 아니라면
  if (!res.locals.isAuth) {
    res.redirect("/401"); // Not Authenticated
    return;
  }

  // 유저가 관리자가 아니라면
  if (!res.locals.isAdmin && req.path.startsWith("/admin")) {
    res.redirect("/403"); // Not Authorized
    return;
  }

  next();
}

module.exports = protectRoutes;