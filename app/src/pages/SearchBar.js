import React, { useState, createContext, useContext } from "react";


const SearchBar = (props) => {

  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');
  const [active, setActive] = useState('');
  const [hasResults, setHasResult] = useState(false); // Initialize hasResults state
  // TO GET USER DO props.user

  const handleActiveSearch = async () => {
    try {
      const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/listAllActiveShows', {
        method: 'GET',
        
      });
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
      const resultData = await response.json();
      
      let printInfo = "";
      console.log(resultData)
      for (const show of resultData.body) {
        if(show.active){ // check if show is active then print out if true
        //  for (const show of showsForVenueManager ) {
          //console.log(show);
          const showTime = getNormalTime(show.startTime);
          //printInfo += show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
          if (props.user === 0) {
            printInfo += show.showName + "\t" + (show.showDate?.substring(0, 10) || 'N/A') + " at " + showTime + "\t" + show.venueName + "\t" + "\n";
          } else if (props.user === 1 || props.user === 2) {
            printInfo += show.showName + "\t" + (show.showDate?.substring(0, 10) || 'N/A') + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
          }
        }
      }
      
      setResult(printInfo);

  }catch (error) {
    console.error('Error fetching data:', error);
  }
  };


  const handleClick = async () => {
    if (search.trim() === '') {
      // if the search bar is empty, list all active shows
      await handleActiveSearch();
      return;
    }
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
      let hasResults = false; 
      for (const show of resultData.shows) {
      //  for (const show of showsForVenueManager ) {
        //console.log(show);
        const showTime = getNormalTime(show.startTime);
        //printInfo += show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
        if (props.user === 0 && show.active) {
          printInfo += show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + show.venueName + "\t"  + "\n";
          hasResults = true;
        } else if (props.user === 1 || props.user === 2) {
          printInfo += show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
          hasResults = true;
        }
      }
      
      
      if (!hasResults && props.user === 0) {
        // display a message for the consumer when there are no results
        setResult(`No results for "${search}"`);
      } else {
        setResult(printInfo);
      }
     // setResult(printInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderStatusOrVenueHeader = () => {
    if (props.user === 0) {
      return <th>Venue</th>;
    } else if (props.user === 1 || props.user === 2) {
      return <th>Status</th>;
    }
    return null; 
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
        <input type="button" value="SEARCH" onClick={handleClick}/>
       
        {result && (
  <div style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px', marginTop: '25px' }}>
    <table style={{ width: '100%', textAlign: 'center' }}>
      {result !== `No results for "${search}"` && (
        <thead>
          <tr>
            <th>Name</th>
            <th>Date/Time</th>
            {renderStatusOrVenueHeader()}
          </tr>
        </thead>
      )}
      <tbody>
        {result === `No results for "${search}"` ? (
          <tr>
            <td colSpan={3}>{result}</td>
          </tr>
        ) : (
          result.split('\n').map((row, index) => (
            <tr key={index}>
              {row.split('\t').map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))
        )}
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
