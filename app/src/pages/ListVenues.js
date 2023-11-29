import React, { useState } from 'react';

export default function ListVenues(){

    //const [venues, setVenues] = useState([]);
    const [error, setError] = useState(null);
    const [result, setResult] = useState('');
    
    const [venues, setVenues] = useState([
      { venueName: 'TD Garden', id: 1 },
      { venueName: 'MetLife', id: 2 },
      { venueName: 'Broadway', id: 3 },
      // this is for testing
    ]);

    const handleClick = async () => {
        const payload = {
          venues: venues,
        };

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
          <div style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px' }} key={venue.venueName}>
            <p style={{ backgroundColor: '#333', color: '#fff', padding: '9px', borderRadius: '3px', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{venue.venueName}</span>
              <input type="button" value="View Venue" onClick={() => handleClick(venue.id)} style={{ marginLeft: '0', padding: '5px' }} />
            </p>
          </div>
        ))}
      </center>
    </div>
    )
}
