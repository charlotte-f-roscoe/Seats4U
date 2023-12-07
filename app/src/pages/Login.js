import React, { useState } from 'react';

export default function Login(props){


    const [password, setPassword] = useState('');
    let authorized = false;

    const handleClick = async () => {
        try{
            const payload = {
              authentication: password,
            };
       
            const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/logIn', {
                method: 'POST',
                body: JSON.stringify(payload),
              });
            const resultData = await response.json();
            console.log(resultData)
            if(resultData.status=="user is a venue manager"){
                props.setVMStatus()
                props.changePassword(password)
                props.setVMName(resultData.venueName)
                window.location.href = '#/';
            }else if(resultData.status=="user is an administrator"){
                props.setAdminStatus()
                props.changePassword(password)
                window.location.href = '#/';
            }else{
                alert("Invalid Password");
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
