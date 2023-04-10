const bcryptjs = require("bcryptjs");
const mongodb = require("mongodb");

const database = require("../data/database");

class User {
  constructor(email, password, fullname, city, street, postal) {
    // 유저 객체 프로퍼티
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = {
      city: city,
      street: street,
      postal: postal
    }
  }

  // 데이터베이스에서 해당 이메일의 유저가 이미 회원가입 됐는지 확인
  async existsAlready() {
    const existingUser = await database.getDb().collection("users").findOne({email: this.email});
    
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  // 아이디로 유저 찾기
  static async findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return database.getDb().collection("users").findOne({_id: uid}, {projection: {password: 0}});
  }

  // 데이터베이스에서 해당 이메일의 유저를 가져오기
  async getUserWithThisEmail() {
    return await database.getDb().collection("users").findOne({email: this.email});
  }

  // 회원가입
  async signup() {
    const hashedPassword = await bcryptjs.hash(this.password, 12); // Hashing

    // 데이터베이스에 데이터 저장
    await database.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      fullname: this.fullname,
      address: this.address
    });
  }
  
  // 입력한 비밀번호와 데이터베이스에 저장된 비밀번호 비교
  comparePassword(hashedPassword) {
    return bcryptjs.compare(this.password, hashedPassword);
  }
}

module.exports = User;