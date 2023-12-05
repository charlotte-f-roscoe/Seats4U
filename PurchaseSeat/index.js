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
        } else if(rows && rows.length == 1 && rows[0].active != 1) {
          reject("Show is not active");
        }         else {
          reject("Show does not exist");
        }
      });
    });
  };
  
  let ValidSeat = (showID,row,col) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT available FROM Seats WHERE showID=? AND rowNum=? AND colNum=?",[showID,row,col], (error,rows) => {
        if(error) { return reject(error); }
        if(rows && rows.length == 1 && rows[0].available == 1) {
          resolve(rows);
        } else if(rows && rows.length == 1 && rows[0].available != 1) {
          reject("Seat "+row+", "+col+" is not available");
        } else {
          reject("Seat "+row+", "+col+" does not exist");
        }
      });
    });
  };
  
  let PurchaseSeat = (showID,row,col) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Seats SET available=? WHERE showID=? AND available=? AND rowNum=? AND colNum=?",[0,showID,1,row,col], (error,rows) => {
        if(error) { return reject(error); }
        resolve(rows);
      });
    });
  };
  
  let response = undefined;
  
  try {
    let seats = event.seats;
    await ValidShow(event.showID);
    for(let i=0;i<seats.length;i++) {
      await ValidSeat(event.showID,seats[i].location[0],seats[i].location[1]);
    }
    for(let i=0;i<seats.length;i++) {
      await PurchaseSeat(event.showID,seats[i].location[0],seats[i].location[1]);
      seats[i].available = 0;
    }
    
    response = {
      statusCode: 200,
      body: seats
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
