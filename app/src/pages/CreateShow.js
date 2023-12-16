import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BoxInput = ({ onAddBlock}) => {
    const [startRow, setStartRow] = useState('');
    const [endRow, setEndRow] = useState('');
    const [price, setPrice] = useState('');
    const [section, setSection] = useState('left');
    const [rows, setRows] = useState('')
  
    const handleAddBlock = async () => {
      if (startRow.trim() === '' || endRow.trim() === '' || price.trim() === '') {
        alert('Please fill in all input fields');
        return;
      }

      onAddBlock({price, section, rows:[parseInt(startRow), parseInt(endRow)]});

      setSection('left');
      setStartRow('');
      setEndRow('');
      setPrice('');
      setRows('')
    };
  
    return (
      <div className="box-container" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '200px' }}>
          <center>
          <label htmlFor="section">Section: </label>
        <select id="section" value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
        <br></br>
        <label htmlFor="startRow">Start Row: </label>
        <input type="text" style={{width: "50px"}} id="startRow" value={startRow} onChange={(e) => setStartRow(e.target.value)} required />
        <br></br>
        <label htmlFor="endRow">End Row: </label>
        <input type="text" style={{width: "50px"}} id="endRow" value={endRow} onChange={(e) => setEndRow(e.target.value)} required />
        <br></br>
        <label htmlFor="price">Price: </label>
        <input type="text" style={{width: "50px"}} id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <br></br>
        <button onClick={handleAddBlock}>Add Block</button>
        </center>
      </div>
    );
  };

export default function CreateShow(props){

    const [venueName, setVenueName] = useState('');
    const [showName, setShowName] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [defaultPrice, setDefaultPrice] = useState('');

    const [blocks, setBlocks] = useState([]);
    const [blockInputs, setBlockInputs] = useState([]);
    const [blocksButtonCondition, setblocksButtonCondition] = useState(false);
    const [defaultPriceButtonCondition, setDefaultPriceButtonCondition] = useState(true);

    const [boxes, setBoxes] = useState([]);

    const [checkBlocks, setCheckBlocks] = useState('');

    const [lBlock, setLBlock] = useState('');
    const [cBlock, setCBlock] = useState('');
    const [rBlock, setRBlock] = useState('');
    const[adminGiveVenueName, setAdminGiveVenueName] = useState(0)

   

    const [payloadBlockCheck, setPayloadBlockCheck] = useState('')

    const [blockButton, setBlockButton] = useState('')

    const handleAddBlock = async (boxData) => {

        setCheckBlocks([...boxes, boxData]);
        //setBoxes([...boxes, boxData]);     
    
    };

    useEffect(() => {
        setPayloadBlockCheck({
            venueName: venueName,
            blocks: checkBlocks
        })
      }, [checkBlocks]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/checkBlocksValid', 
                {
                    method: 'POST',
                    body: JSON.stringify(payloadBlockCheck),
                });
            
                const resultData = await response.json();
                console.log(resultData)
                if(resultData.statusCode == "200"){
                    setBoxes(checkBlocks);
                } else if(resultData.error.substring(0,6) === "blocks"){
                    alert(resultData.error)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [payloadBlockCheck])

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
                if(resultData.statusCode == "200"){
    
                setVenueName(resultData.layout[0].venueName)
    
                let Lblock = [];
                let Cblock = [];
                let Rblock = [];
                    for (let i = 0; i < parseInt(resultData.layout[0].leftRowNum); i++){
                      console.log(resultData)
                        for(let n=0; n< parseInt(resultData.layout[0].leftColNum); n++){
                            Lblock.push(<input type='button' value=' '/>);
                        }
                        Lblock.push(<br/>);
                    } setLBlock(Lblock)
    
                    for (let i = 0; i <  parseInt(resultData.layout[0].centerRowNum); i++){
                        for(let n=0; n< parseInt(resultData.layout[0].centerColNum); n++){
                            Cblock.push(<input type='button' value=' '/>);
                        }
                        Cblock.push(<br/>);
                    } setCBlock(Cblock)
    
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
                <div>
                    <input style={{width: "50px"}} 
                    placeholder="Price" value={defaultPrice} 
                    onChange={(e) => setDefaultPrice(e.target.value)}/>
                    <input type='button' value='SET'/>
                </div>
              );
        } else {
            return (
                ''
              )
        }
      };
    const removeBlock = async (index) => {
        console.log('AAAAAAAAAA')
        console.log(boxes)
        console.log(index)
        setBoxes((prevBoxes) => {
            const newArray = [...prevBoxes];
            newArray.splice(index, 1);
            console.log('Chicken Sandwhich')
            console.log(newArray)
            return newArray;
          });

    }
    useEffect(() => {
        if(blocksButtonCondition === true && boxes) {
            setBlockButton(<div>
                {boxes.map((box, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '200px' }} className={`box-container ${box.section}`}>
                    <p>Section: {box.section}</p>
                    <p>Start Row: {box.rows[0]}</p>
                    <p>End Row: {box.rows[1]}</p>
                    <p>Price: {box.price}</p>
                    <button onClick= {() =>{removeBlock(index)}}>Remove Block</button>
                </div>
                ))}
                <BoxInput onAddBlock={handleAddBlock}/>
            </div>)
        }
        if(defaultPriceButtonCondition === true){
            setBlockButton(<div></div>)
        }
      }, [boxes, blocksButtonCondition]);


    const handleSave = async (event, status) => {
      let payloadSaveShow = {};
      let vmName = ""

      if(props.user==1){
        vmName = props.venueName
      }else{
        vmName = venueName
      }
      if (boxes.length === 0) {
        setBoxes(-1)
      }

      if(status === true){
        payloadSaveShow = {
          venueName : vmName,
          show : {
            showName : showName,
            showDate : date,
            startTime : computeTime(startTime),
            endTime : computeTime(endTime),
            blocks: boxes,
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
            blocks: boxes,
            defaultPrice : defaultPrice,
            active: false,
            soldOut: false, 
          },
          authentication: props.password
        }
      } 

      console.log(payloadSaveShow)
        try {
        const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/createShow', {
            method: 'POST',
            body: JSON.stringify(payloadSaveShow),
        });
    
        const resultData = await response.json();
        if (resultData.statusCode == '200') {
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
                      {DefaultPriceButton()}
                      <br></br>
                      <input type='button' value='Set Default Price' disabled={defaultPriceButtonCondition} onClick={() => {
                        setblocksButtonCondition(false)
                        setDefaultPrice('')
                        setBlocks('')
                        setBlockInputs('')
                        setBoxes([])
                        setDefaultPriceButtonCondition(true)}} />
                      <br /><br />
                      {blockButton}
                      <br></br>
                      <input type='button' value='Use Blocks' disabled={blocksButtonCondition} onClick={() => {
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
          if(resultData.statusCode == "200"){
          

          
          setVenueName(resultData.layout[0].venueName)

          let Lblock = [];
          let Cblock = [];
          let Rblock = [];
              for (let i = 0; i < parseInt(resultData.layout[0].leftRowNum); i++){
                console.log(resultData)
                  for(let n=0; n< parseInt(resultData.layout[0].leftColNum); n++){
                      Lblock.push(<input type='button' value=' '/>);
                  }
                  Lblock.push(<br/>);
              } setLBlock(Lblock)

              for (let i = 0; i <  parseInt(resultData.layout[0].rightRowNum); i++){
                console.log(resultData)
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


    if(props.user==1 ){
      return CreateShow();
    }if(props.user == 2){
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
          {CreateShowAdmin()}
      </center>
    </div>);
    }
    else{
        return notauth();
    }

}