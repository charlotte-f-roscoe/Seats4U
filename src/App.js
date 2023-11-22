import React, { useState } from 'react';

const Seats4U = () => {
  const [arg1, setArg1] = useState('');
  const [arg2, setArg2] = useState('');
  const [result, setResult] = useState('');

  const handleClick = async () => {
    const payload = {
      arg1: arg1,
      arg2: arg2,
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
        <button>CREATE VENUE</button><button>LOG IN</button>
        <h1>Seats4UU</h1>
      </center>
      Arg1: &nbsp;
      <input
        id="arg1"
        value={arg1}
        onChange={(e) => setArg1(e.target.value)}
      />
      &nbsp; Arg2: &nbsp;
      <input
        id="arg2"
        value={arg2}
        onChange={(e) => setArg2(e.target.value)}
      />
      <br />
      Result: &nbsp;
      <input id="result" value={result} readOnly />
      <br />
      <input type="button" value="Add" onClick={handleClick} />
    </div>
  );
};

export default Seats4U;