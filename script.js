// Initialize Firebase Auth & DB
const auth = firebase.auth();
const db = firebase.database();
const messaging = firebase.messaging();

// 🔔 Ask for notification permission & get token
function requestNotificationPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      messaging.getToken({
        vapidKey: "BNYr4nNZXE8wq-uOVpfxx-St67w5vCaJH1fJga8kCe2Isnu152_7IRjbcqieyXeYgD4EgCpJFl_yWBBDlBCLTSI" // 🔁 Replace this with your real VAPID key from Firebase Console
      }).then((token) => {
        console.log("🔔 Notification token:", token);
        // (Optional) Save token to DB with user info
      }).catch((err) => {
        console.error("FCM token error:", err);
      });
    } else {
      console.warn("Notification permission denied.");
    }
  });
}

// 🔐 SIGNUP FUNCTION
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
      requestNotificationPermission(); // ✅ Ask for notification after signup
      redirectToDashboard();
    })
    .catch(err => alert("Signup failed: " + err.message));
}

// 🔐 LOGIN FUNCTION
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
      requestNotificationPermission(); // ✅ Ask for notification after login

      if (role === "doctor") {
        window.location.href = "doctor.html";
      } else if (role === "patient") {
        window.location.href = "patient.html";
      } else {
        alert("User role not set.");
      }
    })
    .catch(error => {
      let message;
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-email":
          message = "Incorrect email or password.";
          break;
        default:
          message = "Login failed: " + error.message;
      }
      alert(message);
    });
}

// 🔁 LOGOUT FUNCTION (used in doctor/patient.html)
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// 🔁 Forgot Password
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
