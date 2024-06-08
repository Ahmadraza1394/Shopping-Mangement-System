// js/models/User.js
class User {
  constructor(id, name, email, password, accountBalance, address = "") {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.accountBalance = accountBalance;
    this.address = address;
  }

  static getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  static saveCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  static register(user) {
    let users = User.getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  static updateUser(updatedUser) {
    let users = User.getUsers();
    users = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem("users", JSON.stringify(users));
    User.saveCurrentUser(updatedUser);
  }

  static login(email, password) {
    const users = User.getUsers();
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      User.saveCurrentUser(user);
      return user;
    }
    return null;
  }
}
