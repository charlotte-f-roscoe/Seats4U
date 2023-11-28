import React, { useState } from 'react';

export default function ListVenues(){

    const [venues, setVenues] = useState([]);
    const [error, setError] = useState(null);
    const [result, setResult] = useState('');

    const handleClick = async () => {
        const payload = {

        }
        try {
            const response = await fetch('', 
            {
              method: 'POST',
              body: JSON.stringify(payload),
            });
      
            const resultData = await response.json();
            setResult(resultData.body);
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

    

    return (
        <div>
            <center>
           
            <h1>Venues</h1>
            {venues.map((venue) => (
            <div key={venue.venueName}>
                <p>Venue Name: {venue.venueName}</p>
                
                <input type="button" value="View Venue" onClick={handleClick}/>
                <br />
                <br />
            </div>
            ))}
            </center>
        </div>
    )
}
