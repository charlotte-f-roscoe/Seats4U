import React, { useState } from 'react';
function convertMilitaryTimeToReadable(militaryTime) {
  // Parse the military time string
  const [hours, minutes] = militaryTime.split(':');
  
  // Convert hours to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Handle midnight (00:00) as 12 AM

  // Create the readable time string
  const readableTime = `${hours12}:${minutes} ${ampm}`;

  return readableTime;
}

const Home = () => {

  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');

  const handleClick = async () => {
    const payload = {
      search: search,
    };

    try {
      const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Stage1/search', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const resultData = await response.json();
      console.log(resultData);
      const showInfo = resultData.shows[0];
      const printInfo = showInfo.showName + "\t" + showInfo.showDate.substring(0,10) + "\t" + convertMilitaryTimeToReadable(showInfo.startTime);
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
        <p>{result} </p>
        <br />
      </center>
      
    </div>
  );
};
export default Home;