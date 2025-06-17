const auth = firebase.auth();
const db = firebase.database();

function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!name || !email || !password || !role) {
    alert("Please fill all fields.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.ref("users/" + cred.user.uid).set({
        name,
        email,
        role
      });
    })
    .then(() => {
      alert("Signup successful!");
      redirectToDashboard();
    })
    .catch(err => alert("Signup failed: " + err.message));
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      return db.ref("users/" + cred.user.uid + "/role").once("value");
    })
    .then(snapshot => {
      const role = snapshot.val();
      if (role === "doctor") {
        window.location.href = "doctor.html";
      } else if (role === "patient") {
        window.location.href = "patient.html";
      } else {
        alert("User role not set.");
      }
    })
    .catch(error => {
      // Show a friendly message for common errors
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-email"
      ) {
        alert("Incorrect email or password.");
      } else {
        alert("Login failed: " + error.message);
      }
    });
}



function forgotPassword() {
  const email = prompt("Enter your registered email to reset your password:");
  if (!email) return;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Reset link sent! Please check your email.");
    })
    .catch(error => {
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else {
        alert("Error: " + error.message);
      }
    });
}


