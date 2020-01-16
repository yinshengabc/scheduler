import React,{ useState, useEffect } from 'react';//makes React available to the JavaScript
import 'rbx/index.css';
import{ Button, Container,Title, Message } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CourseList from './components/CourseList'; 
import {addScheduleTimes} from './components/Course/times';


const firebaseConfig = {
  apiKey: "AIzaSyCKWkALvoeBHmie8i8jnnmhOYL6qXh5hV8",
  authDomain: "quickreact-4dcd0.firebaseapp.com",
  databaseURL: "https://quickreact-4dcd0.firebaseio.com",
  projectId: "quickreact-4dcd0",
  storageBucket: "quickreact-4dcd0.appspot.com",
  messagingSenderId: "277529921249",
  appId: "1:277529921249:web:99ab8fa3d207a5647059a0",
  measurementId: "G-3QCFW4NQ1L"
};
  
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const uiConfig = {
  signInFlow:'popup',
  signInOptions:[
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks:{
    signInSuccessWithAuthResult:() => false
  }
};


const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const App = () =>  {
  const [schedule, setSchedule] = useState({title:'', courses:[]});
  const [user,setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  },[]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return(
    <Container>
      <Banner title={ schedule.title } user={ user } />
      <CourseList courses={ schedule.courses } user={ user } />
    </Container>
  );
};

export default App;//makes the function App available to any script that imports this file
export {db};