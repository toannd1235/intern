
var config = {
    apiKey: "AIzaSyD7tqUBKSzi03xX4yb8OX27toA8dw2fCpY",
    authDomain: "lab3-2c5bf.firebaseapp.com",
    databaseURL: "https://lab3-2c5bf.firebaseio.com",
    projectId: "lab3-2c5bf",
    storageBucket: "lab3-2c5bf.appspot.com",
    messagingSenderId: "971587876036"
  };

  firebase.initializeApp(config);
  const database = app.firestore();
  database.setting({
    timestampsInSnapshots: true
  });
  let switchRef= database.collection("users");
document.addEventListener('DOMContentLoaded', function(){
  var displayAlerteButton = document.getElementById('add');
  displayAlertButton.addEventListener('click', function() {
    alert('Welcome');
}, false)};
