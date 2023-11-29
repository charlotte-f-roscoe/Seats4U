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

  let DeleteVenue = (venueName, venueManager) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Venues WHERE venueName=? AND venueManager=?", [venueName, venueManager], (error, data) => {
        if (error) { return reject(error); }
        if ((data) && (data.affectedRows == 1)) {
          return resolve(true);
        }
        else {
          return reject("unable to delete venue: " + data);
        }
      });
    });
  };
  
  let DeleteLayout = (venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Layouts WHERE venueName=?", [venueName], (error, data) => {
        if (error) { return reject(error); }
        if ((data) && (data.affectedRows == 1)) {
          return resolve(true);
        }
        else {
          return reject("unable to delete layout: " + data);
        }
      });
    });
  };

  let response = undefined;

  try {
    if (!await CheckVenueExists(event.venueName)) {
      response = {
        statusCode: 400,
        error: "Venue does not exist"
      };
    } else {
        await DeleteVenue(event.venueName,event.venueManager);
        await DeleteLayout(event.venueName,event.venueManager);
        
        response = {
          statusCode: 200,
          body: ""+event.venueName+" venue has been deleted"
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
