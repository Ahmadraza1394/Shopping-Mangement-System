document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const paymentMethodSelect = document.getElementById("payment-method");
  const debitCardFields = document.getElementById("debit-card-fields");
  const digitalWalletFields = document.getElementById("digital-wallet-fields");

  paymentMethodSelect.addEventListener("change", () => {
    const selectedMethod = paymentMethodSelect.value;

    if (selectedMethod === "debit-card") {
      debitCardFields.classList.remove("hidden");
      digitalWalletFields.classList.add("hidden");

      // Set required attribute for debit card fields
      document
        .getElementById("card-number")
        .setAttribute("required", "required");
      document
        .getElementById("expiration-date")
        .setAttribute("required", "required");
      document.getElementById("cvv").setAttribute("required", "required");

      // Remove required attribute for PayPal fields
      document.getElementById("paypal-email").removeAttribute("required");
      document.getElementById("paypal-password").removeAttribute("required");
    } else if (selectedMethod === "digital-wallet") {
      debitCardFields.classList.add("hidden");
      digitalWalletFields.classList.remove("hidden");

      // Remove required attribute for debit card fields
      document.getElementById("card-number").removeAttribute("required");
      document.getElementById("expiration-date").removeAttribute("required");
      document.getElementById("cvv").removeAttribute("required");

      // Set required attribute for PayPal fields
      document
        .getElementById("paypal-email")
        .setAttribute("required", "required");
      document
        .getElementById("paypal-password")
        .setAttribute("required", "required");
    }
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    registerUser();
  });

  // Trigger change event on page load to show the correct fields
  paymentMethodSelect.dispatchEvent(new Event("change"));
});

function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const paymentMethod = document.getElementById("payment-method").value;
  const accountBalance =
    parseFloat(document.getElementById("account-balance").value) || 0;

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  let paymentDetails = {};

  if (paymentMethod === "debit-card") {
    paymentDetails = {
      cardNumber: document.getElementById("card-number").value,
      expirationDate: document.getElementById("expiration-date").value,
      cvv: document.getElementById("cvv").value,
    };
  } else if (paymentMethod === "digital-wallet") {
    const paypalPassword = document.getElementById("paypal-password").value;
    if (paypalPassword.length < 8) {
      alert("PayPal password must be at least 8 characters long.");
      return;
    }

    paymentDetails = {
      paypalEmail: document.getElementById("paypal-email").value,
      paypalPassword: paypalPassword,
    };
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    paymentMethod: paymentMethod,
    paymentDetails: paymentDetails,
    accountBalance: accountBalance,
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("User registered successfully!");
  document.getElementById("signup-form").reset();
  window.location.href = "login.html";
}
