function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return (
    email &&
    email.includes("@") &&
    password &&
    password.trim().length >= 6
  );
}

// 회원가입 입력 데이터 유효성 확인
function userDetailsAreValid(email, password, fullname, city, street, postal) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(fullname) &&
    !isEmpty(city) &&
    !isEmpty(street)
  );
}

// 회원가입 확인 이메일 동일한지 확인
function emailIsConfirmed(email, confirmEmail) {
  return (email === confirmEmail);
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed
}