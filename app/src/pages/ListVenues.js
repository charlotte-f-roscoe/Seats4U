import React, { useState, useEffect} from 'react';



export default function ListVenues(props){
    const [result, setResult] = useState('');
 

    useEffect(() => {
      const fetchData = async () => {
        const payload = {
          authentication: props.password,
        };
        try {
          const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/listVenues', 
          {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          
        const resultData = await response.json();
        console.log(resultData)

        let printInfo = [];
        for (let i = 0; i<resultData.shows.length; i++){
          printInfo.push(resultData.shows[i].venueName)
          printInfo.push(<br/>)
        }
        setResult(printInfo);
                
        }catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData(); // Initiate the asynchronous function when the component mounts
    }, [])

    
    function ListVenues() {
      return (<div>
            <center>
              <h1>Venues</h1>
              {result}
            </center>
          </div>)
    } 


    function notauth(){  
      return (<div>
        <center><h1>You do not have authorization.</h1></center></div>);
      }

    if(props.user == 2){
      return ListVenues()
    }else{
      return notauth();
    }

}