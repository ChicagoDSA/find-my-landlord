// Initialize Cloud Firestore through Firebase
var firebaseConfig = {
	apiKey: "AIzaSyDfYrR3qErDogK_rqhzn49jlgshrJ6O_ic",
	authDomain: "find-my-landlord.firebaseapp.com",
	databaseURL: "https://find-my-landlord.firebaseio.com",
	projectId: "find-my-landlord",
	storageBucket: "find-my-landlord.appspot.com",
	messagingSenderId: "470878094978",
	appId: "1:470878094978:web:ebc5b2350e17f590af569b",
	measurementId: "G-C7MQBH19E6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().signInAnonymously().catch(function(error) {
	console.log(error.code);
	console.log(error.message);
});

var db = firebase.firestore();
var featuresRef = db.collection("features");
