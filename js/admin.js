// js/admin.js
document.addEventListener("DOMContentLoaded", () => {
  const adminUsername = "admin";
  const adminPassword = "password";

  document
    .getElementById("admin-login-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("admin-username").value;
      const password = document.getElementById("admin-password").value;

      if (username === adminUsername && password === adminPassword) {
        document.getElementById("admin-login").classList.add("hidden");
        document.getElementById("admin-content").classList.remove("hidden");
        loadAdminContent();
      } else {
        alert("Invalid username or password.");
      }
    });

  document
    .getElementById("add-product-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      addProduct();
    });
});

function loadAdminContent() {
  loadProducts();
  loadSalesData();
  loadOrderData();
}

function loadProducts() {
  const productContainer = document.getElementById("product-list");
  const products = Product.getProducts();
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add(
      "border",
      "p-4",
      "rounded",
      "shadow",
      "hover:shadow-lg",
      "transition-shadow",
      "duration-200"
    );

    productCard.innerHTML = `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <img class="bg-cover h-36" src="../img/${
                product.image
              }.jfif" alt="${product.name}">
              <div class="p-6">
                  <h2 class="text-2xl font-bold text-gray-800 mb-2">${
                    product.name
                  }</h2>
                  <p class="text-gray-600 mb-4">${product.description}</p>
                  <p class="text-green-500 text-lg font-semibold mb-4">$${product.price.toFixed(
                    2
                  )}</p>
                  <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300" onclick="removeProduct(${
                    product.id
                  })">
                      Remove
                  </button>
              </div>
          </div>
      `;
    productContainer.appendChild(productCard);
  });

  document.getElementById("total-products").textContent = products.length;
}

function addProduct() {
  const productName = document.getElementById("product-name").value;
  const productDescription = document.getElementById(
    "product-description"
  ).value;
  const productPrice = parseFloat(
    document.getElementById("product-price").value
  );
  const productImage = document.getElementById("product-image").value;

  const newProduct = new Product(
    Date.now(),
    productName,
    productDescription,
    productPrice,
    productImage
  );
  newProduct.save();

  document.getElementById("add-product-form").reset();
  loadProducts();
}

function removeProduct(productId) {
  Product.remove(productId);
  loadProducts();
}

function loadSalesData() {
  const salesTableBody = document.getElementById("sales-table-body");
  const salesData = Sale.getSalesData();
  salesTableBody.innerHTML = "";

  let totalSales = 0;
  let totalProductsSold = 0;

  salesData.forEach((sale) => {
    totalSales += sale.totalSales;
    totalProductsSold += sale.quantity;

    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="py-2 px-4 border">${sale.productName}</td>
          <td class="py-2 px-4 border">${sale.quantity}</td>
          <td class="py-2 px-4 border">$${sale.totalSales.toFixed(2)}</td>
      `;
    salesTableBody.appendChild(row);
  });

  document.getElementById("total-sales").textContent = totalSales.toFixed(2);
  document.getElementById("total-products-sold").textContent =
    totalProductsSold;
  renderSalesChart(salesData);
}

function loadOrderData() {
  const ordersTableBody = document.getElementById("orders-table-body");
  const orders = Order.getOrders();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  ordersTableBody.innerHTML = "";

  let totalOrders = 0;

  orders.forEach((order) => {
    const user = users.find((u) => u.id === order.userId);
    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="py-2 px-4 border">${order.orderId}</td>
          <td class="py-2 px-4 border">$${order.total.toFixed(2)}</td>
          <td class="py-2 px-4 border">${order.status}</td>
          <td class="py-2 px-4 border">${user ? user.email : "Unknown"}</td>
      `;
    ordersTableBody.appendChild(row);
    totalOrders++;
  });

  document.getElementById("total-orders").textContent = totalOrders;
}

function renderSalesChart(salesData) {
  const productNames = salesData.map((sale) => sale.productName);
  const quantities = salesData.map((sale) => sale.quantity);

  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: productNames,
      datasets: [
        {
          data: quantities,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Sales Distribution" },
      },
    },
  });
}
