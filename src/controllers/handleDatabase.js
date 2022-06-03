const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
export const { getDatabase, ServerValue } = require('firebase-admin/database');

const serviceAccount = require('../config/firebaseAdminPK.json');

initializeApp({
  credential: cert(serviceAccount)
});

export const Database = getDatabase(app);