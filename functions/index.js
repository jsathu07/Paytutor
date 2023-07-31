const functions = require('firebase-functions/v1');

const admin = require("firebase-admin");
admin.initializeApp();

exports.sendMessage = functions.https.onCall(async (data, context) => {
    const userData = data.userData;

    const message = `Hi ${data.student.name}, Your payment of Rs. ${data.amount} for ${userData.name}'s tutoring services has been made successfully. Thanks! PayTutor Support Team`;
    const url = `https://send.lk/sms/send.php?token=1336|tf0xhH3mh5K9tBOrdGA30gQcg1QvwlC7HMEpNYm6&to=${data.student.phone}&from=SendTest&message=${message}`;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            await admin.firestore().collection("User").doc(userData.uid).update({ msgCount: admin.firestore.FieldValue.increment(-1) });
            return { result: "success" };
        }
        return { result: "failed" };
    } catch (error) {
        return { result: "failed" };
    }
});
