const database = require("../data/database");

class Order {
  // status: pending, fulfilled, cancelled
  constructor(cart, user, status = "pending", date, orderId) {
    this.productData = cart;
    this.userData = user;
    this.status = status;
    // this.date = new Date(date);
    this.id = orderId;
  }

  save() {
    if (this.id) {
      // Update Order
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
}

module.exports = Order;