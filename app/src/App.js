import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route, Link, HashRouter, RouterProvider } from 'react-router-dom';
import SearchBar from "./pages/SearchBar.js";
import Login from "./pages/Login.js";
import CreateVenue from "./pages/CreateVenue.js";
import ErrorNotFound from "./pages/ErrorNotFound.js";
import CreateShow from './pages/CreateShow.js';
import ListVenues from './pages/ListVenues.js';
import DeleteVenue from './pages/DeleteVenue.js';



export default function Seats4U () {
  const [user, setUser] = useState(0);
  const [password, setPassword] = useState('')
  console.log(user)
  console.log(password)


  useEffect(() => {
      let userStatus = JSON.parse(window.localStorage.getItem('user'))
      if(userStatus==1){
        let managerName = JSON.parse(window.localStorage.getItem('vmName'))
        setVMStatus()
        setPassword(managerName)
      }else if(userStatus==2){
        setAdminStatus()
      }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('user', user);
    window.localStorage.setItem('vmName', password);
  }, [user, password]);

  const setAdminStatus = () =>{
    return setUser(2)
  }

  const setVMStatus = () =>{
    return setUser(1)
  }

  const setConsumerStatus = () =>{
    return setUser(0)
  }

  const changePassword = (name) =>{
    return setPassword(name)
  }

  const logOut = () =>{
    window.location.href = '#/';
    setPassword('')
    return setConsumerStatus()
  }
  
  if(user==0){
        return (
          <div>
          <HashRouter basename='/'>
            <div>
              <center>
              <br></br>
              <Link to="/"><button>HOME</button></Link>
              <Link to="/CreateVenue"><button>CREATE VENUE</button></Link>
              <Link to="/Login"><button>LOG IN</button></Link>
              </center>
            </div>
    
            <Routes>
            <Route path="/" element={ <SearchBar user={user}/> } />
            <Route path="/CreateVenue" element={<CreateVenue/>} />
            <Route path="/Login" element = {<Login setVMStatus={setVMStatus} changePassword={changePassword} setAdminStatus = {setAdminStatus} ></Login>} />
            </Routes>
          </HashRouter>
        </div>
            
          );
    }
    else if(user==1){
      return(
      <div>
      <HashRouter basename='/'>
        <div>
          <center>
          <br></br>
          <Link to="/"><button>HOME</button></Link>
          <Link to="/CreateVenue"><button>CREATE VENUE</button></Link>
          <Link to="/CreateShow"><button>CREATE SHOW</button></Link>
          <button onClick={logOut}>LOG OUT</button>
          </center>
        </div>

        <Routes>
        <Route path="/" element={ <SearchBar user={user}/> } />
        <Route path="/CreateVenue" element={<CreateVenue/>} />
        <Route path="/CreateShow" element={<CreateShow user={user}/>} />
        </Routes>
      </HashRouter>
      
    </div>);
    }else{
      return(
        <div>
        <HashRouter basename='/'>
          <div>
            <center>
            <br></br>
            <Link to="/"><button>HOME</button></Link>
            <Link to="/CreateVenue"><button>CREATE VENUE</button></Link>
            <Link to="/CreateShow"><button>CREATE SHOW</button></Link>
            <Link to="/ListVenues"><button>LIST VENUES</button></Link>
            <button onClick={logOut}>LOG OUT</button>
            </center>
          </div>
  
          <Routes>
          <Route path="/" element={ <SearchBar user={user}/> } />
          <Route path="/CreateVenue" element={<CreateVenue/>} />
          <Route path="/ListVenues" element={<ListVenues user = {user} password={password}/>} />
          <Route path="/CreateShow" element={<CreateShow user={user}/>} />
          </Routes>
        </HashRouter>
       
      </div>);
    }
  }
