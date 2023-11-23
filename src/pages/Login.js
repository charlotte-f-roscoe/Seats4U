import React, { useState } from 'react';
export default function Login(){
    return (
        <div>
            <center>
                <h1></h1>
                <h1>Log In</h1>
                <p>Enter Password:</p>
                <input
                id="password"
                placeholder='PASSWORD'
                />
                <br /><br />
                <input type="button" value="LOG IN" />
            </center>
        </div>
    )
}