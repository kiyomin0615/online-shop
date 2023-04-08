const mongodb = require("mongodb");

const database = require("../data/database");

class Product {
  constructor(productData) {
    // 상품 객체 프로퍼티
    this.title = productData.title,
    this.summary = productData.summary,
    this.price = +productData.price, // string to number
    this.description = productData.description,
    this.image = productData.image // image file name
    this.imagePath = `product-data/images/${this.image}`;
    this.imageURL = `/images/${this.image}`;

    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  // 데이터베이스에 저장된 모든 상품 가져오기
  static async findAll() {
    const products = await database.getDb().collection("products").find().toArray(); // document form database

    // Array.map(callback);
    // document to Product Class
    return products.map(function(product) {
      return new Product(product);
    });
  }

  // 데이터베이스에 저장된 특정 상품 가져오기
  static async findById(productId) {
    let product;

    try {
      product = await database.getDb().collection("products").findOne({_id: new mongodb.ObjectId(productId)}); // document from database
    } catch (error) {
      error.code = 404;
      throw error;
    }
    return new Product(product); // document to Product Class
  }

  // 데이터베이스에 상품 저장
  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image, // image file name
    }

    // 상품 ID가 이미 존재하는 경우, 상품 업데이트
    if (this.id) {
      // 상품 업데이트 때는 이미지 파일을 반드시 업로드할 필요가 없다
      if (!this.image) {
        delete productData.image; // productData 객체의 image 프로퍼티를 제거
      }
      await database.getDb().collection("products").updateOne({_id: new mongodb.ObjectId(this.id)}, {$set: productData});
    // 상품 ID가 존재하지 않는 경우, 신규 상품 저장
    } else {
      await database.getDb().collection("products").insertOne(productData);
    }
  }

  // 데이터베이스에서 상품 제거
  remove() {
    database.getDb().collection("products").deleteOne({_id: new mongodb.ObjectId(this.id)}); // 프로미스 리턴
  }

  // 상품 이미지 교체
  replaceImage(newImageName) {
    this.image = newImageName, // image file name
    this.imagePath = `product-data/images/${this.image}`;
    this.imageURL = `/images/${this.image}`;
  }
}

module.exports = Product;