const bcryptjs = require("bcryptjs");

const database = require("../data/database");

class User {
  constructor(email, password, fullname, city, street, postal) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = {
      city: city,
      street: street,
      postal: postal
    }
  }

  // 데이터베이스에서 해당 이메일의 유저가 회원가입 됐는지 확인
  getUserWithSameEmail() {
    return database.getDb().collection("users").findOne({email: this.email});
  }
  
  // 입력한 비밀번호와 데이터베이스에 저장된 비밀번호 비교
  comparePassword(hashedPassword) {
    return bcryptjs.compare(this.password, hashedPassword);
  }

  // 데이터베이스에 유저 정보 저장
  async signup() {
    const hashedPassword = await bcryptjs.hash(this.password, 12); // Hashing

    await database.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      fullname: this.fullname,
      address: this.address
    });
  }
}

module.exports = User;