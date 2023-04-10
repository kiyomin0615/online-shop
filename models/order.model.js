const mongodb = require("mongodb");

const database = require("../data/database");

class Order {
  // status: 대기, 성공, 취소
  constructor(cart, user, status = "대기", date, orderId) {
    this.productData = cart;
    this.userData = user;
    this.status = status;
    if (date) {
      this.date = date
    }
    if (orderId) {
      this.id = orderId;
    }
  }

  save() {
    if (this.id) {
      // Update Order
      const orderId = new mongodb.ObjectId(this.id);
      return database.getDb().collection("orders").updateOne({_id: orderId}, {$set: {status: this.status}});
    } else {
      // Add New Order
      const orderDocumnet = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status
      };

      return database.getDb().collection("orders").insertOne(orderDocumnet);
    }
  }

  // document to Order Class
  static transformOrderDocument(orderDocument) {
    return new Order(
      orderDocument.productData,
      orderDocument.userData,
      orderDocument.status,
      orderDocument.date,
      orderDocument._id
    )
  }
  
  // document to Order Class
  static transformOrderDocuments(orderDocuments) {
    return orderDocuments.map(this.transformOrderDocument);
  }

  // 모든 주문 정보 찾기
  static async findAll() {
    // sort({_id: -1});
    // id 기준으로 내림차순 정렬(descending order)
    const orders = await database.getDb().collection("orders").find().sort({_id: -1}).toArray();
    return this.transformOrderDocuments(orders);
  }

  // 해당 유저의 모든 주문 정보 찾기
  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await database.getDb().collection("orders").find({"userData._id": uid}).sort({_id: -1}).toArray();
    return this.transformOrderDocuments(orders);
  }

  // 주문 ID로 주문 정보 찾기
  static async findById(orderId) {
    const order = await database.getDb().collection("orders").findOne({_id: new mongodb.ObjectId(orderId)});
    return this.transformOrderDocument(order);
  }
}

module.exports = Order;