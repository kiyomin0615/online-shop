const mongodb = require("mongodb");

const database = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title,
    this.summary = productData.summary,
    this.price = +productData.price, // string to number
    this.description = productData.description,
    this.image = productData.image // 이미지 파일 이름
    this.imagePath = `product-data/images/${this.image}`;
    this.imageURL = `/products/assets/images/${this.image}`; // 프로젝트 경로에 대한 힌트를 주지 않기 위해서
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  // 데이터베이스에 저장된 특정 상품 가져오기(by id)
  static async findById(productId) {
    let product;
    try {
      product = await database.getDb().collection("products").findOne({_id: new mongodb.ObjectId(productId)});
    } catch (error) {
      error.code = 404;
      throw error;
    }
    return new Product(product); // product(document) to product(Product Class)
  }

  // 데이터베이스에 저장된 모든 상품 가져오기
  static async findAll() {
    const products = await database.getDb().collection("products").find().toArray();

    // Array.map(callback);
    // product(document) to product(Product Class)
    products.map(function(product) {
      return new Product(product);
    });

    return products;
  }

  // 데이터베이스에 저장
  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image, // 이미지 파일 이름
    }

    if (this.id) {
      if (!this.image) {
        delete productData.image; // productData 객체의 image 프로퍼티를 제거
      }
      await database.getDb().collection("products").updateOne({_id: new mongodb.ObjectId(this.id)}, {$set: productData});
    } else {
      await database.getDb().collection("products").insertOne(productData);
    }
  }

  // 데이터베이스에서 제거
  remove() {
    return database.getDb().collection("products").deleteOne({_id: new mongodb.ObjectId(this.id)}); // 프로미스 리턴
  }

  replaceImage(newImage) {
    this.image = newImage, // 이미지 파일 이름
    this.imagePath = `product-data/images/${this.image}`;
    this.imageURL = `/products/assets/images/${this.image}`; // 프로젝트 경로에 대한 힌트를 주지 않기 위해서
  }
}

module.exports = Product;