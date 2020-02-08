const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.createCourse = functions.https.onCall((data, context) => {
  const course = data;

  return db
    .collection("courses")
    .where("ref", "==", course.ref)
    .get()
    .then(doc => {
      if (doc.exists) {
        return false;
      } else {
        db.collection("courses").add(course);
        return true;
      }
    })
    .catch(error => {
      return error;
    });
});
