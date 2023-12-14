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

  let CheckVenueExists = (value) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT venueName FROM Venues WHERE venueName=?", [value], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.length == 1)) {
          return resolve(true);
        }
        else {
          return resolve(false);
        }
      });
    });
  };

  let IsLayoutValid = (value) => {
    return new Promise((resolve, reject) => {
      if((value.center[0] == 0 && value.center[1] != 0) || (value.center[0] != 0 && value.center[1] == 0)) {
        return reject("Layout center is invalid");
      }
      if((value.left[0] == 0 && value.left[1] != 0) || (value.left[0] != 0 && value.left[1] == 0)) {
        return reject("Layout left is invalid");
      }
      if((value.right[0] == 0 && value.right[1] != 0) || (value.right[0] != 0 && value.right[1] == 0)) {
        return reject("Layout right is invalid");
      }
      if(value.center[0] + value.center[1] + value.left[0] + value.left[1] + value.right[0] + value.right[1] == 0) {
        return reject("Layout cannot be empty");
      }
      return resolve(true);
    });
  };

  let CreateVenue = (value) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO Venues(venueName) VALUES(?)", [value], (error, data) => {
        if (error) { return reject(error); }
        if ((data) && (data.affectedRows == 1)) {
          return resolve(true);
        }
        else {
          return reject("unable to create venue: " + data);
        }
      });
    });
  };
  
  let GetVenueManager = (value) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT venueManager FROM Venues WHERE venueName=?", [value], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data[0].venueManager);
      });
    });
  };
  
  let CreateLayout = (venueName,value) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO Layouts(venueName,leftRowNum,leftColNum,centerRowNum,centerColNum,rightRowNum,rightColNum) VALUES(?,?,?,?,?,?,?)", [venueName,value.left[0],value.left[1],value.center[0],value.center[1],value.right[0],value.right[1]], (error, data) => {
        if (error) { return reject(error); }
        if ((data) && (data.affectedRows == 1)) {
          return resolve(true);
        }
        else {
          return reject("unable to create layout: " + data);
        }
      });
    });
  };

  let response = undefined;

  try {
    if (await CheckVenueExists(event.venueName)) {
      response = {
        statusCode: 400,
        error: "Venue already exists"
      };
    } else if(!await IsLayoutValid(event.layout)) {
      response = {
        statusCode: 400,
        error: "layout is not valid"
      };
    } else {
      await CreateVenue(event.venueName);
      const venueManager = await GetVenueManager(event.venueName);
      await CreateLayout(event.venueName,event.layout);
  
      let result = {
        "venueName": event.venueName,
        "shows": [],
        "layout": event.layout,
        "venueManager": venueManager
      };
      response = {
        statusCode: 200,
        body: result
      };
    }
  } catch (err) {
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