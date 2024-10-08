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
})

exports.updateTutorTransaction = functions.https.onCall(async (data, context) => {
    const classInfo = data.info.classInfo;
    const tutor = new Map();
    classInfo.forEach((e) => {
        let total = (e.fee * data.info.duration * e.tutorPercentage) / 100;
        if (tutor.get(e.tutorId) !== undefined) {
            tutor.set(e.tutorId, tutor.get(e.tutorId) + total);
        } else {
            tutor.set(e.tutorId, total);
        }
    })
    const batch = admin.firestore().batch();
    tutor.forEach(async (value, key) => {
        await admin.firestore().collection("User").doc(data.userData.uid).collection("Tutor").doc(key).collection("Transaction").add({
            createdDate: data.info.createdDate, amount: value, type: "studentPayment", id: data.info.id
        })
    })
    tutor.forEach(async (value, key) => {
        const ref = admin.firestore().collection("User").doc(data.userData.uid).collection("Tutor").doc(key);
        batch.update(ref, { amount: admin.firestore.FieldValue.increment(value) });
    })
    return batch.commit();
})

exports.setAdmin = functions.https.onCall(async (data, context) => {
    return admin.auth().setCustomUserClaims(data.uid, { admin: true }).then(() => { return { value: "success" } }).catch(() => { return { value: "failed" } })
})

exports.addAdmin = functions.https.onCall(async (data, context) => {
    const userData = data.userData;
    const email = data.email;
    try {
        const result = await admin.auth().getUserByEmail(email);
        if (result !== undefined && result?.customClaims.admin) {
            await admin.firestore().collection("Admin").doc(result.uid).collection("Organization").doc(userData.uid).set({
                enrolledDate: new Date().getTime()
            })
            await admin.firestore().collection("User").doc(userData.uid).collection("Admin").doc(result.uid).set({
                enrolledDate: new Date().getTime(),
                name: result.displayName,
                img: result.photoURL
            })
            return { status: "Success" };
        }
    } catch (error) {
        return { status: "Failed" };
    }
})