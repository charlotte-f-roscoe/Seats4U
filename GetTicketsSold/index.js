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
          return resolve(true);
        } else if(rows && rows.length == 1 && rows[0].active != 1) {
          return resolve(false);
        } else {
          return reject("Show does not exist");
        }
      });
    });
  };
  let GetSeats = (showID,block) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=? AND rowNum>=? AND rowNum<=? AND seatSection=?",[showID,block.rows[0],block.rows[1],block.section], (error,rows) => {
        if(error) { return reject(error); }
        return resolve(rows.length);
      });
    });
  };
  let GetAvailableSeats = (showID,block) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=? AND available=? AND rowNum>=? AND rowNum<=? AND seatSection=?",[showID,0,block.rows[0],block.rows[1],block.section], (error,rows) => {
        if(error) { return reject(error); }
        return resolve(rows.length);
      });
    });
  };
  
  let response = undefined;
  
  try {
    let totalSeats = 0;
    let seatsSold = 0;
    if(await ValidShow(event.showID)) {
      totalSeats = await GetSeats(event.showID,event.block);
      seatsSold = await GetAvailableSeats(event.showID,event.block);
    }
    response = {
      statusCode: 200,
      body: {
        "ticketsSold":seatsSold,
        "ticketsRemaining": totalSeats - seatsSold
      }
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