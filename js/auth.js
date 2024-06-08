// js/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const paymentMethodSelect = document.getElementById("payment-method");
  const debitCardFields = document.getElementById("debit-card-fields");
  const digitalWalletFields = document.getElementById("digital-wallet-fields");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      registerUser();
    });

    paymentMethodSelect.addEventListener("change", () => {
      const selectedMethod = paymentMethodSelect.value;
      togglePaymentFields(selectedMethod);
    });

    function togglePaymentFields(method) {
      if (method === "debit-card") {
        debitCardFields.classList.remove("hidden");
        digitalWalletFields.classList.add("hidden");
        setRequired(debitCardFields, true);
        setRequired(digitalWalletFields, false);
      } else if (method === "digital-wallet") {
        debitCardFields.classList.add("hidden");
        digitalWalletFields.classList.remove("hidden");
        setRequired(debitCardFields, false);
        setRequired(digitalWalletFields, true);
      }
    }

    function setRequired(container, required) {
      Array.from(container.querySelectorAll("input")).forEach((input) => {
        input.required = required;
      });
    }

    paymentMethodSelect.dispatchEvent(new Event("change")); // Trigger change on load
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loginUser();
    });
  }
});

function registerUser() {
  console.log("Register user function called");
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
    if (
      !Payment.validateCard(
        paymentDetails.cardNumber,
        paymentDetails.expirationDate,
        paymentDetails.cvv
      )
    ) {
      return;
    }
  } else if (paymentMethod === "digital-wallet") {
    paymentDetails = {
      paypalEmail: document.getElementById("paypal-email").value,
      paypalPassword: document.getElementById("paypal-password").value,
    };
    if (
      !Payment.validateDigitalWallet(
        paymentDetails.paypalEmail,
        paymentDetails.paypalPassword
      )
    ) {
      return;
    }
  }

  const newUser = new User(Date.now(), name, email, password, accountBalance);
  newUser.paymentMethod = paymentMethod;
  newUser.paymentDetails = paymentDetails;

  User.register(newUser);

  alert("Sign up successful!");
  document.getElementById("signup-form").reset();
  window.location.href = "login.html";
}

function loginUser() {
  console.log("Login user function called");
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = User.login(email, password);

  if (user) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
}
