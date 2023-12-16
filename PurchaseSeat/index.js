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
      pool.query("SELECT * FROM Shows WHERE showID=?", [showID], (error, rows) => {
        if (error) { return reject(error); }
        if (rows && rows.length == 1 && rows[0].active == 1) {
          return resolve(rows[0]);
        }
        else if (rows && rows.length == 1 && rows[0].active != 1) {
          return reject("Show is not active");
        }
        else {
          return reject("Show does not exist");
        }
      });
    });
  };

  let ValidSeat = (showID, row, col, section) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT available FROM Seats WHERE showID=? AND rowNum=? AND colNum=? AND seatSection=?", [showID, row, col, section], (error, rows) => {
        if (error) { return reject(error); }
        if (rows && rows.length == 1 && rows[0].available == 1) {
          return resolve(rows);
        }
        else if (rows && rows.length == 1 && rows[0].available != 1) {
          return reject("Seat " + row + ", " + col + " is not available");
        }
        else {
          return reject("Seat " + row + ", " + col + " does not exist");
        }
      });
    });
  };

  let PurchaseSeat = (showID, row, col, section) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Seats SET available=? WHERE showID=? AND available=? AND rowNum=? AND colNum=? AND seatSection=?", [0, showID, 1, row, col, section], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };
  let IsSoldOut = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=? AND available=?", [showID, 1], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length === 0);
      });
    });
  };
  let SetSoldOut = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Shows SET soldOut=? WHERE showID=?", [1, showID], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };

  let checkDateTime = (show) => {
    return new Promise((resolve, reject) => {
      const timeZone = "America/New_York";
      let curr = new Date(new Date().toLocaleString('en-US', { timeZone }));
      let timeStr = `${curr.getHours()}${curr.getMinutes()}`;
      curr.setHours(0, 0, 0, 0);
      let showDate = show.showDate;
      let isInFuture = showDate > curr || (showDate.getYear() == curr.getYear() && showDate.getMonth() == curr.getMonth() && showDate.getDate() == curr.getDate() && show.startTime >= timeStr);
      if (!isInFuture) {
        return reject("Show time has passed, cannot purchase ticket");
      }
      else {
        return resolve(true);
      }
    });
  };

  let response = undefined;

  try {
    let seats = event.seats;
    let show = await ValidShow(event.showID);
    await checkDateTime(show);
    for (let i = 0; i < seats.length; i++) {
      await ValidSeat(event.showID, seats[i].location[0] + 1, seats[i].location[1] + 1, seats[i].section);
    }
    for (let i = 0; i < seats.length; i++) {
      await PurchaseSeat(event.showID, seats[i].location[0] + 1, seats[i].location[1] + 1, seats[i].section);
      seats[i].available = 0;
    }
    if (await IsSoldOut(event.showID)) { await SetSoldOut(event.showID); }
    response = {
      statusCode: 200,
      body: seats
    };
  }
  catch (err) {
    console.log(err);
    response = {
      statusCode: 400,
      error: err
    };
  }
  finally {
    pool.end();
  }
  return response;
};