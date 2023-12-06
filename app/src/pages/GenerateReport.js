import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GenerateReport(props){

    const [error, setError] = useState(null);
    const [result, setResult] = useState('');
    const [authentication, setAuthentication] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState('');
    const [venueName, setVenueName] = useState('');

    const handleClick = async () => {
       
        const payload = {
          venueName: venueName,
          authentication: parseInt(password),
        };

        console.log(payload)
     
        try {
            
            const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/generateShowReport',  // fetch link to generate show report
            {
              method: 'POST',
              body: JSON.stringify(payload),
            });
      
            const resultData = await response.json();
            console.log(resultData);
            setAuthentication(resultData.statusCode)
            
           
            let printInfo = [];
            for (let i = 0; i<resultData.body.length; i++){
              //printInfo.push(resultData.shows[i].venueName)
              const show = resultData.body[i];
              printInfo.push(
                <tr key={i}>
                    <td style={tableCellStyle}>{show.venueName}</td>
                    <td style={tableCellStyle}>{show.showName}</td>
                    <td style={tableCellStyle}>{show.dateTime}</td>
                    <td style={tableCellStyle}>{show.active}</td>
                    <td style={tableCellStyle}>{show.seatsSold}</td>
                    <td style={tableCellStyle}>{show.seatsLeft}</td>
                    <td style={tableCellStyle}>{show.totalProceeds}</td>
                </tr>
                
              );
            }
            setResult(printInfo);
        
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        function GenerateReport() {

            if(authentication == 200) {
              return (
                <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '25px' }}>
                    <h1>Show Report</h1>
                  <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#282A35', color: 'white' }}>
                        <th style={tableHeaderStyle}>Venue Name</th>
                        <th style={tableHeaderStyle}>Show Name</th>
                        <th style={tableHeaderStyle}>Date/Time</th>
                        <th style={tableHeaderStyle}>Active Status</th>
                        <th style={tableHeaderStyle}>Seats Sold</th>
                        <th style={tableHeaderStyle}>Seats Remaining</th>
                        <th style={tableHeaderStyle}>Total Proceeds</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result}
                    </tbody>
                  </table>
                </div>
              );
            } else if (!authentication) {
              return (<div></div>);
            } else if (!venueName){
              return (
                <div>
                  <center><h1>You do not have authorization.</h1></center>
                </div>
              );
            }
          }
        
          const tableHeaderStyle = {
            padding: '12px',
            border: '1px solid white',
          };
          const tableCellStyle = {
            padding: '12px',
            border: '1px solid white',
            whiteSpace: 'nowrap', // prevent line breaks
          };
        
          return (
            <div>
                <center>
                    <br></br>
                    <p>This view requires Venue Manager authorization. Please enter your Venue Name and password below.</p>
                    <input
                        id="venueName"
                        placeholder="Enter Venue"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        />
                    <br></br>
                    <input
                        id="password"
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        /><br></br>
                    <input type="button" value="AUTHENTICATE" onClick={() => handleClick()} style={{ marginLeft: '0', padding: '5px' }} />
                    <GenerateReport />
                </center>
          </div>
          );
        }