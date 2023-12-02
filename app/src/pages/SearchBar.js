import React, { useState, createContext, useContext } from "react";


const SearchBar = (props) => {

  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');
  // TO GET USER DO props.user

  const handleClick = async () => {
    const payload = {
      search: search,
    };

    function getNormalTime(showTime){
      let hours = parseInt(showTime/100);
      let min = showTime%100;
      if(min < 10){
        min = "0" + min
      }
  
      if (hours >= 12){
        hours = hours - 12;
        return "" + hours + ":" + min + " PM";
      }
      else{
          return "" + hours + ":" + min + " AM";
      }
    }

    try {
      const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Stage1/search', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const resultData = await response.json();
      console.log(resultData);
      let printInfo = "";
      for (const show of resultData.shows) {
        console.log(show);
        const showTime = getNormalTime(show.startTime);
        printInfo += show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
      }
      
      setResult(printInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <center>
        <h1></h1>
        <h1>Seats4U</h1>
        &nbsp; 🔎 &nbsp;
        <input
        id="searchbar"
        placeholder='Search Shows'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <input type="button" value="SEARCH" onClick={handleClick} />
        
        {result && (
        <div style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px', marginTop: '25px' }}>
          <table style={{ width: '100%', textAlign: 'center' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date/Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {result.split('\n').map((row, index) => (
                <tr key={index}>
                  {row.split('\t').map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        <br />
      </center>
      
    </div>
  );
};
export default SearchBar;