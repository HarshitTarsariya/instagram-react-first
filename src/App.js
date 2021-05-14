import { useEffect, useState } from 'react';
import './App.css';
import Post from './Components/Post';
import {auth, db} from './Firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles,Input, Button } from '@material-ui/core';
import ImageUpload from './Components/ImageUpload';

function getModalStyle(){
  const top=50
  const left=50

  return {
    top:`${top}%`,
    left:`${left}%`,
    transform:`translate(-${top}%,-${left}%)`
  }
}
const useStyle=makeStyles((theme)=>({
  paper:{
    position: 'absolute',
    width: 400,
    backgroundColor:theme.palette.background.paper,
    border:'2px solid #000',
    boxShadow:theme.shadows[20],
    padding:theme.spacing(2,4,3),
  }
}))
function App() {
  const classes=useStyle()
  const [posts,setPosts]=useState([]);
  const [signUpModal,setSignUpModal]=useState(false)
  const [modalStyle]=useState(getModalStyle)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [username,setUsername]=useState('')
  const [user,setUser]=useState('')
  const [signInModal,setSignInModal]=useState(false)


  useEffect(()=>{
    db.collection('posts').orderBy("timestamp").onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=> {
        return {
          id:doc.id,
          post:doc.data()
        }
      }))
    })
  },[])
  useEffect(()=>{

    const unsubs=auth.onAuthStateChanged((authUser)=>{
      console.log('auth state changed')
        if(authUser){
          console.log(authUser.displayName)
          if(authUser.displayName!=null)
            setUser(authUser.displayName)
        }else{
          setUser(null)
        }

        return ()=>{unsubs()}
    })
  },[])
  const SignUpModalhandleOpen=()=>{
    setSignUpModal(op=>!op)
  }
  const SignInModalhandleOpen=()=>{
    setSignInModal(op=>!op)
  }
  const clearIt=()=>{
    setPassword('')
    setUsername('')
    setEmail('')
  }
  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{

      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch(error=>alert(error.message))
    setSignUpModal(false)
    clearIt()
  }
  const signIn=(event)=>{
    event.preventDefault()
    
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))

    setSignInModal(false)
    clearIt()
  }
  return (
    <div className="app">
      <div className="app__header">
        <img className="app__logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"></img>
        <div className="app__auth">
          {
            user?(
                  <div className="app__user">
                    <h3>{user.toUpperCase()}</h3>
                    <Button type="button"  onClick={()=>auth.signOut()}>
                      LOGOUT
                    </Button>
                  </div>
                )
                :(
                  <div className="app__all_auth">
                    <Button type="button"  onClick={SignInModalhandleOpen}>
                      SignIn
                    </Button>
                    <Button type="button"  onClick={SignUpModalhandleOpen}>
                      SignUp
                    </Button>
                  </div>
                )
          }
          
        </div>
      </div>
      <Modal
          open={signUpModal}
          onClose={SignUpModalhandleOpen}
        >
          <div className={classes.paper}
          style={modalStyle}>
            <center>
              <img className="app__logo"  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
              <form className="app__modal">
                    <Input
                    placeholder="Email" type="text" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <Input
                    placeholder="Username" type="text" 
                    value={username} 
                    onChange={(e)=>setUsername(e.target.value)}
                    />
                    <Input
                    placeholder="Password" type="password" 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Button onClick={signUp}>Sign Up</Button>
              </form>
            </center>
          </div>
        </Modal>
        <Modal
          open={signInModal}
          onClose={SignInModalhandleOpen}
        >
          <div className={classes.paper}
          style={modalStyle}>
            <center>
              <img className="app__logo"  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
              <form className="app__modal">
                    <Input
                    placeholder="Email" type="text" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <Input
                    placeholder="Password" type="password" 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Button onClick={signIn}>Sign In</Button>
              </form>
            </center>
          </div>
        </Modal>
        <div className="app__posts">
          <div className="app__postLeft">
            {
              posts.map(({id,post}) => 
                (<Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageurl={post.imageurl}/>)
              )
            }
          </div>
          <div className="app__postRight">
            <ImageUpload username={user}/>
          </div>
        </div>
    </div>
    
  );
}

export default App;
