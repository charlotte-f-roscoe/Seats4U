import React, { useState, createContext, useContext } from "react";


const SearchBar = (props) => {

  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');

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

  const deleteShow = async (showID) => {
    const payload = {
      showID: showID,
      authentication: props.password
    };

    try {
      const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/deleteShow', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log(payload)

      const resultData = await response.json();

      if(resultData.statusCode==200){
        alert("Show has been deleted. \t" + resultData.body)
      }
      else{
        alert("Unable to delete show. \t" + resultData.error)
      }
      console.log(resultData)
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  

  const handleClick = async () => {
    const payload = {
      search: search,
    };

    try {
      const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/search', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const resultData = await response.json();
      console.log(resultData);
      if(props.user==0){
        let printInfo = "";
        for (const show of resultData.shows) {
          console.log(show);
          const showTime = getNormalTime(show.startTime);
          printInfo += show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
        }
        setResult(printInfo);
      }else if(props.user==1){
        let printInfo = [];
        for (const show of resultData.shows) {
          console.log(show);
          const showTime = getNormalTime(show.startTime);
          let print_message = show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive');
          printInfo.push(
            <div key={show} style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px' }}>
            <p style={{ backgroundColor: '#282A35', color: '#fff', padding: '9px', borderRadius: '3px', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{print_message}</span>
              <input type="button" value="Delete Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>deleteShow(show.showID)} disabled={show.active} />
            </p>
          </div>)
          setResult(printInfo);
        }
        }else{
          let printInfo = [];
          for (const show of resultData.shows) {
            console.log(show);
            const showTime = getNormalTime(show.startTime);
            let print_message = show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive');
            printInfo.push(
              <div key={show} style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px' }}>
              <p style={{ backgroundColor: '#282A35', color: '#fff', padding: '9px', borderRadius: '3px', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{print_message}</span>
                <input type="button" value="Delete Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>deleteShow(show.showID)} />
              </p>
            </div>)
            setResult(printInfo);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function notauth(){  
    return (<div>
      <center><h1>You do not have authorization.</h1></center></div>);
    }


  if(props.user==0){
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
  }else if(props.user == 1){
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
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
            {result}
          </div>
          
        )}
          <br />
        </center>
      </div>
    );
  }
  else if (props.user ==2){
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
                </tr>
              </thead>
              <tbody>
                {result}
              </tbody>
            </table>
          </div>
        )}
          <br />
        </center>
      </div>
    );
  }else{
    notauth()
  }

  
};
export default SearchBar;
