import React, { useState } from 'react';
import { Routes, Route, Link, HashRouter } from 'react-router-dom';

export default function CreateVenue(){
    const [LRows, setLRows] = useState('');
    const [LCols, setLCols] = useState('');
    const [CRows, setCRows] = useState('');
    const [CCols, setCCols] = useState('');
    const [RRows, setRRows] = useState('');
    const [RCols, setRCols] = useState('');

    const [LSeats, setLSeats] = useState('');
    const [CSeats, setCSeats] = useState('');
    const [RSeats, setRSeats] = useState('');


    const [venueName, setVenueName] = useState('');

    const handleClick = async (event, side) => {

        let block = [];
        if(side === 'L'){
            for (let i = 0; i < parseInt(LRows); i++){
                for(let n=0; n< parseInt(LCols); n++){
                    block.push(<input type='button' value=' '/>);
                }
                block.push(<br/>);
            }
            setLSeats(block)
        } else if(side === 'C'){
            for (let i = 0; i < parseInt(CRows); i++){
                for(let n=0; n< parseInt(CCols); n++){
                    block.push(<input type='button' value=' '/>);
                }
                block.push(<br/>);
            }
            setCSeats(block)
        } else if(side === 'R'){
            for (let i = 0; i < parseInt(RRows); i++){
                for(let n=0; n< parseInt(RCols); n++){
                    block.push(<input type='button' value=' '/>);
                }
                block.push(<br/>);
            }
            setRSeats(block)
        }
    };
    const saveVenue = async () => {

        const payload = {
            "venueName": venueName,
            "layout": {
                "center": [
                    CRows,
                    CCols
                ],
                "left": [
                    LRows,
                    LCols
                ],
                "right": [
                    RRows,
                    RCols
                ]
            }
          };
        try {
        const response = await fetch('https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Initial/createVenue', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    
        const resultData = await response.json();
       
        if (resultData.statusCode==200) {
            alert("Your password is: "+ resultData.body.venueManager);
            // redirect to the home page after successful save
            window.location.href = '#/';
          } else {
            alert('Error saving venue. Please try again.\n' + resultData.error);
          }
        
        } catch (error) {
            alert('Error saving venue. Please try again.\n' + error);
            console.error('Error fetching data:', error);
        }
        
    }

    return (<div>
        <center>
            <h1></h1>
            <h1>Create Venue</h1>
            <text>Venue Name: </text>
            <input
            id="venueName"
            value={venueName} 
            onChange={(e) => setVenueName(e.target.value)}
            />
            <br/><br/>
            <div class="row">
            </div>
            <Link to="/"><input type="button" value="Cancel and Exit Venue" /></Link>
            <input type="button" value="Save and Exit Venue" onClick={saveVenue}/>
        </center>
        <style
            dangerouslySetInnerHTML={{
            __html:
                '\n* {\n  box-sizing: border-box;\n}\n\n\n.column {\n  float: left;\n  width: 30%;\n  padding: 10px;\n \n}\n\n\n.row:after {\n  content: "";\n  display: table;\n  clear: both;\n}\n'
            }}
        />
            <div className="column" style={{ backgroundColor: "#fff" }}>
                <center>
                <br/><br/><br/><br/><br/><br/><br/><br/>

                <text style={{ color: 'red' }}>* </text><text>Side Left</text>
                <br/><br />
                <input style={{width: "50px"}} placeholder="Rows" value={LRows} onChange={(e) => setLRows(e.target.value)} id="sideLeftRows"/>
                <text> x </text>
                <input style={{width: "50px"}} placeholder="Cols" value={LCols} onChange={(e) => setLCols(e.target.value)} id="sideLeftColumns"/>
                <text> </text><input type="button" value="APPLY" onClick={(e) => handleClick(e, 'L')} />
                
                <br /><br />

                <text style={{ color: 'red' }}>*</text><text >Center</text>
                <br/><br />
                <input style={{width: "50px"}} placeholder="Rows" value={CRows} onChange={(e) => setCRows(e.target.value)} id="CenterRows"/>
                <text> x </text>
                <input style={{width: "50px"}} placeholder="Cols" value={CCols} onChange={(e) => setCCols(e.target.value)} id="CenterColumns"/>
                <text> </text><input type="button" value="APPLY" onClick={(e) => handleClick(e, 'C')} />
                <br/>
                <br /><br />

                <text style={{ color: 'red' }}>*</text><text> Side Right</text>
                <br/><br />
                <input style={{width: "50px"}} placeholder="Rows" value={RRows} onChange={(e) => setRRows(e.target.value)} id="sideRightRows"/>
                <text> x </text>
                <input style={{width: "50px"}} placeholder="Cols" value={RCols} onChange={(e) => setRCols(e.target.value)} id="sideRightColumns"/>
                <text> </text><input type="button" value="APPLY" onClick={(e) => handleClick(e, 'R')} />
                <br/>
                
                </center>
            </div>
            
            <div className="column" style={{ backgroundColor: "#fff" }}>
                <center>
                <h1>Stage</h1>
                <style
                dangerouslySetInnerHTML={{
                __html:
                                '\n* {\n  box-sizing: border-box;\n}\n\n\n.column {\n  float: left;\n  width: 33.33%;\n  padding: 10px;\n /\n}\n\n\n.row:after {\n  content: "";\n  display: table;\n  clear: both;\n}\n'
                            }}
                />
                <div className="row">
                    <div className="column" style={{ backgroundColor: "#fff" }}>
                        <h3>Side Left</h3>
                        <h3>{LSeats}</h3>
                    </div>
                    <div className="column" style={{ backgroundColor: "#fff" }}>
                        <h3>Center</h3>
                        <h3>{CSeats}</h3>
                    </div>
                    <div className="column" style={{ backgroundColor: "#fff" }}>
                        <h3>Side Left</h3>
                        <h3>{RSeats}</h3>
                    </div>
                </div>
                </center>
            </div>
    </div>
)
}