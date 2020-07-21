// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
	authDomain: "find-my-landlord.firebaseapp.com",
	projectId: "find-my-landlord"
});

var db = firebase.firestore();
var featuresRef = db.collection("features");
