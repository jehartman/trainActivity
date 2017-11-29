// Initialize Firebase
var config = {
  apiKey: "AIzaSyCxgAGhMI0GOA2KtwlCGvL3K7S_Mw3MazI",
  authDomain: "superduperprojectomatic.firebaseapp.com",
  databaseURL: "https://superduperprojectomatic.firebaseio.com",
  projectId: "superduperprojectomatic",
  storageBucket: "superduperprojectomatic.appspot.com",
  messagingSenderId: "401274810157"
};
firebase.initializeApp(config);
var database = firebase.database();

//set global variables
var trainName;
var trainDestination;
var trainFirstRun = 0;
var trainFrequency = 0;
var nextArrival = 0;
var minutesAway = 0;
var trainCounter = 0;
var convertedFirstRun = 0;
var timeElapsed = 0;

// stores values in database on click
$("#submitButton").on("click", function() {
  event.preventDefault();
  //this is a brief highlight effect on the header image, changing its opacity briefly on submit
  function trainToggle() {
    setTimeout(function() {
      $("#trainLeftBright").attr("id", "trainLeft");
      console.log("Traintoggle ran");
    }, 500); //end timeout
  } //end toggle
  $("#trainLeft").attr("id", "trainLeftBright");
  trainToggle();
  //captures and trims user input
  trainName = $("#trainNameInput").val().trim();
  trainDestination = $("#destinationInput").val().trim();
  trainFirstRun = $("#firstRunInput").val();
  trainFrequency = $("#frequencyInput").val().trim();
  //checks for a colon in the submitted time, not a perfect safegaurd but it should catch most errors
  if (trainFirstRun.indexOf(":") === -1 || isNaN(trainFrequency)) {
    alert("'First Train Time' must be in military time format (did you omit the colon?), and 'Frequency' must be a numeric value.");
  } else {
    timeCalculation();
  }
//pushes user inputs to db
  database.ref().push({
    trainName: trainName,
    trainDestination: trainDestination,
    trainFirstRun: trainFirstRun,
    trainFrequency: trainFrequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  }); //end of db push
}); //end of submit button onclick

//this takes a snapshot of database variables on value change and stores them in the global variables for each
database.ref().on("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    trainName = (childSnapshot.val().trainName);
    trainDestination = (childSnapshot.val().trainDestination);
    trainFirstRun = (childSnapshot.val().trainFirstRun);
    trainFrequency = (childSnapshot.val().trainFrequency);
    nextArrival = (childSnapshot.val().nextArrival);
    minutesAway = (childSnapshot.val().minutesAway);
  }); //end of childsnapshiot
}); //end of snapshot

//updates hmtl on db child-added. added unique IDs to each element even though they're not needed for the basic assignment-- seems like a good practice
database.ref().on("child_added", function(childsnap) {
  $("#trainSchedule").append("<tr>" + "<td id='trainName" + trainCounter + "'></td><td id='destination" + trainCounter + "'></td><td id='firstRun" + trainCounter + "'></td><td id='frequency" + trainCounter + "'></td><td id='nextArrival" + trainCounter + "'></td><td id='minutesAway" + trainCounter + "'></td>" + "</tr>");
  var nameId = "#trainName" + trainCounter;
  var destinationId = "#destination" + trainCounter;
  var firstRunId = "#firstRun" + trainCounter;
  var frequencyId = "#frequency" + trainCounter;
  var arrivalId = "#nextArrival" + trainCounter;
  var minutesAwayId = "#minutesAway" + trainCounter;
  trainName = (childsnap.val().trainName);
  trainDestination = (childsnap.val().trainDestination);
  trainFirstRun = (childsnap.val().trainFirstRun);
  trainFrequency = (childsnap.val().trainFrequency);
  nextArrival = (childsnap.val().nextArrival);
  minutesAway = (childsnap.val().minutesAway);
  //I was getting weird results trying to make these all one line, so I split them into variables and now it is working
  var name2 = $(nameId);
  var destination2 = $(destinationId);
  var firstRun2 = $(firstRunId);
  var frequencyId2 = $(frequencyId);
  var arrival2 = $(arrivalId);
  var minutesAway2 = $(minutesAwayId);
  name2.text(trainName);
  destination2.text(trainDestination);
  firstRun2.text(trainFirstRun);
  frequencyId2.text(trainFrequency);
  arrival2.text(nextArrival);
  minutesAway2.text(minutesAway);
  trainCounter++;
}); //end of childadded snapshot

//empties the database and uses the default button refresh to clear page. was hoping to write a function to delete individual trains but time expired.
$("#destroyButton").on("click", function() {
  event.preventDefault();
  database.ref().remove();
  $("#trainLeft").attr("id", "boom");
  $("#boom").attr("src", "assets/images/boom.png");
  trainFireball();

}); //end of destroy button onclick

//silly fireball quasi-animation on destroy
function trainFireball() {
  setTimeout(function() {
    $("#boom").attr("id", "trainLeft");
    $("#trainLeft").attr("src", "../images/trainLeft.png");
    console.log("trainFireball ran");
  }, 500);
  setTimeout(function() {
    location.reload();
  }, 500);

} //end of trainFireball

//this is mostly just copied from what was supplied in class. this does work but i need to study it until i can remember each step.
function timeCalculation() {
  //this converts input to momentjs unix time format? i think so.
  var trainFirstRunConverted = moment(trainFirstRun, "hh:mm").subtract(1, "years");
  console.log("trainFirstRunConverted is " + trainFirstRunConverted);
  //captures current time-- not sure this line is even needed here but i'm copy pasting so leaving it in
  var currentTime = moment();
  console.log("current time: " + moment(currentTime).format("hh:mm"));
  //gets difference between now and the first train run
  var diffTime = moment().diff(moment(trainFirstRunConverted), "minutes");
  console.log("difference in time: " + diffTime);
  //gets the remainder using modulus
  var tRemainder = diffTime % trainFrequency;
  console.log("tRemainder is " + tRemainder);
  //calculate time until next train
  minutesAway = trainFrequency - tRemainder;
  console.log("tRemainder --Minutes till Train-- is :" + minutesAway);
  //i believe this step takes the momentjs object and parses it into military time. why does momentjs produce an object?
  nextTrain = moment().add(minutesAway, "minutes");
  nextArrival = moment(nextTrain).format("HH:mm");
  console.log("nextArrival: " + moment(nextArrival).format("HH:mm"));
}

//I omitted the below code because I don't fully understand how it works, though i understand what it does in general
// function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
//   }); //of of errorObject


// this is a train warped by italicization. ascii art forever.
//     _-====-__-======-__-========-_____-============-__
//     _(                                                 _)
//     OO(                                                   )_
//     0  (_                                                   _)
//     o0     (_                                                _)
//     o         '=-___-===-_____-========-___________-===-dwb-='
//     .o                                _________
//     . ______          ______________  |         |      _____
//     _()_||__|| ________ |            |  |_________|   __||___||__
//     ( AMTRAK| |      | |            | __Y______00_| |_         _|
//     /-OO----OO""="OO--OO"="OO--------OO"="OO-------OO"="OO-------OO"=P
// #####################################################################
