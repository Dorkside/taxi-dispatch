const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// check-usernames.js
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.createCourse = functions.https.onRequest((req, res) => {
  const course = req.body;

  db.collection("courses")
    .where("ref", "==", course.ref)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(403).end();
      } else {
        db.collection("courses").add(course);
      }
    })
    .catch(error => res.status(500).send(error));
});
