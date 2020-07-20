var firebaseConfig = {
	apiKey: "AIzaSyDpw9sXTjVLIMuUEjEGxGHFbZzldiWaXOQ",
	authDomain: "find-my-landlord.firebaseapp.com",
	databaseURL: "https://find-my-landlord.firebaseio.com",
	projectId: "find-my-landlord",
	storageBucket: "find-my-landlord.appspot.com",
	messagingSenderId: "470878094978",
	appId: "1:470878094978:web:81a81696b07854aeaf569b",
	measurementId: "G-P04J2VMEB7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Anonymous login, enabled locked down usage
firebase.auth().signInAnonymously().catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
});

var db = firebase.firestore();
var featuresRef = db.collection("features");
