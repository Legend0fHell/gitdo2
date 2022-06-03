const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../config/firebaseAdminPK.json');

initializeApp({
  credential: cert(serviceAccount)
});

export const Firestore = getFirestore();