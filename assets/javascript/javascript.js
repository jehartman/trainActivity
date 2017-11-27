

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

var trainName;
var trainDestination;
var trainFirstRun = 0;
var trainFrequency = 0;
var nextArrival = 0;
var minutesAway = 0;
var trainCounter = 0;
var convertedFirstRun = 0;

//this stores values in database on click
$("#submitButton").on("click", function () {
  event.preventDefault();

  function trainToggle() {
    setTimeout(function () {
            $("#trainLeftBright").attr("id", "trainLeft");
            console.log("Traintoggle ran");
        }, 500);
    }
  $("#trainLeft").attr("id", "trainLeftBright");
  trainToggle();
  trainName = $("#trainNameInput").val().trim();
  trainDestination = $("#destinationInput").val().trim();
  trainFirstRun = $("#firstRunInput").val();
  console.log("TFR: " + trainFirstRun);
  trainFrequency = $("#frequencyInput").val().trim();
  if (trainFirstRun.indexOf(":") === -1 || isNaN(trainFrequency)) {

    alert("'First Train Time' must be in military time format ('HH:MM'), and 'Frequency' must be a numeric value.");
    }
  else {
    var now = moment().format("HH:mm");
    var endTime = moment(trainFirstRun, "HH:mm");

    console.log("endtime is: " + endTime);
    var timeElapsed = moment.duration(endTime.diff(now));
    var hours = parseInt(timeElapsed.asHours());
    var minutes = parseInt(timeElapsed.asMinutes()) - hours*60;
    var duration = moment.duration(endTime.diff(now));
    alert (hours + ' hour and '+ minutes+' minutes.');

    // calculate the duration

    console.log("timeElapsed: " + timeElapsed);

    console.log("timeElapsed : " + timeElapsed);
    var runsAlready = Math.floor(timeElapsed/trainFrequency);
    minutesAway = timeElapsed % trainFrequency;
    console.log("mintues away is " + minutesAway);
    console.log("runsAlready * trainFrequency is " + (runsAlready * trainFrequency));
    nextArrival = ((runsAlready * trainFrequency) + trainFirstRun);
    console.log("next arrival is " + nextArrival);

    // parseTime (trainFirstRun);
    database.ref().push({
      trainName: trainName,
      trainDestination: trainDestination,
      trainFirstRun: trainFirstRun,
      trainFrequency: trainFrequency,
      nextArrival: nextArrival,
      minutesAway: minutesAway
    });//end of db push
    }
  });//end of submit button onclick

//this takes a snapshot of database variables on value change and stores them in the global variables for each
database.ref().on("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    trainName = (childSnapshot.val().trainName);
    trainDestination = (childSnapshot.val().trainDestination);
    trainFirstRun = (childSnapshot.val().trainFirstRun);
    trainFrequency = (childSnapshot.val().trainFrequency);
    nextArrival = (childSnapshot.val().nextArrival);
    mintuesAway = (childSnapshot.val().minutesAway);
  });//end of childsnapshiot
});//end of snapshot

database.ref().on("child_added", function (childsnap) {
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


});//end of childadded snapshot


//empties the database and uses the default button refresh to clear page
$("#destroyButton").on("click", function () {
  event.preventDefault();
  database.ref().remove();
  $("#trainLeft").attr("id", "boom");
  $("#boom").attr("src", "assets/images/boom.png");
  trainFireball();

});//end of destroy button onclick

function trainFireball() {
  setTimeout(function () {
          $("#boom").attr("id", "trainLeft");
          $("#trainLeft").attr("src", "../images/trainLeft.png");
          console.log("trainFireball ran");
      }, 500);
  setTimeout(function () {
    location.reload();
  }, 500);

  }

  function getTimeInterval(startTime, endTime){
      var start = moment(startTime, "HH:mm");
      var end = moment(endTime, "HH:mm");
      var minutes = end.diff(start, 'minutes');
      var interval = moment().hour(0).minute(minutes);
      return interval.format("HH:mm");
  }


  // function(errorObject) {
  //     console.log("Errors handled: " + errorObject.code);
  //   }); //of of errorObject
