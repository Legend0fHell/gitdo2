const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
export const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
export const { getDatabase, ServerValue } = require('firebase-admin/database');

const serviceAccount = require('../config/firebaseAdminPK.json');
// Initialize Firebase apps.
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://gitdo2-default-rtdb.firebaseio.com"
});

export const Firestore = getFirestore();
export const Database = getDatabase();

// Set a permanent listener:
Database.ref().on('value',function() {});
console.log("Loaded permanent listener.");