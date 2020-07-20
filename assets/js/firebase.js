var firebaseConfig = {
	apiKey: "AIzaSyDpw9sXTjVLIMuUEjEGxGHFbZzldiWaXOQ",
	authDomain: "find-my-landlord.firebaseapp.com",
	projectId: "find-my-landlord",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var featuresRef = db.collection("features");
