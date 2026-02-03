/**
 * Reference Implementation for MediSense AI Cloud Functions
 * 
 * To deploy:
 * 1. Initialize Firebase Functions: `firebase init functions`
 * 2. Copy this code to `functions/index.js`
 * 3. Install dependencies: `npm install nodemailer firebase-admin`
 * 4. Deploy: `firebase deploy --only functions`
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// Configure Email Transporter (SendGrid, Mailgun, or Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'notifications@medisense.com', // Placeholder
        pass: 'your-app-password'
    }
});

/**
 * 1. Scheduled Data Retention Cleanup
 * Runs every day at 2:00 AM to delete reports older than user preference.
 */
exports.scheduledReportCleanup = functions.pubsub.schedule('0 2 * * *').onRun(async (context) => {
    const usersSnapshot = await db.collection('users').get();
    const batch = db.batch();
    let deleteCount = 0;

    for (const userDoc of usersSnapshot.docs) {
        const settingsRef = userDoc.ref.collection('settings').doc('preferences');
        const settingsSnap = await settingsRef.get();
        if (!settingsSnap.exists) continue;

        const retentionDays = settingsSnap.data().dataRetention;
        if (!retentionDays || retentionDays === -1) continue; // Keep indefinitely

        // Calculate cutoff
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

        // Query old reports
        const reportsSnapshot = await userDoc.ref.collection('reports')
            .where('createdAt', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
            .get();

        reportsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
            deleteCount++;
        });
    }

    if (deleteCount > 0) {
        await batch.commit();
        console.log(`Cleaned up ${deleteCount} expired reports.`);
    }
});

/**
 * 2. Send Email Notification on New Report
 * Triggers when a new report is created in Firestore.
 */
exports.sendReportNotification = functions.firestore
    .document('users/{userId}/reports/{reportId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        const userId = context.params.userId;

        // Check user preferences
        const userSettings = await db.collection('users').doc(userId).collection('settings').doc('preferences').get();
        if (!userSettings.exists || !userSettings.data().emailNotifications) {
            console.log("Email notifications disabled for user.");
            return;
        }

        // Get user email
        const userRecord = await admin.auth().getUser(userId);
        const email = userRecord.email;

        if (!email) return;

        const mailOptions = {
            from: 'MediSense AI <no-reply@medisense.com>',
            to: email,
            subject: `New Analysis Ready: ${newValue.patientData.name || 'Patient Report'}`,
            html: `
                <h1>Analysis Completed</h1>
                <p>Your clinical reasoning report is ready.</p>
                <p><strong>Summary:</strong> ${newValue.assessment.summary}</p>
                <p><strong>Urgency:</strong> ${newValue.assessment.urgency}</p>
                <br>
                <a href="https://medisense-ai.web.app/dashboard/report/${context.params.reportId}" style="padding: 10px 20px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 5px;">View Full Report</a>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    });

/**
 * 3. Delete User Account Cleanup
 * Triggers when a user account is deleted from Authentication.
 * Ensures all Firestore data and Storage files are removed.
 */
exports.deleteUserCleanup = functions.auth.user().onDelete(async (user) => {
    const userId = user.uid;

    // 1. Delete Reports
    const reportsRef = db.collection('users').doc(userId).collection('reports');
    const reports = await reportsRef.get();
    const batch = db.batch();
    reports.forEach(doc => batch.delete(doc.ref));

    // 2. Delete Settings
    const settingsRef = db.collection('users').doc(userId).collection('settings').doc('preferences');
    batch.delete(settingsRef);

    // 3. Delete User Doc
    batch.delete(db.collection('users').doc(userId));

    await batch.commit();
    console.log(`Cleanup completed for deleted user ${userId}`);

    // Note: Storage cleanup would typically be easier with a dedicated storage trigger or by listing files here.
});
