const functions = require("firebase-functions");
const firestore = require("@google-cloud/firestore");
const admin = require("firebase-admin");
const client = new firestore.v1.FirestoreAdminClient();

// Replace BUCKET_NAME
const bucket = "gs://taxi-oka.appspot.com";

exports.scheduledFirestoreExport = functions.pubsub
  .schedule("every 24 hours")
  .onRun(context => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, "(default)");

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: []
      })
      .then(responses => {
        const response = responses[0];
        console.log(`Operation Name: ${response["name"]}`);
        return true;
      })
      .catch(err => {
        console.error(err);
        throw new Error("Export operation failed");
      });
  });

exports.cleanCourses = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  db.collection("courses")
    .where("chauffeur_id", "==", "")
    .get()
    .then(data => {
      console.log(data);
    });
});
