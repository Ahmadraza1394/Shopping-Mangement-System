// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupSearch();
});

function loadProducts(products = null) {
  const productList =
    products || JSON.parse(localStorage.getItem("products")) || [];
  const productContainer = document.getElementById("product-list");

  productContainer.innerHTML = "";

  if (productList.length === 0) {
    productContainer.innerHTML =
      "<p class='text-red-500'>No products found.</p>";
    return;
  }

  productList.forEach((product) => {
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
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg duration-300">
    <div class="relative h-48 bg-gray-50 flex items-center justify-center">
      <img class="object-contain w-full h-full" src="img/${
        product.image
      }.jfif" alt="${product.name}">
    </div>
    <div class="p-4">
      <h2 class="text-xl font-bold text-gray-800 mb-2 truncate">${
        product.name
      }</h2>
      <p class="text-gray-600 mb-2 text-sm truncate">${product.description}</p>
      <p class="text-green-600 font-bold mb-4 text-lg">$${product.price.toFixed(
        2
      )}</p>
      <button class="w-full bg-gray-800 text-white py-2 px-4 rounded transition duration-300 transform hover:bg-gray-700 hover:scale-105" onclick="addToCart(${
        product.id
      })">Add to Cart</button>
    </div>
  </div>
`;

    productContainer.appendChild(productCard);
  });
}

function addToCart(productId) {
  const product = getProductById(productId);
  const cart = Cart.getCart();
  cart.addItem(product);
  cart.save();
  showPopup("Added to cart successfully");
}

function getProductById(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  return products.find((product) => product.id === productId);
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup-message";
  popup.textContent = message;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("show");
  }, 10);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300);
  }, 2000);
}

function searchProducts() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  loadProducts(filteredProducts);
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
      loadProducts();
    } else {
      searchProducts();
    }
  });
}
