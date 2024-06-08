// js/models/Sale.js
class Sale {
  constructor(productName, quantity, totalSales) {
    this.productName = productName;
    this.quantity = quantity;
    this.totalSales = totalSales;
  }

  static getSalesData() {
    return JSON.parse(localStorage.getItem("salesData")) || [];
  }

  static addSale(productName, quantity, totalSales) {
    let salesData = Sale.getSalesData();
    const existingSale = salesData.find(
      (sale) => sale.productName === productName
    );

    if (existingSale) {
      existingSale.quantity += quantity;
      existingSale.totalSales += totalSales;
    } else {
      salesData.push(new Sale(productName, quantity, totalSales));
    }

    localStorage.setItem("salesData", JSON.stringify(salesData));
  }
}
