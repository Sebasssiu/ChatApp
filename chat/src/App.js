import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
var firebaseConfig = {
  apiKey: "AIzaSyDHpMqnp1yhOfxv-Sj_wgqQbXVlQzaP5K4",
  authDomain: "warzone-73c91.firebaseapp.com",
  projectId: "warzone-73c91",
  storageBucket: "warzone-73c91.appspot.com",
  messagingSenderId: "106808654694",
  appId: "1:106808654694:web:5f864ef2bdae1d2e6ca6a7",
  measurementId: "G-1DXFKFEJJ6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
      <div className="App">
          <header>
            <h1>Warzone</h1>
            <SignOut />
          </header>

          <section>
            {user ? <ChatRoom /> : <SignIn />}
          </section>

      </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider)
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Entra con google</button>
      <h1 style={{fontSize:15, textAlign: 'center'}}>Respeta a tus compadres del warzone.</h1>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Di algo bonito" />

      <Button type="submit" disabled={!formValue} style={{background: "#dfbe99"}}>
        <SendIcon />
      </Button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;