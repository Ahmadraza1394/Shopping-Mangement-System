// js/cart.js
document.addEventListener("DOMContentLoaded", () => {
  const cart = Cart.getCart();
  updateCartUI();

  function updateCartUI() {
    const cartContainer = document.getElementById("cart-items");
    const totalAmount = document.getElementById("total-amount");
    cartContainer.innerHTML = "";

    if (cart.items.length === 0) {
      cartContainer.innerHTML = `
              <div class="text-center">
                  <p class="text-xl text-red-500 mb-4">Your cart is empty.</p>
                  <a href="index.html" class="bg-blue-500 text-white py-2 px-4 rounded">Select items from here</a>
              </div>
          `;
      totalAmount.textContent = "0.00";
      return;
    }

    let total = 0;

    cart.items.forEach((item) => {
      total += item.product.price * item.quantity;

      const cartItem = document.createElement("div");
      cartItem.classList.add(
        "border",
        "p-4",
        "rounded",
        "shadow",
        "mb-4",
        "bg-gray-100"
      );

      cartItem.innerHTML = `
              <img class="bg-cover" src="img/${item.product.image}.jfif" alt="${
        item.product.name
      }" class="w-full h-24 object-cover mb-4 bg-cover">
              <h2 class="text-xl font-bold mb-2">${item.product.name}</h2>
              <p class="text-gray-700 mb-2">${item.product.description}</p>
              <p class="text-green-600 font-bold mb-2">$${item.product.price.toFixed(
                2
              )}</p>
              <p class="text-gray-700 mb-2">Quantity: 
              <input type="number" value="${
                item.quantity
              }" min="1" class="quantity-input  placeholder-gray-700 focus:ring-2 focus:ring-blue-500" onchange="updateQuantity(${
        item.product.id
      }, this.value)">
              </p>
              <button class="bg-red-500 text-white py-2 px-4 rounded" onclick="removeFromCart(${
                item.product.id
              })">Remove</button>
          `;

      cartContainer.appendChild(cartItem);
    });

    totalAmount.textContent = total.toFixed(2);
  }

  window.removeFromCart = function (productId) {
    cart.removeItem(productId);
    updateCartUI();
  };

  window.updateQuantity = function (productId, quantity) {
    cart.updateQuantity(productId, parseInt(quantity));
    updateCartUI();
  };

  window.proceedToCheckout = function () {
    window.location.href = "checkout.html";
  };
});
