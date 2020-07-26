// NPM package
const firestoreService = require("firestore-export-import");
// API keys
const firebaseConfig = require("./config.js");
// Firebase service key
const serviceAccount = require("./service-key.json");

// JSON To Firestore
const jsonToFirestore = async () => {
	try {
		console.log("Initialzing Firebase");
		await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
		console.log("Firebase Initialized");

		await firestoreService.restore("./features.json");
		console.log("Upload Success");
	}
	catch (error) {
		console.log(error);
	}
};

jsonToFirestore();
