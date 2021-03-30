import React, { useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  //useEffect -> Runs a piece of code based on a specific condition
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user has logged in... 
        console.log(authUser);
        setUser(authUser);

          // if (authUser.displayName) {
          //   // dont update username
          // } else {
          //   // if we just created someone... 
          //   return authUser.updateProfile({
          //     displayName: username,
          //   });
          // }
        }

      else{
        //user has logged out... 
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup action
      unsubscribe();
    }
  } , [user, username]);

  useEffect(() => {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time a new post is added this code will fireup
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()

      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault(); //prevents page from refreshing
  
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
       return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false); //to close the modal auto after signUp
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

    return (
    <div className="App">

         <Modal
            open={open}
            onClose={() => setOpen(false)}
            >
            <div style={modalStyle} className={classes.paper}>
                <form className="app__signup">
                    <center>
                        <img
                          className="app__headerImage"
                          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                          alt=""
                        />
                    </center>
                      <Input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button type="submit" onClick={signUp}>Sign Up</Button> {/* Button type submit */}
                    
                </form>
              
            </div>
         </Modal>

         <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
            >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__signup">
                <center>
                  <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                  />
                </center>  
                {/* Username not essential while Sign In */}
                  <Input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" onClick={signIn}>Sign In</Button> {/* Button type submit */}
                
              </form>
              
            </div>
         </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
         {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ): (
        <div className="app__loginContainer">
           <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
           <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
       
      )}
      </div>

     <div className="app__posts">
          <div className="app__postsLeft">
            { 
              posts.map(({id, post}) => (
                <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
              ))
            }
          </div>
          <div className="app__postsRight">
            <InstagramEmbed
              url='https://www.instagram.com/p/B1SwXtWh5dP/?utm_source=ig_web_copy_link'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
      </div>
      
        {/* Header */}
         {/* press (Ctrl + Space) to (import component shortcut) 
        <Post username="zuzu" caption="HEY it works" imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png"/>
        <Post username="sss" caption="HEY it works" imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png"/>
        <Post username="aaa" caption="HEY it works" imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png"/>
        */}  
        
        {user?.displayName ? (
           <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}
     

    </div>
  );
}

export default App;
/* every time we get a post, render those posts as in array of posts*/