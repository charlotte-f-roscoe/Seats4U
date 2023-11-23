import React, { useState } from 'react';
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import CreateVenue from "./pages/CreateVenue.js";

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
  }

  return (
    <>
    <div>
        <center>
            <h1></h1>
            <a href= "/Home"><button>HOME</button></a>
            <a href= "/CreateVenue"><button>CREATE VENUE</button></a>
            <a href= "/Login"><button>LOG IN</button></a>
        </center>
        {component}
    </div>
    </>
  );
};

export default Seats4U;