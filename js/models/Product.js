// js/models/Product.js
class Product {
  constructor(id, name, description, price, image) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
  }

  static getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
  }

  save() {
    let products = Product.getProducts();
    products.push(this);
    localStorage.setItem("products", JSON.stringify(products));
  }

  static remove(productId) {
    let products = Product.getProducts();
    products = products.filter((product) => product.id !== productId);
    localStorage.setItem("products", JSON.stringify(products));
  }
}
