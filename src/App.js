import React, { useState } from 'react';

const Seats4U = () => {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');

  const handleClick = async () => {
    const payload = {
      search: search,
    };

    try {
      const response = await fetch('https://oae03j8g04.execute-api.us-east-1.amazonaws.com/Initial/calc', {
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
        <h1></h1>
        <button>CREATE VENUE</button><button>LOG IN</button>
        <h1>Seats4U</h1>
        &nbsp; 🔎 &nbsp;
        <input
        id="searchbar"
        placeholder='Search Shows'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <input type="button" value="SEARCH" onClick={handleClick} />
        <p> You searched: {result} </p>
        <br />
      </center>
      
    </div>
  );
};

export default Seats4U;