// The Firebase Admin SDK to access the Firebase Realtime Database.
'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// [START messageFunctionTrigger]
// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.sendPush = functions.https.onCall((data, context) => {
    // [START_EXCLUDE]
    // [START readMessageData]
    // Message text passed from the client.
    const text = data.text;
    const idTo = data.idTo;
    // [END readMessageData]
    // [START messageHttpsErrors]
    // Checking attribute.
    if (!(typeof text === 'string') || text.length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
			'one arguments "text" containing the message text to add.');
    }
    if (!(typeof idTo === 'string') || idTo.length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
			'one arguments "idTo" containing the message text to add.');
    }
    // Checking that the user is authenticated.
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
			'while authenticated.');
    }
    // [END messageHttpsErrors]


    // Notification details.
    const payload = {
        notification: {
            title: text,
            body:text,
        }
    };

    // Send notifications to all tokens.
    const response = admin.messaging().sendToDevice(idTo, payload).then(() => {
        console.log('New Push send');
        return;
    })
    // [END returnMessageAsync]
    .catch((error) => {
        // Re-throwing the error as an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('unknown', error.message, error);
    });
});