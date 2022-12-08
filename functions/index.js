const admin = require('firebase-admin');
const serviceAccount = require('./cmon-1287c-firebase-adminsdk-mpyoj-1b8eb3c8f9.json');
const dotenv = require('dotenv');

dotenv.config();

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require('./src'),
};
