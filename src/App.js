import './App.css';
import {BrowserRouter, Redirect, Route, Switch, useHistory} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UpdatePost from './components/screens/UpdatePost';
import UserProfile from './components/screens/UserProfile';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const PrivateRouting = ({...rest}) => {
  const authUser = useSelector(state => state.auth);
  return authUser && authUser.user && authUser.user.token !== null ? <Route {...rest}/> : <Redirect to="/signin"/>
}

const Routing = () => {
  const history = useHistory();
  useEffect(() => {
    if(JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("user")).token){
      history.push("/");
    }
  }, [])
  return (
    <Switch>
        <PrivateRouting exact path="/" component={Home}/>
        <Route exact path="/signin" component={Signin}/>
        <Route exact path="/signup" component={Signup}/>
        <PrivateRouting exact path="/createPost" component={CreatePost}/>
        <PrivateRouting exact path="/updatePost/:postId" component={UpdatePost}/>
        <PrivateRouting exact path="/userProfile/:userId" component={UserProfile}/>
    </Switch>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
  );
}

export default App;