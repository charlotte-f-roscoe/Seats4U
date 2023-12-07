import React, { useState } from 'react';

export default function DeleteVenue(props){
  
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [venueName, setVenueName] = useState('');


    const handleClick = async () => {
        const payload = {
          authentication: props.password,
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
                authentication: props.password,
                venueName: props.venueName
            };

              try {
                  const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/deleteVenue', 
                  {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  
                  const resultData = await response.json();
                  console.log(resultData)
                  if(resultData.statusCode==200){
                    alert("Deleted Venue "+ venueName + ". Going to Home.");
                    window.location.href='#/'
                    props.logOut()
                    window.location.href='#/'
                  }else{
                    alert("Unable to deleted Venue "+ venueName +"\t" + resultData.error);
                  }
                  

                  
                  
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
            
        }
        
     
        function no_exit(){
            alert("NOT deleting venue "+ venueName + ". Going to Home.");
            window.location.href = '#/';
        }


        function AreYouSure() {
        
            return (<div>
            <center>
              <h1>Are you sure you want to delete {venueName}?</h1>
              <button onClick={() => deleteVenue()}>Yes</button>
              <button onClick={() => no_exit()}> No</button>
            </center>
          </div>)
         
        }
    

    return (
      <div>
        <center>
        
        <AreYouSure />
        </center>
      </div>
    )
}