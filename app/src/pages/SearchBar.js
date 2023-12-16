import React, { useState, useEffect, createContext, useContext } from "react";


export default function SearchBar (props) {

    

  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');
  const [resultsDisplayed, setResultDisplayed] = useState(0);

  const [viewBlocksBoolean, setViewBlocksBoolean] = useState(0);

  const [showID, setShowID] = useState('');

  const [venueName, setVenueName] = useState('');
  const [showName, setShowName] = useState('');
  const [showDate, setShowDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatsArray, setSeatsArray] = useState('')
  const [seatJSON, setSeatJson] = useState('')

  const [lBlock, setLBlock] = useState('');
  const [cBlock, setCBlock] = useState('');
  const [rBlock, setRBlock] = useState('');

  const [defaultPrice, setDefaultPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [alphabetArray, setAlphabetArray] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])
  const [colorArray, setColorArray] = useState(['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'])

  const [listedBlocks, setListedBlocks] = useState([])

  const [sortBy, setSortBy] = useState('price')

  const [seatList, setSeatList] = useState('')

  const [exampleSeats, setExampleSeats] = useState('')
  const [seatsLength, setSeatsLength] = useState(0)


  const [blocks, setBlocks] = useState([])
  const [blockTicketInfo, setBlockTicketInfo] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                showID: showID
              }
        
            try {
                const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/listBlocksForShow', 
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            
                const resultData = await response.json();
                setBlocks(resultData.body)
        
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [showID])

    useEffect(() => {
            const handleView = async () => {

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
                        setDefaultPrice(resultData.body.showInfo.defaultPrice)
        
        
            
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
                            const [borderColor, setBorderColor] = useState('#ffffff');
                            const [price, setPrice] = useState(0);
                            useEffect(() => {
                                if(blocks !== -1){
                                    let color = '';
                                    for (let i = 0; i < blocks.length; i++) {
                                    if (side === blocks[i].section && row >= (blocks[i].rows[0]-1) && row <= (blocks[i].rows[1]-1)) {
                                    color = colorArray[i];
                                    setPrice(blocks[i].price)
                                    break; // Exit the loop once the color is found
                                    }
                                }
                                setButtonColor(color);
        
                                }
                                }, [side, row]);
                          
                            const handleClick = () => {
                           
                              setBorderColor((prevColor) => (prevColor === '#ffffff' ? '#1cff51' : '#ffffff'));
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
                                    border: '2px solid '+ borderColor, 
                                    padding: '6px', }}
                                onClick={handleClick}
                              />
                            );
                          };
                        
                        let Lblock = [];
                        let Cblock = [];
                        let Rblock = [];

                        let lBlockNoClick = [];
                        let CBlockNoClick = [];
                        let RBlockNoClick = [];

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
        handleView();
    }, [blocks])

  const purchaseSeats = async () =>{
    if (!selectedSeats || selectedSeats.length === 0) {

        alert('You have no seats selected.')

    } else {

        let payload = seatJSON;

        try {
        const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/purchaseSeats', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    
        const resultData = await response.json();

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

   const resultData = await response.json();

      if(resultData.statusCode==200){
        alert("Show has been activated. \t" + resultData.body)
        window.location.reload()
      }
      else{
        alert("Unable to activate show. \t" + resultData.error)
      }
      
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

      const resultData = await response.json();

      if(resultData.statusCode==200){
        alert("Show has been deleted. \t" + resultData.body)
        window.location.reload()
      }
      else{
        alert("Unable to delete show. \t" + resultData.error)
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  const handleViewBlocks = async (currentShowID, showName, venueName) => {
    const payloadBlock={
      showID: currentShowID
    }

    const blockResponse = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/listBlocksForShow', {
      method: 'POST',
      body: JSON.stringify(payloadBlock),
    });

    let blockResultData = await blockResponse.json();

    setBlocks(blockResultData.body)
   

    let blockTicketsCurrent = []
  
    for(let i = 0; i < blockResultData.body.length; i++){
      let block = blockResultData.body[i]
      const payloadBlockTicket = {
        showID: currentShowID,
        block: block
      }
      console.log(payloadBlockTicket)

      const blockTicketResponse = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/getTicketsSold', {
        method: 'POST',
        body: JSON.stringify(payloadBlockTicket),
      });

      let blockTicketResultData = await blockTicketResponse.json();

      console.log(blockTicketResultData)

      blockTicketsCurrent.push(blockTicketResultData.body)
    }
    setBlockTicketInfo(blockTicketsCurrent)

    setVenueName(venueName)
    setShowID(currentShowID)
    setShowName(showName)
    setViewBlocksBoolean(1);
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
            
            const showTime = getNormalTime(show.startTime);
             // check if the show is sold 
            const soldOutInfo = show.soldout === 1 ? "SOLD OUT" : ""; // Check if the show is sold out
           printInfo += soldOutInfo + "\t" + show.showID + "\t" + show.showName + "\t" + show.showDate.substring(0,10) + " at " + showTime + "\t" + show.venueName + "\t" +  "View Show"+ "\n";
        
            }
        }
        setResult(printInfo);
      
      }else if(props.user==1){
        let printInfo = [];
        for (const show of resultData.shows) {
          const showTime = getNormalTime(show.startTime);
          if(show.venueName==props.venueName){
            let print_message = show.showName + "\t" + (show.showDate?.substring(0, 10) || 'N/A') + " at " + showTime + "\t" + (show.active ? 'Active' : 'Inactive') + "\n";
            printInfo.push(
              <div key={show} style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '5px' }}>
              <p style={{ backgroundColor: '#282A35', color: '#fff', padding: '9px', borderRadius: '3px', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{print_message}</span>
                <input type="button" value="Delete Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>deleteShow(show.showID)}  />
              <input type="button" value="Activate Show" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>activateShow(show.showID)} disabled={show.active}/>
              <input type="button" value="View Blocks" style={{ marginLeft: '0', padding: '5px' }} onClick={() =>handleViewBlocks(show.showID, show.showName, show.venueName)}  hidden={show.defaultPrice!=-1}/>
              </p>
            </div>)
          }
        }
        setResult(printInfo);
        setResultDisplayed(1)
        
        }else{
          let printInfo = [];
          for (const show of resultData.shows) {
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

  const ShowDefaultPrice = () => {
    if (defaultPrice === -1){
        return ('')
    } else {
        return (<text> Base Price: {defaultPrice}</text>)    
    }
  }

  const ListBlocks = () => {
    if (blocks === -1) {
        return ('')
    } else {
        return (
            <div>
                {listedBlocks.map((block, index) => (
                    <div key={index}>{block}</div>
                ))}
            </div>
        );
    }
}

useEffect(() => {
    let blockList = []
    // Check if blocks is defined before accessing its properties
    if (blocks) {
        for (let i = 0; i < blocks.length; i++) {
            blockList.push(<div><text style={{ color: colorArray[i] }}>■</text><text> = {blocks[i].price}</text></div>)
        }
        setListedBlocks(blockList)
    }
}, [blocks]);

useEffect(() => {
    
    const fetchData = async () => {
        const payload = {
            showID: showID,
            sortBy: sortBy
          }
        console.log(payload)
        try {
            const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/getSeatList', 
            {
                method: 'POST',
                body: JSON.stringify(payload),
            });
        
            const resultData = await response.json();
            
            setExampleSeats(resultData)
            setSeatsLength(resultData.body.length)

    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
    
}, [sortBy, showID]);

useEffect(() => {

    console.log(exampleSeats)
    console.log(seatsLength)
    
    let sortedSeats = [];

    for(let i = 0; i < seatsLength; i++){
        sortedSeats.push(<text>{exampleSeats.body[i].price} - {alphabetArray[(exampleSeats.body[i].location[0])-1]}{exampleSeats.body[i].location[1]} - {exampleSeats.body[i].section}</text>)
        sortedSeats.push(<br></br>)
    }

    setSeatList(sortedSeats)
    
    
}, [exampleSeats,showID]);
  

  function notauth(){  
    return (<div>
      <center><h1>You do not have authorization.</h1></center></div>);
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
                        <th></th>
                        <th></th>
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
                                }}>{cell}</button>) : (props.user === 0 && cellIndex === 1
                                  ? null
                                  : cell === 'SOLD OUT' ? (<text style={{ color: "red" }} >{cell}</text>) : cell)}
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

  function ListBlockInfo(){ 
    let printInfo = []
    let count = 1
    for (const block of blocks){
      let ticketsSold = blockTicketInfo[count-1].ticketsSold
      let ticketsRemaining = blockTicketInfo[count-1].ticketsRemaining
      console.log(block)
      let profits = ticketsSold * block.price
      printInfo.push(
      <div><h3>Block {count} <text style={{ color: colorArray[count-1] }}>■</text></h3>
       <text>Price: ${block.price}</text> <div><text>Section: {block.section}</text></div>
       <div> <text>Rows: {block.rows[0]}-{block.rows[1]}</text></div> 
      <div> <text>TicketsSold: {ticketsSold}</text></div>
      <div> <text>Tickets Remaining: {ticketsRemaining}</text></div>
      <div> <text>Profits: ${profits}</text></div>
      </div>)
      
      count +=1
    }
    
    return printInfo;
  }

  function VMSearch(){
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

  function ViewBlocks(){
    return (
      <div>
      <center>
        <h1> Blocks for {showName}</h1>
        <text>
          Venue Name: {venueName}</text> 
        <br>
        </br>
        <input
            type="button"
            value="Cancel and Exit"
            onClick={() => {window.location.reload()}}
            />
          <ListBlockInfo/>
        <br></br>
        </center>
      <br></br>
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
      </div>)
  }


  useEffect(() => {
    setSeatJson({
        showID: showID,
        seats: seatsArray
    } )

  }, [seatsArray]);

  useEffect(() => {

  }, [seatJSON]);

  useEffect(() => {
    try{
    if (Array.isArray(selectedSeats) && selectedSeats.length > 0 && blocks) {
        const newTotalPrice = selectedSeats.reduce((acc, seatId) => {
            const [seatSection, seatRow] = seatId.split('-');

            const numericSeatRow = seatRow.charCodeAt(0) - 'A'.charCodeAt(0) + 1;


            const matchingBlock = blocks.find((block) => {
                return (
                    block.section === seatSection &&
                    numericSeatRow >= block.rows[0] &&
                    numericSeatRow <= block.rows[1]
                );
            });


            if (matchingBlock) {
                return acc + matchingBlock.price;
            } else {
                return acc + defaultPrice;
            }
        }, 0);

        setTotalPrice(newTotalPrice);
    } else {
        setTotalPrice(0);
    }
  }
  catch{

  }
}, [selectedSeats, blocks]);
  

  
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
          {ShowDefaultPrice}
          <ListBlocks />
          <br></br>
          <text>
            TOTAL PRICE: {totalPrice}
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
                <style
                dangerouslySetInnerHTML={{
                __html:
                                '\n* {\n  box-sizing: border-box;\n}\n\n\n.column {\n  float: left;\n  width: 50.0%;\n  padding: 10px;\n /\n}\n\n\n.row:after {\n  content: "";\n  display: table;\n  clear: both;\n}\n'
                            }}
                />
                <div className="row">
                            <div className="column" style={{ backgroundColor: "#fff" }}>
                                            
                             </div>
                            <div className="column" style={{ backgroundColor: "#fff" }}>
                            <center><h1>Stage</h1></center>
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
                            </div>
                            <div className="column" style={{ backgroundColor: "#fff" }}>
                                <h3>Seat List</h3>
                                <text>Sort by: </text>
                                <select id="sortBy" value={sortBy} onChange={(e) => {
                                    setSortBy(e.target.value)
                                    }}>
                                    <option value="price">Price &#40;Descending&#41;</option>
                                    <option value="seatSection">Section</option>
                                    <option value="rowNum">Row &#40;Ascending&#41;</option>
                                </select>
                                <br></br>
                                <p>{seatList}</p>
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
    return (<div>
      {viewBlocksBoolean==0 ? VMSearch() : ViewBlocks()} 
      </div>);
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

      