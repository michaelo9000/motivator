import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCLEo3wpiSt3ka2L_qkeoCtz0UDP_Er97s",
    authDomain: "motivator-5c74b.firebaseapp.com",
    databaseURL: "https://motivator-5c74b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "motivator-5c74b",
    storageBucket: "motivator-5c74b.appspot.com",
    messagingSenderId: "233151406584",
    appId: "1:233151406584:web:611d3d7bcc49c5b4e7b60d"
};

if (!firebase.apps.length)
    firebase.initializeApp(firebaseConfig);

// var db = firebase.database();
// var dbRef = db.ref();

function constructUserResult(user) {
    return {
        email: user.user.email,
        isSuccess: true
    }
}

function constructErrorResult(error) {
    return {
        error: error,
        isSuccess: false
    }
}

export const createUser = async function (email, password) {
    return new Promise((resolve) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                resolve(constructUserResult(userCredential));
            })
            .catch((error) => {
                resolve(constructErrorResult(error));
            });
    })
        .then(r => r);
}

export const loginUser = function (email, password) {
    return new Promise((resolve) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                resolve(constructUserResult(userCredential));
            })
            .catch((error) => {
                resolve(constructErrorResult(error));
            });
    })
        .then(r => r);
}