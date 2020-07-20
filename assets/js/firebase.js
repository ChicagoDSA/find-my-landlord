var firebaseConfig = {
	apiKey: "AIzaSyDpw9sXTjVLIMuUEjEGxGHFbZzldiWaXOQ",
	databaseURL: "https://find-my-landlord.firebaseio.com",
	projectId: "find-my-landlord",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var featuresRef = db.collection("features");
