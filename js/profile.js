// js/profile.js
document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profile-form");
  const userInfo = document.getElementById("user-info");
  const editButton = document.getElementById("edit-button");
  const logoutBtn = document.getElementById("logout-btn");
  let currentUser = User.getCurrentUser();

  if (currentUser) {
    displayUserInfo(currentUser);
    profileForm.querySelector("#profile-name").value = currentUser.name;
    profileForm.querySelector("#profile-email").value = currentUser.email;
    profileForm.querySelector("#profile-password").value = currentUser.password;
    profileForm.querySelector("#profile-address").value =
      currentUser.address || "";
    logoutBtn.classList.remove("hidden");

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  } else {
    userInfo.innerHTML =
      "<p class='text-red-500'>You must be logged in to view your profile.</p>";
    editButton.classList.add("hidden");
  }

  editButton.addEventListener("click", () => {
    profileForm.classList.toggle("hidden");
    userInfo.classList.toggle("hidden");
    editButton.classList.toggle("hidden");
  });

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateProfile();
  });
});

function displayUserInfo(user) {
  console.log("Displaying user info:", user); // Debug log

  // Ensure accountBalance is a valid number
  const balance = user.accountBalance != null ? user.accountBalance : 0;

  document.getElementById("user-info").innerHTML = `
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
          <p class="text-gray-700 mb-2"><strong>Name:</strong> ${user.name}</p>
          <p class="text-gray-700 mb-2"><strong>Email:</strong> ${
            user.email
          }</p>
          <p class="text-gray-700 mb-2"><strong>Address:</strong> ${
            user.address || "N/A"
          }</p>
          <p class="text-gray-700 mb-2"><strong>Account Balance:</strong> $${balance.toFixed(
            2
          )}</p>
      </div>
  `;
}

function updateProfile() {
  const name = document.getElementById("profile-name").value;
  const email = document.getElementById("profile-email").value;
  const password = document.getElementById("profile-password").value;
  const address = document.getElementById("profile-address").value;
  const balanceToAdd =
    parseFloat(document.getElementById("profile-balance").value) || 0;

  let currentUser = User.getCurrentUser();
  currentUser.name = name;
  currentUser.email = email;
  currentUser.password = password;
  currentUser.address = address;
  currentUser.accountBalance = (currentUser.accountBalance || 0) + balanceToAdd;

  User.saveCurrentUser(currentUser);
  User.updateUser(currentUser);

  alert("Profile updated successfully!");

  displayUserInfo(currentUser);
  document.getElementById("profile-form").classList.add("hidden");
  document.getElementById("user-info").classList.remove("hidden");
  document.getElementById("edit-button").classList.remove("hidden");
}
