import React, { useState, useEffect, createContext, useContext } from "react";


export default function SearchBar (props) {

  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');
  const [resultsDisplayed, setResultDisplayed] = useState(0);

  const [showID, setShowID] = useState('');

  const [venueName, setVenueName] = useState('');
  const [showName, setShowName] = useState('');
  const [showDate, setShowDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [selectedSeats, setSelectedSeats] = useState('')
  const [seatsArray, setSeatsArray] = useState('')
  const [seatJSON, setSeatJson] = useState('')

  const [lBlock, setLBlock] = useState('');
  const [cBlock, setCBlock] = useState('');
  const [rBlock, setRBlock] = useState('');

  const purchaseSeats = async () =>{
    if (!selectedSeats || selectedSeats.length === 0) {

        alert('You have no seats selected.')

    } else {

        let payload = seatJSON;

        console.log(payload)

        try {
        const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/purchaseSeats', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    
        const resultData = await response.json();
        console.log(resultData)

        if (resultData.statusCode == '200') {
            alert("Your Seats have been purchased!");
            // redirect to the home page after successful save
            window.location.reload();
        } else {
            alert('Error Purchasing Tickets. Please try again.\n' + resultData.error);
        }
        
        } catch (error) {
        console.error('Error fetching data:', error);
        }


    }

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

  const activateShow = async (showID) => {
    const payload = {
      showID: showID,
      authentication: props.password
  };
   try {
    const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/activateShow', {
      method: 'POST',
      body: JSON.stringify(payload),
   });
   console.log(payload)

   const resultData = await response.json();

      if(resultData.statusCode==200){
        alert("Show has been activated. \t" + resultData.body)
        window.location.reload()
      }
      else{
        alert("Unable to activate show. \t" + resultData.error)
      }
      console.log(resultData)
      
    } catch (error) {
      console.error('Error fetching data:', error);
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
        window.location.reload()
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

      if(props.user==0){
        let printInfo = "";
        for (const show of resultData.shows) {
          if(show.active){ // check if show is active then print out if true
          //  for (const show of showsForVenueManager ) {
            //console.log(show);
            const showTime = getNormalTime(show.startTime);
            printInfo += show.showID + "\t" + show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + show.venueName + "\t" + "View Show" + "\n";
            }
        }
        setResult(printInfo);
      
      }else if(props.user==1){
        let printInfo = [];
        for (const show of resultData.shows) {
          console.log(show);
          const showTime = getNormalTime(show.startTime);
          if(show.venueName==props.venueName){
            let print_message = show.showName + "\t" + (show.showDate?.substring(0, 10) || 'N/A') + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
            printInfo.push(
              <div key={show} style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px' }}>
              <p style={{ backgroundColor: '#282A35', color: '#fff', padding: '9px', borderRadius: '3px', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{print_message}</span>
                <input type="button" value="Delete Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>deleteShow(show.showID)}  />
              <input type="button" value="Activate Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>activateShow(show.showID)} disabled={show.active}/>
              </p>
            </div>)
          }
        }
        setResult(printInfo);
        setResultDisplayed(1)
        
        }else{
          let printInfo = [];
          for (const show of resultData.shows) {
            console.log(show);
            const showTime = getNormalTime(show.startTime);
            let print_message = show.showName + "\t" + (show.showDate?.substring(0, 10) || 'N/A') + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
          printInfo.push(
            <div key={show} style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px' }}>
            <p style={{ backgroundColor: '#282A35', color: '#fff', padding: '9px', borderRadius: '3px', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{print_message}</span>
              <input type="button" value="Delete Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>deleteShow(show.showID)}/>
              <input type="button" value="Activate Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>activateShow(show.showID)} disabled={show.active}/>
            </p>
          </div>)
            setResult(printInfo);
        }
        setResult(printInfo);
        setResultDisplayed(1)
        
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  function notauth(){  
    return (<div>
      <center><h1>You do not have authorization.</h1></center></div>);
    }

    const handleView = async () => {
        let alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    
        const payload = {
            'showID': showID,
          };
    
          try {
                const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/getShowInfo', 
                {
                method: 'POST',
                body: JSON.stringify(payload),
                });
        
                const resultData = await response.json();
                
                setVenueName(resultData.body.showInfo.venueName);
                setShowName(resultData.body.showInfo.showName);
                setShowDate(resultData.body.showInfo.showDate.substring(0,10));
                setStartTime(getNormalTime(resultData.body.showInfo.startTime));
                setEndTime(getNormalTime(resultData.body.showInfo.endTime));
    
                const seatsBySection = resultData.body.seats.reduce((result, seat) => {
                    const [row, col] = seat.location;
                    const sectionWithoutSpaces = seat.section.replace(/\s+/g, ''); // Remove spaces
                    result[sectionWithoutSpaces] = result[sectionWithoutSpaces] || [];
                    result[sectionWithoutSpaces][row - 1] = result[sectionWithoutSpaces][row - 1] || [];
                    result[sectionWithoutSpaces][row - 1][col - 1] = seat.available;
                    return result;
                  }, {});
    
                  const ColorChangingButton = ({x, row, col, side}) => {
                    const [buttonColor, setButtonColor] = useState('#e0e0e0');
                  
                    const handleClick = () => {
                      setButtonColor((prevColor) => (prevColor === '#e0e0e0' ? '#6ceb8e' : '#e0e0e0'));
                      const seatId = side + '-' + alphabetArray[row] + (col + 1) + ' ';
                      setSelectedSeats((oldArray) => {
                        const index = oldArray.indexOf(seatId);
                        
                        if (index !== -1) {
                          const newArray = [...oldArray];
                          newArray.splice(index, 1);
                          return newArray;
                        } else {
                          return [...oldArray, seatId];
                        }
                      });
                      let jsonSeatID = {
                        "location": [row, col],
                        "section": side,
                        "available": 0
                      };
                      
                      setSeatsArray((oldArr) => {
                        // Ensure oldArr is initialized as an array
                        oldArr = Array.isArray(oldArr) ? oldArr : [];
                      
                        const seatIdentifier = `${row}-${col}-${side}`;
                        const existingIndex = oldArr.findIndex(seat => {
                          const existingSeatIdentifier = `${seat.location[0]}-${seat.location[1]}-${seat.section}`;
                          return existingSeatIdentifier === seatIdentifier;
                        });
                      
                        if (existingIndex !== -1) {
                          const newArr = [...oldArr];
                          newArr.splice(existingIndex, 1);
                          return newArr;
                        } else {
                          return [...oldArr, jsonSeatID];
                        }
                      });
    
                    };
                  
                    return (
                      <input
                        type="button"
                        value={x}
                        style={{ 
                            backgroundColor: buttonColor,
                            borderRadius: '4px',
                            border: '1px solid #757575', 
                            padding: '6px', }}
                        onClick={handleClick}
                      />
                    );
                  };
                
                let Lblock = [];
                let Cblock = [];
                let Rblock = [];
                for (let i = 0; i < seatsBySection.left.length; i++){
                    Lblock.push(<text>{alphabetArray[i]} </text>)
                    for(let n=0; n< seatsBySection.left[i].length; n++){
                        if(seatsBySection.left[i][n] === 1){
                            Lblock.push(<ColorChangingButton x={n+1} row={i} col={n} side='left'/>);
                        } else {
                            Lblock.push(<input type="button" style={{ 
                                borderRadius: '4px',
                                border: '1px solid #757575', 
                                padding: '6px', }}
                                value={n+1}disabled/>);
                        }
                    }
                    Lblock.push(<br/>);
                } setLBlock(Lblock)
    
                for (let i = 0; i < seatsBySection.center.length; i++){
                    Cblock.push(<text>{alphabetArray[i]} </text>)
                    for(let n=0; n< seatsBySection.center[i].length; n++){
                        if(seatsBySection.center[i][n] === 1){
                            Cblock.push(<ColorChangingButton x={n+1} row={i} col={n} side='center'/>);
                        } else {
                            Cblock.push(<input type="button" style={{ 
                                borderRadius: '4px',
                                border: '1px solid #757575', 
                                padding: '6px', }} value={n+1} disabled/>);
                        }
                    }
                    Cblock.push(<br/>);
                } setCBlock(Cblock)
    
                for (let i = 0; i < seatsBySection.right.length; i++){
                    Rblock.push(<text>{alphabetArray[i]} </text>)
                    for(let n=0; n< seatsBySection.right[i].length; n++){
                        if(seatsBySection.right[i][n] === 1){
                            Rblock.push(<ColorChangingButton x={n+1} row={i} col={n} side='right'/>);
                        } else {
                            Rblock.push(<input type="button" style={{ 
                                borderRadius: '4px',
                                border: '1px solid #757575', 
                                padding: '6px', }} value={n+1} disabled/>);
                        }
                    }
                    Rblock.push(<br/>);
                } setRBlock(Rblock)
      
    
            } catch (error) {
              console.error('Error fetching data:', error);
            }
    
      }
      function Search() {
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
                        <th>ID</th>
                        <th>Name</th>
                        <th>Date/Time</th>
                        <th>Venue Name</th>
                        <th>&#8203;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {result.split('\n').map((row, index) => (
                    <tr key={index}>
                        {row.split('\t').map((cell, cellIndex) => (
                        <td key={cellIndex}>
                            {cell === 'View Show' ? (<button className="editbtn" onClick={() => {
                                setShowID(parseInt((row.match(/\d+/)?.[0])))
                                setShowName(row.split(/\d+/)[1])
                                setShowDate(row.match(/\d{4}-\d{2}-\d{2}/)?.[0])
                                setStartTime(row.match(/\d{1,2}:\d{2}\s[APMapm]{2}/)?.[0])
                                }}>{cell}</button>) : (cell)}
                        </td>
                        ))}
                    </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
                <br />
            </center>
        </div>)
  }


  useEffect(() => {
    if (showID !== '') {
      handleView();
    }
  }, [showID]);

  useEffect(() => {
    setSeatJson({
        showID: showID,
        seats: seatsArray
    } )

  }, [seatsArray]);

  useEffect(() => {

  }, [seatJSON]);


  
  function ViewShow(){

    return (
        <div>
        <center>
          <h1>{showName}</h1>
          <text>
            Venue Name: {venueName}</text> 
          <br></br><br></br>
          <text>
            Date: {showDate}</text>
          <br /><br />
          <text>
            Start Time: {startTime}
          </text>
          <br /><br />
          <text>
            End Time: {endTime}
          </text>
          <br /><br />
          <text>
            Selected Seats: {selectedSeats}
          </text>
          <br /><br />
          <input
            type="button"
            value="Cancel and Exit"
            onClick={() => {window.location.reload()}}
            />
          <input
            type="button"
            value="Purchase Seats"
            onClick={purchaseSeats}
            />
        </center>

        
        <br></br>
        <center>
        </center>
        <center><h1>Stage</h1></center>
        <center>
                <style
                dangerouslySetInnerHTML={{
                __html:
                                '\n* {\n  box-sizing: border-box;\n}\n\n\n.column {\n  float: left;\n  width: 33.33%;\n  padding: 10px;\n /\n}\n\n\n.row:after {\n  content: "";\n  display: table;\n  clear: both;\n}\n'
                            }}
                />
                <div className="row">
                    <div className="column" style={{ backgroundColor: "#fff" }}>
                        <h3>Side Left</h3>
                        <h3>{lBlock}</h3>
                    </div>
                    <div className="column" style={{ backgroundColor: "#fff" }}>
                        <h3>Side Center</h3>
                        <h3>{cBlock}</h3>
                    </div>
                    <div className="column" style={{ backgroundColor: "#fff" }}>
                        <h3>Side Right</h3>
                        <h3>{rBlock}</h3>
                    </div>
                </div>
                </center>
        <br /><br />
      </div>
    )
  }

    
  if(props.user==0 && !resultsDisplayed){
    return (
        <div>
        {!showID ? Search() : ViewShow()} 
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

      
