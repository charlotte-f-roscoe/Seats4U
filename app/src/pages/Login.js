import React, { useState } from 'react';

export default function Login(props){

    const [password, setPassword] = useState('');
    let authorized = false;

    const handleClick = async () => {
        try{
            const payload = {
              authentication: password,
            };
       
            /// NEEDS TO BE UPDATED FOR ADMIN
            const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/checkVenueManager', {
                method: 'POST',
                body: JSON.stringify(payload),
              });
            const resultData = await response.json();
            if(resultData.statusCode==200){
                props.setUser('venueManager')
                window.location.href = '#/';
            }
            
           
        }catch(error){
            console.error('Error fetching data:', error);
        }
        

        
      };

    return (
        <div>
            <center>
                <h1></h1>
                <h1>Log In</h1>
                <p>Enter Password:</p>
                <input
                id="password"
                placeholder='PASSWORD'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />
                <input type="button" value="LOG IN" onClick={handleClick} />
            </center>
        </div>
    )
}