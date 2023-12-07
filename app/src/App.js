import React, { useState } from 'react';
import { Routes, Route, Link, HashRouter } from 'react-router-dom';
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import CreateVenue from "./pages/CreateVenue.js";
import ErrorNotFound from "./pages/ErrorNotFound.js";
import CreateShow from './pages/CreateShow.js';
import ListVenues from './pages/ListVenues.js';
import DeleteVenue from './pages/DeleteVenue.js';
import Success from './pages/Success.js';


const Seats4U = () => {
    return (
      <>
        <HashRouter basename='/'>
          <div>
            <center>
            <br></br>
            <Link to="/"><button>HOME</button></Link>
            <Link to="/CreateShow"><button>CREATE SHOW</button></Link>
            <Link to="/CreateVenue"><button>CREATE VENUE</button></Link>
            <Link to="/DeleteVenue"><button>DELETE VENUES</button></Link>
            <Link to="/ListVenues"><button>LIST VENUES</button></Link>
            </center>
          </div>
  
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CreateShow" element={<CreateShow />} />
          <Route path="/CreateVenue" element={<CreateVenue />} />
          <Route path="/DeleteVenue" element={<DeleteVenue />} />
          <Route path="/ListVenues" element={<ListVenues />} />
          <Route path="/ErrorNotFound" element={<ErrorNotFound />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Success" element={<Success />} />

          </Routes>
        </HashRouter>
      </>
    );
  };
export default Seats4U;