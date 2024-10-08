// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getDatabase} from 'firebase/database';
import {getMessaging, getToken, onMessage} from 'firebase/messaging';
import {sendInfoToSlack} from './slack';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export const firebaseMessagingConfig = async (): Promise<string | null> => {
    Notification.requestPermission()
        .then(async (permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                return getToken(messaging, {
                    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                }).then((token) => {
                    console.log(token);
                    return token;
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    return null;
};

if (messaging) {
    onMessage(messaging, (payload) => {
        console.log(payload.notification?.title);
        console.log(payload.notification?.body);
    });
}
const analytics = getAnalytics(app);

export const db = getDatabase(app);
