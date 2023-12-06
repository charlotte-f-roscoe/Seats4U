import React, { useState } from 'react';

export default function ListVenues(){

    //const [venues, setVenues] = useState([]);
    const [error, setError] = useState(null);
    const [result, setResult] = useState('');
    const [authentification, setAuthentification] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState('');



    const handleClick = async () => {
        const payload = {
          authentication: password,
        };

        try {
            const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/listVenues', 
            {
              method: 'POST',
              body: JSON.stringify(payload),
            });
            
            const resultData = await response.json();
            setAuth(resultData.statusCode)

            let printInfo = [];
            for (let i = 0; i<resultData.shows.length; i++){
              //printInfo.push(resultData.shows[i].venueName)
              printInfo.push(
              <div key={i} style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px' }}>
              <p style={{ backgroundColor: '#282A35', color: '#fff', padding: '9px', borderRadius: '3px', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{resultData.shows[i].venueName}</span>
                <input type="button" value="View Venue" onClick={() => handleClick(resultData.shows[i].id)} style={{ marginLeft: '0', padding: '5px' }} />
              </p>
            </div>)
            }
            setResult(printInfo);
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        function ListVenues() {
          if(auth == 200) {
            return (<div>
            <center>
              <h1>Venues</h1>
              {result}
            </center>
          </div>)
          }
          else if (!auth){
            return(<div></div>)
          } else {
            return (<div>
              <center><h1>You do not have authorization.</h1></center></div>)
          }
        }
    

    return (
      <div>
        <center>
          <br></br>
          <p>This view requires Administrator authorization. Please enter your password below.</p>
          <input
            id="password"
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            /><br></br>
        <input type="button" value="AUTHENTICATE" onClick={() => handleClick()} style={{ marginLeft: '0', padding: '5px' }} />
        <ListVenues />
        </center>
      </div>

      
    )
}