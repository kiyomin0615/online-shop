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