import React, { useState } from 'react';
export default function CreateVenue(){
    return (
        <div>
            <center>
                <h1></h1>
                <h1>Create Venue</h1>
                <text>Venue Name: </text>
                <input
                id="venueName"
                />
                <br /><br />
                <input type="button" value="Cancel & Exit Venue" />
                <input type="button" value="Save & Exit Venue" />
            </center>
        </div>
    )
}