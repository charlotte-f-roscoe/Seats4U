const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });
  
  let ValidShow = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT active FROM Shows WHERE showID=?",[showID], (error,rows) => {
        if(error) { return reject(error); }
        if(rows && rows.length == 1 && rows[0].active == 1) {
            resolve(rows);
        } else if(rows[0].active != 1) {
          reject("Show is not active");
        } else {
          reject("Show does not exist");
        }
      });
    });
  };
  
  let GetAvailableSeats = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=? AND available=?",[showID,1], (error,rows) => {
        if(error) { return reject(error); }
        resolve(rows);
      });
    });
  };
  
  let response = undefined;
  
  try {
    await ValidShow(event.showID);
    let availableSeats = await GetAvailableSeats(event.showID);
    
    response = {
      statusCode: 200,
      body: availableSeats
    };
  } catch (err) {
    response = {
      statusCode: 400,
      error: err
    };
  } finally {
    pool.end();
  }
  return response;
};