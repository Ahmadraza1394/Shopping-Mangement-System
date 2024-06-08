// js/models/Order.js
class Order {
  constructor(
    orderId,
    userId,
    items,
    total,
    status = "Processing",
    orderTime = Date.now()
  ) {
    this.orderId = orderId;
    this.userId = userId;
    this.items = items;
    this.total = total;
    this.status = status;
    this.orderTime = orderTime;
  }

  static getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
  }

  static placeOrder(order) {
    let orders = Order.getOrders();
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  }
}
