import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import back from "./back.png";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
var firebaseConfig = {
  apiKey: "AIzaSyCQLXZy3Ziswu_6gSh8bGfyEMiOijlTTh8",
  authDomain: "uvgossip-8294a.firebaseapp.com",
  projectId: "uvgossip-8294a",
  storageBucket: "uvgossip-8294a.appspot.com",
  messagingSenderId: "548364933340",
  appId: "1:548364933340:web:85106a5611cf56e4c9bc19",
  measurementId: "G-2FKSKRP4X0"
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
            <h1>Gossip</h1>
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
      <h1 style={{fontSize:15, textAlign: 'center'}}>Por favor no seas vulgar y disfruta. Tus datos permaneceran anónimos, para una experiencia única por favor ser de la UVG.</h1>
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
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
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
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      
      <p>{text}</p>
    </div>
  </>)
}


export default App;