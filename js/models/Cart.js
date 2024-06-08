// js/models/Cart.js
class Cart {
  constructor(items = []) {
    this.items = items;
  }

  static getCart() {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    return new Cart(storedCart.items || []);
  }

  addItem(product) {
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
  }

  save() {
    localStorage.setItem("cart", JSON.stringify(this));
  }

  clear() {
    this.items = [];
    this.save();
  }
}
