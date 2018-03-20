// Train Time JS
// console.log("js is connected");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDQ1Lh_8FikIssbE02fTlCdlbMxLKbsDSo",
  authDomain: "train-time-c7d5c.firebaseapp.com",
  databaseURL: "https://train-time-c7d5c.firebaseio.com",
  projectId: "train-time-c7d5c",
  storageBucket: "train-time-c7d5c.appspot.com",
  messagingSenderId: "862329771952"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

var name = "";
var destination = "";
var time = "";
var frequency = "";
var addTrain

$("#addTrain").on("click", function (event) {
  event.preventDefault();
  name = $("#inputName").val().trim();
  destination = $("#inputDestination").val().trim();
  time = moment($("#inputTime").val().trim(), "HH:mm").subtract(1, "year").format("X");
  frequency = $("#inputFreq").val().trim();
  console.log(name);
  console.log(destination);
  console.log(time);
  console.log(frequency);

  database.ref().push(
    {
      name: name,
      destination: destination,
      time: time,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    }
  )
})

database.ref().on("child_added", function (childSnapshot) {

  var childTime = childSnapshot.val().startTime;
  var parseTime = moment(childTime, "HH:mm");

  // converting 24 hour time to 12 AM/PM time (1:00 PM)
  // return moment("13", ["HH"]).format("hh A");

  // time right now
  var now = moment();
  console.log(now);

  var startTime = childSnapshot.val().time;
  var freq = childSnapshot.val().frequency;
  var remainder = now.subtract(startTime,"hh:mm A") % freq;
  console.log(remainder);

  var nextTrain = now.add(remainder,"m");

  $("#myTable").append(`
        <tr>
        <td>${childSnapshot.val().name}</td>
        <td>${childSnapshot.val().destination}</td>
        <td>${childSnapshot.val().frequency}</td>
        <td>${nextTrain}</td>
        <td>${remainder}</td>
        <td> </td>
        </tr>
    `)

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});