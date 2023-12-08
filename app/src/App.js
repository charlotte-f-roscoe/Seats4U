import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, HashRouter } from 'react-router-dom';
import SearchBar from "./pages/SearchBar.js";
import Login from "./pages/Login.js";
import CreateVenue from "./pages/CreateVenue.js";
import CreateShow from './pages/CreateShow.js';
import ListVenues from './pages/ListVenues.js';
import GenerateReport from './pages/GenerateReport.js';
import DeleteVenue from './pages/DeleteVenue.js';


export default function Seats4U () {
  const [user, setUser] = useState(0);
  const [password, setPassword] = useState('')
  const [venueName, setVenueName] = useState('')
  console.log(user)
  console.log(password)
  console.log(venueName)

  useEffect(() => {
      let userStatus = JSON.parse(window.localStorage.getItem('user'))
      if(userStatus==1){
        let managerPassword = window.localStorage.getItem('password')
        let vmName = window.localStorage.getItem('venueName')
        setVMStatus()
        setPassword(managerPassword)
        setVenueName(vmName)
      }else if(userStatus==2){
        let adminPass = window.localStorage.getItem('password')
        setAdminStatus()
        setPassword(adminPass)
      }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('user', user);
    window.localStorage.setItem('password', password);
    window.localStorage.setItem('venueName', venueName);
  }, [user, password, venueName]);

  const setAdminStatus = () =>{
    return setUser(2)
  }

  const setVMStatus = () =>{
    return setUser(1)
  }

  const setConsumerStatus = () =>{
    return setUser(0)
  }

  const setVMName = (vmName) =>{
    return setVenueName(vmName)
  }

  const changePassword = (name) =>{
    return setPassword(name)
  }



  const logOut = () =>{
    window.location.reload()
    setConsumerStatus()
    setVenueName('')
    setPassword('')
    window.location.reload()
    window.location.href = '#/';
    window.location.reload()
    
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
            <Route path="/Login" element = {<Login setVMStatus={setVMStatus} changePassword={changePassword} setAdminStatus = {setAdminStatus} setVMName={setVMName}></Login>} />
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
          <Link to="/DeleteVenue"><button>DELETE VENUE</button></Link>
          <Link to="/GenerateReport"><button>GENERATE REPORT</button></Link>
          <button onClick={logOut}>LOG OUT</button>
          </center>
        </div>

        <Routes>
        <Route path="/" element={ <SearchBar user={user} password = {password} venueName={venueName}/> } />
        <Route path="/CreateVenue" element={<CreateVenue/>} />
        <Route path="/CreateShow" element={<CreateShow user={user} password={password} venueName={venueName}/>} />
        <Route path='/DeleteVenue' element={<DeleteVenue password={password} logOut = {logOut} venueName={venueName}/>} />
        <Route path="/GenerateReport" element={<GenerateReport user={user} password={password} venueName={venueName}/>} />
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
            <Link to="/GenerateReport"><button>GENERATE REPORT</button></Link>
            <button onClick={logOut}>LOG OUT</button>
            </center>
          </div>
  
          <Routes>
          <Route path="/" element={ <SearchBar user={user} password = {password}/> } />
          <Route path="/CreateVenue" element={<CreateVenue/>} />
          <Route path="/ListVenues" element={<ListVenues user = {user} password={password} logOut = {logOut}/>} />
          <Route path="/CreateShow" element={<CreateShow user={user} password={password}/>} />
          <Route path="/GenerateReport" element={<GenerateReport user={user} password={password} venueName = {venueName}/>} />
          </Routes>
        </HashRouter>
       
      </div>);
    }
  }