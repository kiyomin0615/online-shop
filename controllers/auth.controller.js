function getSignup(req, res) {
  res.render("customer/auth/signup"); // views/customer/auth/signup.ejs
}

function getLogin(req, res) {
  // ...
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin
}