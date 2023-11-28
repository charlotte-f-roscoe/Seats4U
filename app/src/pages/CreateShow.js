import React, { useState } from 'react';

    export default function CreateShow() {
        const [venueName, setVenueName] = useState('');
        const [showName, setShowName] = useState('');
        const [date, setDate] = useState('');
        const [startTime, setStartTime] = useState('');
        const [endTime, setEndTime] = useState('');
        const [showID, setShowID] = useState('');
        const [blocks, setBlocks] = useState([]);
        const [newBlock, setNewBlock] = useState({ price: '', section: '', rows: [] });
        const [result, setResult] = useState('');


        const handleActivate = async () => {
            const payload = {

            }
        }


        const handleSave = async () => {
            const payload = {
                show: {
                    showID: showID,
                    showName: showName,
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    blocks: blocks,
                    active: false,
                    soldOut: false,
                  },
            };
        
            try {
              const response = await fetch('https://y59un3k84l.execute-api.us-east-1.amazonaws.com/Initial/calc', 
              {
                method: 'POST',
                body: JSON.stringify(payload),
              });
        
              const resultData = await response.json();
              setResult(resultData.body);
              if (response.ok) {
                alert('Show saved successfully!');
                // redirect to the home page after successful save
                window.location.href = '/Home';
              } else {
                alert('Error saving show. Please try again.');
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };

    return (
        <div>
      <center>
        <h1>Create Show</h1>
        <label>
          Show Name:
          <input
            type="text"
            id="showName"
            value={showName}
            onChange={(e) => setShowName(e.target.value)}
            required
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
        <br /><br />
        <label>
          Show Status:
        </label>
        <br /><br />
       </center>

       <div style={{ textAlign: 'right', marginRight: '200px' }}>
      <label>
        Pricing:
        <br /><br />
        <button>Set Default Price</button>
        <br /><br />
        <button>Create Blocks</button>
      </label>
      <br /><br />
    </div>

        <center>
        <input type="button" value="Cancel & Exit" style={{ backgroundColor: 'red', color: 'white', marginRight: '40px'}}/>
        <input type="button" value="Save & Exit Show" style={{marginRight: '40px'}} onClick={handleSave} />
        <input type="button" value="Activate & Exit Show" onClick={handleActivate} />
      </center>
    </div>
    )
}
