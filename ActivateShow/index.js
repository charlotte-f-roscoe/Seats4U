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
  let checkAdmin = (value) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Administrators where authentication=?", [value], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length == 1);
      });
    });
  };
  let checkVenueManager = (venueName, venueManager) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Venues WHERE venueName=? AND venueManager=?", [venueName, venueManager], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length == 1);
      });
    });
  };
  let ValidShow = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows WHERE showID=?", [showID], (error, rows) => {
        if (error) { return reject(error); }
        if(rows.length === 0) { return reject("Invalid showID"); }
        const timeZone = "America/New_York";
        let curr = new Date(new Date().toLocaleString('en-US', { timeZone }));
        let timeStr = `${curr.getHours()}${curr.getMinutes()}`;
        curr.setHours(0, 0, 0, 0);
        let showDate = rows[0].showDate;
        let isInFuture = showDate > curr || (showDate.getYear() == curr.getYear() && showDate.getMonth() == curr.getMonth() && showDate.getDate() == curr.getDate() && rows[0].startTime >= timeStr);
        if (rows && rows.length == 1) {
          if (rows[0].active != 1 && isInFuture) {
            return resolve(rows);
          }
          else if (!isInFuture) {
            return reject("show date has passed");
          }
          else {
            return reject("Show is already active");
          }
        }
        else {
          return reject("Show does not exist");
        }
      });
    });
  };
  let ActivateShow = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Shows SET active=? WHERE showID=?", [1, showID], (error, rows) => {
        if (error) { return reject(error); }
        resolve(rows);
      });
    });
  };

  let response = undefined;

  try {
    if (checkAdmin(event.authentication) || checkVenueManager(event.authentication)) {
      await ValidShow(event.showID);
      await ActivateShow(event.showID);

      response = {
        statusCode: 200,
        body: "Show is now active"
      };
    }
    else {
      response = {
        statusCode: 400,
        error: "invalid authentication"
      }
    }
  }
  catch (err) {
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