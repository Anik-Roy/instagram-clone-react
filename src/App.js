import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}


function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  
  // useEffect runs a piece code based on a specific condition
  useEffect(()=>{
    auth.onAuthStateChanged((authUser)=>{
      if(authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>{
        return {
          ...doc.data(),
          id: doc.id,
        };
      }));
    });
  }, []);

  const signup = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch(error=>alert(error.message));
    setOpen(false);
  }

  const signin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .then(authUser=>alert("Successfully logged in with user "+ authUser.displayName))
    .catch(error=>alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=>setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="" />
              </center>
              <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}/>
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}/>

              <Button type="submit" onClick={signup}>Signup</Button>  
            </form>
          </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="" />
              </center>
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}/>

              <Button type="submit" onClick={signin}>Sign in</Button>
            </form>
          </div>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram-logo" />
        {
          user ? (
            <Button onClick={()=>auth.signOut()}>Logout: <strong>{user.displayName}</strong></Button>) : 
            (
              <div className="app_logindiv">
                <Button onClick={()=>setOpenSignIn(true)}>Sign in</Button>
                <Button onClick={()=>setOpen(true)}>Signup</Button>
              </div>
            )
        }
      </div>
      <div className="app_posts">
        {
          posts.map(post => (
            <Post
              key={post.id}
              postId={post.id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              timestamp={post.timestamp} />
          ))
        }
      </div>
      {user?.displayName ?
        (<ImageUpload username={user.displayName} user_id={user.uid}/>) :
        (<h3>Login to upload!</h3>)
      }
    </div>
  );
}

export default App;
