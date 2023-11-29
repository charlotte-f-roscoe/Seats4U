import React, { useState } from 'react';
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import CreateVenue from "./pages/CreateVenue.js";
import ErrorNotFound from "./pages/ErrorNotFound.js";
import CreateShow from './pages/CreateShow.js';
import ListVenues from './pages/ListVenues.js';
import DeleteVenue from './pages/DeleteVenue.js';


const Seats4U = () => {

    const [component, setComponent] = useState(<Home />);

    const handleClick = async (event, number) => {

        switch (number){

            case 0:
                setComponent(<Home />)
                break
            case 1:
                setComponent(<Home />)
                break
            case 2:
                setComponent(<Login />)
                break
            case 3:
                setComponent(<CreateVenue />)
                break
            case 4:
                setComponent(<CreateShow />)
                break
            case 5:    
                setComponent(<ListVenues />)
                break
            case 6:
                setComponent(<DeleteVenue />)
                break
            default:
                setComponent(<Home />)
        }

  }

  return (
    <>
    <div>
        <center>
            <h1></h1>
            <input type="button" value="HOME" onClick={(e) => handleClick(e, 0)} />
            <input type="button" value="CREATE SHOW" onClick={(e) => handleClick(e, 4)} />
            <input type="button" value="CREATE VENUE" onClick={(e) => handleClick(e, 3)} />
            <input type="button" value="LIST VENUES" onClick={(e) => handleClick(e, 5)} />
            <input type="button" value="DELETE VENUE" onClick={(e) => handleClick(e, 6)} />

        </center>
        {component}
    </div>
    </>
  );
};

export default Seats4U;