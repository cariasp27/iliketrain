////////// FIREBASE STUFFS //////////
 var config = {
    apiKey: "AIzaSyBMplOqF1BFDQI1J8OONDfJyoQpcjjpJts",
    authDomain: "rock-paper-scicssors.firebaseapp.com",
    databaseURL: "https://rock-paper-scicssors.firebaseio.com",
    projectId: "rock-paper-scicssors",
    storageBucket: "rock-paper-scicssors.appspot.com",
    messagingSenderId: "987792146120"
  };
  
  firebase.initializeApp(config);
//   assign firebase to variable for easy manipulation
  var database = firebase.database();

////////// GLOBAL VARIABLES //////////
        // Name of Train
        var trainname = "";
        // Train Destination
        var destination = "";
        // How often the train comes (minutes)
        var frequency = "";
        // First Train Time
        var fttime = "";
        // First Train Time convereted to (HH:mm a)
        var firstTimeConverted = "";
        // variable to calculate and hold the difference
        // of the first train time and now
        var diffTime = "";
        // uses % to find out the remainder and assign it to variable
        var tRemainder = "";
        // amount of minutes untill next train
        var tMinutesTillTrain = "";
        // Next train arrival (HH:mm a)
        var nextTrain = "";
  
        // I like random variable names, this is the submit button xD
      $("#runToTheHills").on("click", function(event) {
        // prevent page from refreshing when form tries to submit itself
        event.preventDefault();
        // grab all input fields and assign their values to the proper variables
        trainname = $("#trainame").val().trim();
        destination = $("#destination").val().trim();
        frequency = $("#frequency").val().trim();
        fttime = $("#fttime").val().trim();
        // convert the first train time to a useable format and assign it to a variable
        firstTimeConverted = moment(fttime, "HH:mm a'");
        // calculate the difference between now and the first train time
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // take the difference in time in minutes, using the frequency of trains
        // calculate the division remainder
        tRemainder = diffTime % frequency;
        // using the frequency and remainder calculate how many minutes away the 
        // train is
        tMinutesTillTrain = frequency - tRemainder;
        // add the minutes till next train to the time now,
        // to get the next train time 
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log(nextTrain);
        // clear all input fields
        $("#trainame").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#fttime").val("");
        // Change what is saved in firebase
        database.ref().push({
          tname: trainname,
          dest: destination,
          fq: frequency,
          firstrain: moment(firstTimeConverted).format("hh:mm a"),
          nxttrain: moment(nextTrain).format("hh:mm a"),
          minaway: tMinutesTillTrain,
          dateAdded: firebase.database.ServerValue.TIMESTAMP,
  
        });
      });
      // event listener for "on child added" which executes a function to populate rows with the data
      // from the last three database entries and append them to the DOM
      // this also populates the page upon loading
      database.ref().orderByChild("dateAdded").limitToLast(3).on("child_added", function(childSnapshot) {
        let newrow = $("<tr></tr>");
        newrow.append("<td>"+ childSnapshot.val().tname + "</td>");
        newrow.append("<td>"+ childSnapshot.val().dest + "</td>");
        newrow.append("<td>"+ childSnapshot.val().fq + "</td>");
        newrow.append("<td>"+ childSnapshot.val().firstrain + "</td>");
        newrow.append("<td>"+ childSnapshot.val().nxttrain + "</td>");
        newrow.append("<td>"+ childSnapshot.val().minaway + "</td>");
        $("#iliketrains").append(newrow);
        console.log(childSnapshot);
      });