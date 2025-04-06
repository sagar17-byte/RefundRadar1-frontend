const firebaseConfig = {
    apiKey: "AIzaSyAYArk0OdErgsUb5kmHbN_9lrD07i8vhmA",
    authDomain: "refundradar-de2df.firebaseapp.com",
    projectId: "refundradar-de2df",
    storageBucket: "refundradar-de2df.firebasestorage.app",
    messagingSenderId: "552764302278",
    appId: "1:552764302278:web:a8bf3f6c9c4554bb0488c7",
    measurementId: "G-1Y60BKQC5P"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  