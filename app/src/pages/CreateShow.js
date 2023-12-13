import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function CreateShow(props){

    const [venueName, setVenueName] = useState('');
    const [showName, setShowName] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [defaultPrice, setDefaultPrice] = useState('');
    const [blockComplete, setBlockComplete] = useState(true);

    const [blocks, setBlocks] = useState('');
    const [blockInputs, setBlockInputs] = useState([]);
    const [blocksButtonCondition, setblocksButtonCondition] = useState(false);
    const [defaultPriceButtonCondition, setDefaultPriceButtonCondition] = useState(true);

    const [section, setSection] = useState('')
    const [startRow, setStartRow] = useState('')
    const [endRow, setEndRow] = useState('')
    const [blockPrice, setBlockPrice] = useState('')



    const [lBlock, setLBlock] = useState('');
    const [cBlock, setCBlock] = useState('');
    const [rBlock, setRBlock] = useState('');
    const[adminGiveVenueName, setAdminGiveVenueName] = useState(0)

    useEffect (() => {
        const fetchData = async () => {
            const payload = {
                authentication: props.password,
            };
    
            try {
                const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/checkVenueManager', 
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            
                const resultData = await response.json();
                if(resultData.statusCode === "200"){
    
                
                setVenueName(resultData.layout[0].venueName)
    
                let Lblock = [];
                let Cblock = [];
                let Rblock = [];
                    for (let i = 0; i < parseInt(resultData.layout[0].leftRowNum); i++){
                        for(let n=0; n< parseInt(resultData.layout[0].leftColNum); n++){
                            Lblock.push(<input type='button' value=' '/>);
                        }
                        Lblock.push(<br/>);
                    } setLBlock(Lblock)
    
                    for (let i = 0; i <  parseInt(resultData.layout[0].rightRowNum); i++){
                        for(let n=0; n< parseInt(resultData.layout[0].rightColNum); n++){
                            Cblock.push(<input type='button' value=' '/>);
                        }
                        Cblock.push(<br/>);
                    }setCBlock(Cblock)
    
                    for (let i = 0; i < parseInt(resultData.layout[0].rightRowNum); i++){
                        for(let n=0; n< parseInt(resultData.layout[0].rightColNum); n++){
                            Rblock.push(<input type='button' value=' '/>);
                        }
                        Rblock.push(<br/>);
                    } setRBlock(Rblock)
                }
                
                } catch (error) {
                console.error('Error fetching data:', error);
                }
        }
        fetchData();
    }, [])

    const DefaultPriceButton = () => {
        if (defaultPriceButtonCondition === true){
            return (
                <input style={{width: "50px"}} 
            placeholder="Price" value={defaultPrice} 
            onChange={(e) => setDefaultPrice(e.target.value)}/>
              );
        } else {
            return (
                ''
              )
        }
      };
    const BlocksInputButton = () => {
    setBlockComplete(false)
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '300px' }}>
            <text>Section: </text>
            <select>
                <option>Left</option>
                <option>Center</option>
                <option>Right</option>
            </select>
            <br></br>
            <text>Starting Row: </text><input style={{width: "50px"}} placeholder="" value={startRow} onChange={(e) => setStartRow(e.target.value)}/><input type='button' value='SET'/>
            <br></br>
            <text>Ending Row: </text><input style={{width: "50px"}} placeholder="" value={endRow} onChange={(e) => setEndRow(e.target.value)}/><input type='button' value='SET'/>
            <br></br>
            <text>Price: </text><input style={{width: "50px"}} placeholder="" value={blockPrice} onChange={(e) => setBlockPrice(e.target.value)}/><input type='button' value='SET'/>
            <br></br><br></br>
            <input type="button" value="Save Block" onClick= {() => {
                if(startRow.length === 0|| endRow.length === 0 || blockPrice.length === 0) {
                    alert('Please complete all fields before creating new block')
                }
            }}/>
            </div>
        )
    };

      const BlocksButton = () => {
        if (blocksButtonCondition === true){
            return (
                <div>
                {blockInputs}
                <input type="button" value="+ ADD BLOCK" onClick= {() => 
                    {
                        if(blockComplete === true){
                            setBlockInputs((prevArray => [...prevArray, <BlocksInputButton/>]))
                        } else {
                            alert('Please complete previoius Block before creating a new Block')
                        }
                }}/>
             </div>
              );  
        } else {
            return (
                ''
              )
        }
      };


    const handleSave = async (event, status) => {
      let payloadSaveShow = {};
      let vmName = ""

      if(props.user===1){
        vmName = props.venueName
      }else{
        vmName = venueName
      }

      if(status === true){
        payloadSaveShow = {
          venueName : vmName,
          show : {
            showName : showName,
            showDate : date,
            startTime : computeTime(startTime),
            endTime : computeTime(endTime),
            blocks: [ ],
            defaultPrice : defaultPrice,
            active: true,
            soldOut: false, 
          },
          authentication: props.password
        }
      } else {
        payloadSaveShow = {
          venueName : vmName,
          show : {
            showName : showName,
            showDate : date,
            startTime : computeTime(startTime),
            endTime : computeTime(endTime),
            blocks: [ ],
            defaultPrice : defaultPrice,
            active: false,
            soldOut: false, 
          },
          authentication: props.password
        }
      } 


        try {
        const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/createShow', {
            method: 'POST',
            body: JSON.stringify(payloadSaveShow),
        });
    
        const resultData = await response.json();
        if (resultData.statusCode === '200') {
            alert("Your Show has been created!");
            // redirect to the home page after successful save
            window.location.href = '#/';
          } else {
            alert('Error saving show. Please try again.\n' + resultData.error);
          }
        
        } catch (error) {
        console.error('Error fetching data:', error);
        }

    };

        function notauth(){  
            return (<div>
              <center><h1>You do not have authorization.</h1></center></div>);
        }

        function computeTime(time){
          const hour = parseInt(time.substring(0,2));
          const min = parseInt(time.substring(3,6));
          const currentTime = hour*100+min;
          return currentTime;
        }
    
        function CreateShow() {    
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
            <Link to="/"><input type="button" value="Cancel & Exit" style={{ backgroundColor: 'red', color: 'white', marginRight: '40px'}}/></Link>
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
                      <DefaultPriceButton/>
                      <br></br>
                      <input type='button' value='Set Default Price' onClick={() => {
                        setblocksButtonCondition(false)
                        setStartRow('')
                        setEndRow('')
                        setBlockPrice('')
                        setSection('')
                        setDefaultPrice('')
                        setBlocks('')
                        setBlockInputs('')
                        setDefaultPriceButtonCondition(true)}} />
                      <br /><br />
                      <BlocksButton/>
                      <br></br>
                      <input type='button' value='Use Blocks' onClick={() => {
                        setDefaultPrice(-1)
                        setblocksButtonCondition(true)
                        setDefaultPriceButtonCondition(false)}} />
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
          </div>);
        }
        function CreateShowAdmin() {  
          if(adminGiveVenueName){
              return CreateShow()
          }  
        }

      const handleClick = async () => {
        const payload = {
          venueName: venueName,
          authentication: props.password,
        };

        
        try {
          const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/checkVenueManager', 
          {
              method: 'POST',
              body: JSON.stringify(payload),
          });
      
          const resultData = await response.json();
          if(resultData.statusCode === "200"){

          
          setVenueName(resultData.layout[0].venueName)

          let Lblock = [];
          let Cblock = [];
          let Rblock = [];
              for (let i = 0; i < parseInt(resultData.layout[0].leftRowNum); i++){
                  for(let n=0; n< parseInt(resultData.layout[0].leftColNum); n++){
                      Lblock.push(<input type='button' value=' '/>);
                  }
                  Lblock.push(<br/>);
              } setLBlock(Lblock)

              for (let i = 0; i <  parseInt(resultData.layout[0].rightRowNum); i++){
                  for(let n=0; n< parseInt(resultData.layout[0].rightColNum); n++){
                      Cblock.push(<input type='button' value=' '/>);
                  }
                  Cblock.push(<br/>);
              }setCBlock(Cblock)

              for (let i = 0; i < parseInt(resultData.layout[0].rightRowNum); i++){
                  for(let n=0; n< parseInt(resultData.layout[0].rightColNum); n++){
                      Rblock.push(<input type='button' value=' '/>);
                  }
                  Rblock.push(<br/>);
              } setRBlock(Rblock)
          }
          setAdminGiveVenueName(1)
          
          } catch (error) {
          console.error('Error fetching data:', error);
          }
        }


    if(props.user===1 ){
      return CreateShow();
    }if(props.user === 2){
      return (<div>
      <center>
          <br></br>
          <p>Please enter Venue Name.</p>
          <input
              id="venueName"
              placeholder="Enter Venue"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              />
          <br></br>
         
          <input type="button" value="ENTER VENUE" onClick={() => handleClick()} style={{ marginLeft: '0', padding: '5px' }} />
          <CreateShowAdmin />
      </center>
    </div>);
    }
    else{
        return notauth();
    }

}