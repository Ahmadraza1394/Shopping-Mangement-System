// js/models/Payment.js
class Payment {
  constructor(paymentID, amount, details) {
    this.paymentID = paymentID;
    this.amount = amount;
    this.details = details;
  }

  static processPayment(payment) {
    console.log("Processing payment:", payment);
    return true; // Simulate successful payment processing
  }

  static validateCard(cardNumber, expirationDate, cvv) {
    const cardNumberPattern = /^\d{16}$/;
    const expirationDatePattern = /^\d{2}\/\d{2}$/;
    const cvvPattern = /^\d{3}$/;

    if (!cardNumberPattern.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");
      return false;
    }
    if (!expirationDatePattern.test(expirationDate)) {
      alert("Please enter a valid expiration date (MM/YY).");
      return false;
    }
    if (!cvvPattern.test(cvv)) {
      alert("Please enter a valid 3-digit CVV.");
      return false;
    }
    return true;
  }

  static validateDigitalWallet(paypalEmail, paypalPassword) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(paypalEmail)) {
      alert("Please enter a valid PayPal email.");
      return false;
    }
    if (paypalPassword.length < 8) {
      alert("PayPal password must be at least 8 characters long.");
      return false;
    }
    return true;
  }

  static refundPayment(paymentID) {
    console.log("Refunding payment with ID:", paymentID);
    return true; // Simulate successful refund
  }
}
