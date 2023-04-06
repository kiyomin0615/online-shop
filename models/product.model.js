const database = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title,
    this.summary = productData.summary,
    this.price = +productData.price, // string to number
    this.description = product.description,
    this.image = productData.image // 이미지 파일 이름
    this.imagePath = `product-data/images/${productData.image}`;
    this.imageURL = `/products/assets/images/${productData.image}`; // 프로젝트 경로에 대한 힌트를 주지 않기 위해서
    if (productData._id) {
      this.id = productData._id.toString();
    }
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
    await database.getDb().collection("products").insertOne({
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image, // 이미지 파일 이름
    });
  }
}

module.exports = Product;