// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBDaqY-QPew7PTNYL4MDQ6SsJ0PJI6qN-Q",
  authDomain: "auth-demo-6e557.firebaseapp.com",
  projectId: "auth-demo-6e557",
  messagingSenderId: "743042870742",
  appId: "1:743042870742:web:d559b89e121399ec778877"
});

const messaging = firebase.messaging();
