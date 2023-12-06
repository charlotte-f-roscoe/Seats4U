import React, { createContext, useState } from 'react';
import { Routes, Route, Link, HashRouter, RouterProvider } from 'react-router-dom';
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import CreateVenue from "./pages/CreateVenue.js";
import ErrorNotFound from "./pages/ErrorNotFound.js";
import CreateShow from './pages/CreateShow.js';
import ListVenues from './pages/ListVenues.js';
import DeleteVenue from './pages/DeleteVenue.js';
import GenerateReport from './pages/GenerateReport.js';

const Seats4U = () => {
  const [user, setUser] = useState('consumer');

  if(user=="consumer"){
        return (
          <div>
          <HashRouter basename='/'>
            <div>
              <center>
              <br></br>
              <Link to="/"><button>HOME</button></Link>  
              <Link to="/CreateVenue"><button>CREATE VENUE</button></Link>
              <Link to="/Login"><button>LOG IN</button></Link>
              <Link to="/ListVenues"><button>LIST VENUES</button></Link>
              </center>
            </div>
    
            <Routes>
            <Route path="/" element={ <Home user={user}/> } />
            <Route path="/CreateVenue" element={<CreateVenue/>} />
            <Route path="/Login" element = {<Login setUser={setUser}></Login>} />
            <Route path="/ListVenues" element = {<ListVenues setUser={setUser}></ListVenues>} />
            </Routes>
          </HashRouter>
        </div>
            
          );
    }
    else if(user=="venueManager"){
      return(
      <div>
      <HashRouter basename='/'>
        <div>
          <center>
          <br></br>
          <Link to="/"><button>HOME</button></Link>
          <Link to="/CreateVenue"><button>CREATE VENUE</button></Link>
          <Link to="/CreateShow"><button>CREATE SHOW</button></Link>
          <Link to="/GenerateReport"><button>GENERATE REPORT</button></Link>
          </center>
        </div>

        <Routes>
        <Route path="/" element={ <Home user={user}/> } />
        <Route path="/CreateVenue" element={<CreateVenue/>} />
        <Route path="/CreateShow" element={<CreateShow user={user}/>} />
        <Route path="/GenerateReport" element={<GenerateReport user={user}/>} />
        </Routes>
      </HashRouter>
    </div>);
    }else if (user== "admin"){
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
            </center>
          </div>
  
          <Routes>
          <Route path="/" element={ <Home user={user}/> } />
          <Route path="/CreateVenue" element={<CreateVenue/>} />
          <Route path="/ListVenues" element={<ListVenues />} />
          <Route path="/CreateVenue" element={<CreateVenue/>} />
          </Routes>
        </HashRouter>
      </div>);
    }
      
    
  };

export default Seats4U;  