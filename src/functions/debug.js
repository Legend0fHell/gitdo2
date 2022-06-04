import { postMessenger, postGoogle, cache } from '../controllers/chatbotController';
import { Firestore, FieldValue, Database, ServerValue } from "../controllers/handleFirestore";

// Debugging/Testing here (running locally instead of real testing on Heroku's servers.)
// Need NodeJS initialized.
// Run Debug by accessing localhost:8080.

export let Debug = () => {
    console.log("debugging ok");
};