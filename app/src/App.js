import React, { useState } from 'react';
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import CreateVenue from "./pages/CreateVenue.js";
import ErrorNotFound from "./pages/ErrorNotFound.js";
import CreateShow from './pages/CreateShow.js';
import ListVenues from './pages/ListVenues.js';
import DeleteVenue from './pages/DeleteVenue.js';


const Seats4U = () => {
  let component
  switch (window.location.pathname){
    case "/":
        component = <Home />
        break
    case "/Home":
        component = <Home />
        break
    case "/Login":
        component = <Login />
        break
    case "/CreateVenue":
        component = <CreateVenue />
        break
    case "/CreateShow":
        component = <CreateShow />
        break
    case "/ListVenues":    
        component = <ListVenues />
        break
    case "/DeleteVenue":
        component = <DeleteVenue />
        break
    default:
        component = <ErrorNotFound />

  }

  return (
    <>
    <div>
        <center>
            <h1></h1>
            <a href= "/Home"><button>HOME</button></a>
            <a href= "/CreateShow"><button>CREATE SHOW</button></a>
            <a href= "/CreateVenue"><button>CREATE VENUE</button></a>
            <a href= "/ListVenues"><button>LIST VENUES</button></a>
            <a href= "/Login"><button>LOG IN</button></a>
            <a href= "/DeleteVenue"><button>DELETE VENUE</button></a>
        </center>
        {component}
    </div>
    </>
  );
};

export default Seats4U;