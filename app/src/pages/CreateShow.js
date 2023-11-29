import React, { useState } from 'react';

export default function ListVenues(){

    //const [venues, setVenues] = useState([]);
    const [error, setError] = useState(null);
    const [result, setResult] = useState('');
    const [password, setPassword] = useState('');
    const [venueName, setVenueName] = useState('');
    const [showName, setShowName] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    //const [blocks, setBlocks] = useState([]);
    //const [newBlock, setNewBlock] = useState({ price: '', section: '', rows: [] });
    const [activity, setStatus] = useState('');
    const [defaultPrice, setDefaultPrice] = useState('');
    const [auth, setAuth] = useState('');

    const [lBlock, setLBlock] = useState('');
    const [cBlock, setCBlock] = useState('');
    const [rBlock, setRBlock] = useState('');


    const handleSave = async (event, status) => {
      let payloadSaveShow = {};
      if(status === true){
        payloadSaveShow = {
          venueName : venueName,
          show : {
            showName : showName,
            showDate : date,
            startTime : startTime,
            endTime : endTime,
            blocks: [ ],
            defaultPrice : defaultPrice,
            active: true,
            soldOut: false, 
          },
          authentication: password
        }
      } else {
        payloadSaveShow = {
          venueName : venueName,
          show : {
            showName : showName,
            showDate : date,
            startTime : startTime,
            endTime : endTime,
            blocks: [ ],
            defaultPrice : defaultPrice,
            active: false,
            soldOut: false, 
          },
          authentication: password
        }
      } 

      console.log(payloadSaveShow)

        try {
        const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/createShow', {
            method: 'POST',
            body: JSON.stringify(payloadSaveShow),
        });
    
        const resultData = await response.json();
        if (response.ok) {
            alert("Your Show has been created!");
            // redirect to the home page after successful save
            window.location.href = '/Home';
          } else {
            alert('Error saving show. Please try again.');
          }
        
        } catch (error) {
        console.error('Error fetching data:', error);
        }

    };


    const handleClick = async () => {
        const payload = {
          authentication: password,
        };

        try {
            const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/checkVenueManager', 
            {
              method: 'POST',
              body: JSON.stringify(payload),
            });
      
            const resultData = await response.json();
            console.log(resultData.layout[0].leftRowNum)
            console.log(resultData.layout[0].leftColNum)
            console.log(resultData.layout[0].centerRowNum)
            console.log(resultData.layout[0].centerColNum)
            console.log(resultData.layout[0].rightRowNum)
            console.log(resultData.layout[0].rightColNum)
            setAuth(resultData.statusCode)
            setVenueName(resultData.layout[0].venueName)

            let Lblock = [];
          let Cblock = [];
          let Rblock = [];
              for (let i = 0; i < parseInt(resultData.layout[0].leftRowNum); i++){
                  for(let n=0; n< parseInt(resultData.layout[0].leftColNum); n++){
                      Lblock.push("☐");
                  }
                  Lblock.push(<br/>);
              } setLBlock(Lblock)

              for (let i = 0; i <  parseInt(resultData.layout[0].rightRowNum); i++){
                  for(let n=0; n< parseInt(resultData.layout[0].rightColNum); n++){
                      Cblock.push("☐");
                  }
                  Cblock.push(<br/>);
              }setCBlock(Cblock)

              for (let i = 0; i < parseInt(resultData.layout[0].rightRowNum); i++){
                  for(let n=0; n< parseInt(resultData.layout[0].rightColNum); n++){
                      Rblock.push("☐");
                  }
                  Rblock.push(<br/>);
              } setRBlock(Rblock)
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          
        };
    
        function ListVenues() {
          if(auth === 200) {
            return (<div>
            <center>
              <h1>Create Show</h1>
              <label>Venue Name: {venueName}</label> 
              <br></br><br></br>
              <label>
                Show Name: 
                <input
                placeholder='Enter Show Name'
                value={showName}
                onChange={(e) => setShowName(e.target.value)}
                />
              </label>
              <br /><br />
              <label>
                Date:
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>
              <br /><br />
              <label>
                Start Time: 
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </label>
              <br /><br />
              <label>
                End Time:
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </label>
            </center>
            
            <br></br>
            <center>
              <a href= "/Home"><input type="button" value="Cancel & Exit" style={{ backgroundColor: 'red', color: 'white', marginRight: '40px'}}/></a>
              <input type="button" value="Save Inactive Show & Exit Show" style={{marginRight: '40px'}} onClick= {(e) => handleSave(e, false)} />
              <input type="button" value="Activate & Exit Show" onClick= {(e) => handleSave(e, true)}/>
            </center>
            <center><h1>Stage</h1></center>
            <style
                dangerouslySetInnerHTML={{
                __html:
                    '\n* {\n  box-sizing: border-box;\n}\n\n\n.column {\n  float: left;\n  width: 50%;\n  padding: 10px;\n \n}\n\n\n.row:after {\n  content: "";\n  display: table;\n  clear: both;\n}\n'
                }}
            />
                <div className="column" style={{ backgroundColor: "#fff" }}>
                    <center>
                    <br/><br/>
                    <label>
                      Pricing:
                      <br /><br />
                      <input style={{width: "50px"}} placeholder="Price" value={defaultPrice} onChange={(e) => setDefaultPrice(e.target.value)}/>
                      <button>Set Default Price</button>
                      <br /><br />
                      <button>Create Blocks</button>
                    </label>
                    </center>
                </div>
                
                <div className="column" style={{ backgroundColor: "#fff" }}>
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
                            {lBlock}
                        </div>
                        <div className="column" style={{ backgroundColor: "#fff" }}>
                            <h3>Center</h3>
                            {cBlock}
                        </div>
                        <div className="column" style={{ backgroundColor: "#fff" }}>
                            <h3>Side Right</h3>
                            {rBlock}
                        </div>
                    </div>
                    </center>
                </div>


            <br /><br />
          </div>)
          } else {
            return (<div>
              <center><h1>You do not have authorization.</h1></center></div>)
          }
        }
    

    return (
      <div>
        <center>
          <br></br>
          <p>This view requires Venue Manager authorization. Please enter your password below.</p>
          <input
            id="password"
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            /><br></br>
        <input type="button" value="AUTHENTICATE" onClick={() => handleClick()} style={{ marginLeft: '0', padding: '5px' }} />
        <ListVenues />
        </center>
      </div>
    )
}
