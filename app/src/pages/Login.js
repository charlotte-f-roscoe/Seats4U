import React, { useState } from 'react';
export default function Login(){

    const [password, setPassword] = useState('');
    let authorized = false;

    const handleClick = async () => {
        const payload = {
          authentification: password,
        };
        /*
        try {
          const response = await fetch('', {
            method: 'GET',
            body: JSON.stringify(payload),
          });
    
          const result = await response.json();
          if (result === 200){
            authorized == true;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        */
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