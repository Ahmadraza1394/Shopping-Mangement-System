// js/checkout.js
document.addEventListener("DOMContentLoaded", () => {
  const cart = Cart.getCart();
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const checkoutForm = document.getElementById("checkout-form");
  const userBalanceElement = document.getElementById("user-balance");

  const currentUser = User.getCurrentUser();
  if (!currentUser) {
    alert("You must be logged in to proceed with checkout.");
    window.location.href = "login.html";
    return;
  }

  if (cart.items.length === 0) {
    emptyCartMessage.classList.remove("hidden");
  } else {
    checkoutForm.classList.remove("hidden");
  }

  userBalanceElement.innerHTML = `Balance: $${
    currentUser.accountBalance ? currentUser.accountBalance.toFixed(2) : "0.00"
  }`;

  document
    .getElementById("payment-method")
    .addEventListener("change", function () {
      const method = this.value;
      document
        .querySelectorAll(".payment-fields")
        .forEach((field) => field.classList.add("hidden"));
      if (method === "account-balance") {
        document
          .getElementById("account-balance-fields")
          .classList.remove("hidden");
      } else if (method === "debit-card") {
        document.getElementById("debit-card-fields").classList.remove("hidden");
      } else if (method === "digital-wallet") {
        document
          .getElementById("digital-wallet-fields")
          .classList.remove("hidden");
      }
    });

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      processPayment();
    }
  });

  function validateForm() {
    const paymentMethod = document.getElementById("payment-method").value;
    let orderTotal = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    if (paymentMethod === "account-balance") {
      if (currentUser.accountBalance < orderTotal) {
        alert(
          "Insufficient balance. Please choose another payment method or add funds."
        );
        return false;
      }
    } else if (paymentMethod === "debit-card") {
      const cardNumber = document.getElementById("card-number").value;
      const expirationDate = document.getElementById("expiration-date").value;
      const cvv = document.getElementById("cvv").value;

      if (!Payment.validateCard(cardNumber, expirationDate, cvv)) {
        return false;
      }
    } else if (paymentMethod === "digital-wallet") {
      const paypalEmail = document.getElementById("paypal-email").value;
      const paypalPassword = document.getElementById("paypal-password").value;

      if (!Payment.validateDigitalWallet(paypalEmail, paypalPassword)) {
        return false;
      }
    }
    return true;
  }

  function processPayment() {
    try {
      const paymentMethod = document.getElementById("payment-method").value;
      let orderTotal = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      let paymentDetails = {};

      if (paymentMethod === "account-balance") {
        currentUser.accountBalance -= orderTotal;
        User.saveCurrentUser(currentUser);
        User.updateUser(currentUser); // Ensure method updates the user
        paymentDetails.method = "account-balance";
      } else if (paymentMethod === "debit-card") {
        paymentDetails = {
          method: "debit-card",
          cardNumber: document.getElementById("card-number").value,
          expirationDate: document.getElementById("expiration-date").value,
          cvv: document.getElementById("cvv").value,
        };
        if (
          !Payment.validateCard(
            paymentDetails.cardNumber,
            paymentDetails.expirationDate,
            paymentDetails.cvv
          )
        ) {
          throw new Error("Invalid card details.");
        }
      } else if (paymentMethod === "digital-wallet") {
        paymentDetails = {
          method: "digital-wallet",
          paypalEmail: document.getElementById("paypal-email").value,
          paypalPassword: document.getElementById("paypal-password").value,
        };
        if (
          !Payment.validateDigitalWallet(
            paymentDetails.paypalEmail,
            paymentDetails.paypalPassword
          )
        ) {
          throw new Error("Invalid PayPal credentials.");
        }
      }

      const newPayment = new Payment(Date.now(), orderTotal, paymentDetails);
      if (!Payment.processPayment(newPayment)) {
        throw new Error("Payment processing failed.");
      }

      // Record Sales Data for Each Product in the Cart
      cart.items.forEach((item) => {
        Sale.addSale(
          item.product.name,
          item.quantity,
          item.product.price * item.quantity
        );
      });

      const newOrder = new Order(
        Date.now(),
        currentUser.id,
        cart.items,
        orderTotal
      );
      Order.placeOrder(newOrder);

      alert("Payment processed successfully!");
      cart.clear();
      window.location.href = "orders.html";
    } catch (error) {
      alert(`An error occurred during the payment process: ${error.message}`);
      console.error("Payment error:", error);
    }
  }
});
