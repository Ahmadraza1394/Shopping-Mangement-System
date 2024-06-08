// js/orders.js
document.addEventListener("DOMContentLoaded", () => {
  loadOrderHistory();
});

function loadOrderHistory() {
  const orderHistory = document.getElementById("order-history");
  const orders = Order.getOrders();
  const currentUser = User.getCurrentUser();

  if (!currentUser) {
    orderHistory.innerHTML =
      "<p class='text-red-500'>You must be logged in to view your orders.</p>";
    return;
  }

  const userOrders = orders.filter((order) => order.userId === currentUser.id);

  if (userOrders.length === 0) {
    orderHistory.innerHTML = "<p class='text-red-500'>No orders found.</p>";
    return;
  }

  userOrders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("border", "p-4", "rounded", "shadow", "mb-4");

    orderDiv.innerHTML = `
          <div class="bg-white p-6 rounded-lg shadow-lg mb-4">
              <h3 class="text-2xl font-semibold text-gray-800 mb-2">Order ID: ${
                order.orderId
              }</h3>
              <p class="mb-2 text-gray-700"><strong>User:</strong> ${
                currentUser.name
              }</p>
              <p class="mb-2 text-gray-700"><strong>Total:</strong> $${order.total.toFixed(
                2
              )}</p>
              <p class="mb-2 text-gray-700"><strong>Status:</strong>
                  <span id="status-${
                    order.orderId
                  }" class="px-2 py-1 rounded ${getStatusColor(order.status)}">
                      ${order.status}
                  </span>
              </p>
              ${
                order.status === "On the way" || order.status === "Processing"
                  ? `
                  <p class="mb-4 text-gray-700"><strong>Time Remaining:</strong> <span id="countdown-${order.orderId}" class="text-red-600 font-semibold"></span></p>
              `
                  : ""
              }
              <h4 class="text-xl font-bold text-gray-800 mb-2">Items:</h4>
              <ul class="mb-2 list-disc list-inside">
                  ${order.items
                    .map(
                      (item) => `
                      <li class="text-gray-700">${item.product.name} - ${
                        item.quantity
                      } x $${item.product.price.toFixed(2)}</li>
                  `
                    )
                    .join("")}
              </ul>
          </div>
      `;

    orderHistory.appendChild(orderDiv);

    if (order.status === "Processing" || order.status === "On the way") {
      startCountdown(order.orderId, order.orderTime);
    }
  });
}

function getStatusColor(status) {
  if (status === "Delivered successfully") return "bg-green-200 text-green-800";
  if (status === "On the way") return "bg-yellow-200 text-yellow-800";
  return "bg-blue-200 text-blue-800";
}

function startCountdown(orderId, orderTime) {
  console.log("Order ID:", orderId, "Order Time:", orderTime); // Debug log

  const countdownElement = document.getElementById(`countdown-${orderId}`);
  const statusElement = document.getElementById(`status-${orderId}`);
  const oneHour = 3600000; // 1 hour in milliseconds
  const endTime = orderTime + oneHour;

  function updateCountdown() {
    const now = Date.now();
    const distance = endTime - now;

    console.log("Now:", now, "Distance:", distance); // Debug log

    if (distance <= 0) {
      clearInterval(interval);
      if (countdownElement) countdownElement.innerHTML = "";
      statusElement.innerHTML = "Delivered successfully";
      updateOrderStatus(orderId, "Delivered successfully");
    } else {
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (countdownElement)
        countdownElement.innerHTML = `${minutes}m ${seconds}s`;
      statusElement.innerHTML = "On the way";
      updateOrderStatus(orderId, "On the way");
    }
  }

  const interval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial call to display immediately
}

function updateOrderStatus(orderId, status) {
  let orders = Order.getOrders();
  orders = orders.map((order) => {
    if (order.orderId === orderId) {
      return { ...order, status: status };
    }
    return order;
  });
  localStorage.setItem("orders", JSON.stringify(orders));
}
