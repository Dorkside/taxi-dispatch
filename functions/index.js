const functions = require("firebase-functions");
const firestore = require("@google-cloud/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const client = new firestore.v1.FirestoreAdminClient();

const app = initializeApp(functions.config().firebase);

const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const server = express();

// Replace BUCKET_NAME
const bucket = "gs://taxi-oka.appspot.com";

exports.scheduledFirestoreExport = functions.pubsub
  .schedule("every 24 hours")
  .onRun(() => {
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

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req, res, next) => {
  functions.logger.log("Check if request is authorized with Firebase ID token");

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    functions.logger.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    functions.logger.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const decodedIdToken = await getAuth().verifyIdToken(idToken);
    functions.logger.log("ID Token correctly decoded", decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error("Error while verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
    return;
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    const result = await getAuth(app).listUsers(1000, undefined);
    const adminExists = result.users.some(userResult => {
      return userResult.customClaims?.admin;
    });
    if (!adminExists) {
      next();
      return;
    }
    if (!req.user) {
      res.status(403).send("Unauthorized");
    }
    const u = await getAuth().getUser(req.user.uid);
    if (!u.customClaims.admin) {
      res.status(403).send("Unauthorized");
    }
    next();
    return;
  } catch (error) {
    functions.logger.error("Error while verifying custom claims:", error);
    res.status(403).send("Unauthorized");
    return;
  }
};

server.use(cors);
server.use(cookieParser);
server.use(validateFirebaseIdToken);

var adminRouter = express.Router();
adminRouter.use(checkAdmin);

adminRouter.post("/users", (req, res) => {
  return getAuth(app)
    .listUsers(1000, undefined)
    .then(result => {
      res.json({ data: result.users.map(userResult => userResult.toJSON()) });
    });
});

adminRouter.post("/add", (req, res) => {
  return getAuth(app)
    .setCustomUserClaims(req.body.data.uid, { admin: true })
    .then(() => {
      res.status(200).send({ data: "ok" });
    });
});

adminRouter.post("/remove", (req, res) => {
  return getAuth(app)
    .setCustomUserClaims(req.body.data.uid, { admin: false })
    .then(() => {
      res.status(200).send({ data: "ok" });
    });
});

server.use("/admin", adminRouter);

exports.app = functions.https.onRequest(server);
