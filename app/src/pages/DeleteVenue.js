import React, { useState } from 'react';

export default function DeleteVenue(){
  
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [venueName, setVenueName] = useState('');


    const handleClick = async () => {
        const payload = {
          authentication: password,
        };

        try {
            const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/checkVenueManager', 
            {
              method: 'POST',
              body: JSON.stringify(payload),
            });
      
            const resultData = await response.json();
            setVenueName(resultData.layout[0].venueName);
            setResponse(resultData.statusCode)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        const deleteVenue = async () => {
            const payload = {
                venueManager: password,
                venueName: venueName
            };

              try {
                  const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/deleteVenue', 
                  {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  
                  const resultData = await response.json();
                  alert("Deleted Venue "+ venueName + ". Going to Home.");
                  window.location.href = '#/';
                  
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
            
        }
        
     
        function no_exit(){
            alert("NOT deleting venue "+ venueName + ". Going to Home.");
            window.location.href = '#/';
        }


        function AreYouSure() {
          if(response == 200) {
            return (<div>
            <center>
              <h1>Are you sure you want to delete {venueName}?</h1>
              <button onClick={() => deleteVenue()}>Yes</button>
              <button onClick={() => no_exit()}> No</button>
            </center>
          </div>)
          }
          else if(response==400){
            return (<div>
                <center><h1>You do not have authorization.</h1></center></div>)
            }
         else {
            return <div></div>
            }
        }
    

    return (
      <div>
        <center>
          <br></br>
          <p>This view requires Venue Manager authorization. Please enter your password below.</p>
          <input
            id="password"
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            /><br></br>
        <input type="button" value="AUTHENTICATE" onClick={() => handleClick()} style={{ marginLeft: '0', padding: '5px' }} />
        <AreYouSure />
        </center>
      </div>
    )
}