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
                  return resolve("venue exists");
                }
                else {
                  return reject("venue does not exist");
                }
            });
        });
    };

  let DeleteVenue = (venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Venues WHERE venueName=?", [venueName], (error, data) => {
        if (error) { return reject(error); }
        if ((data) && (data.affectedRows == 1)) {
          return resolve(true);
        }
        else {
          return reject("unable to delete venue " + data);
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
  
  let checkAdmin = (value) => {
    return new Promise((resolve, reject) => {
       pool.query("SELECT * FROM Administrators where authentication=?",[value], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length==1);
      });
    });
  };
  let checkVenueManager = (venueName,venueManager) => {
    return new Promise((resolve, reject) => {
       pool.query("SELECT * FROM Venues WHERE venueName=? AND venueManager=?",[venueName,venueManager], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length==1);
      });
    });
  };
  let noActiveShows = (venueName) => {
    return new Promise((resolve, reject) => {
       pool.query("SELECT * FROM Shows WHERE venueName=? AND active=?",[venueName,1], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length==0);
      });
    });
  };
  let GetShowID = (venueName) => {
    return new Promise((resolve, reject) => {
       pool.query("SELECT showID FROM Shows WHERE venueName=?",[venueName,1], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };
  let DeleteShow = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Shows WHERE showID=?", [showID], (error, data) => {
        if (error) { return reject(error); }
        if ((data) && (data.affectedRows == 1)) {
          return resolve(true);
        }
        else {
          return reject("unable to delete show " + data);
        }
      });
    });
  };
  let DeleteSeats = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Seats WHERE showID=?", [showID], (error, data) => {
        if (error) { return reject(error); }
        if ((data) && (data.affectedRows >= 0)) {
          return resolve(true);
        }
        else {
          return reject("unable to delete seats: " + data);
        }
      });
    });
  };
  let DeleteBlocks = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Blocks WHERE showID=?", [showID], (error, data) => {
        if (error) { return reject(error); }
        return resolve(true);
      });
    });
  };

  let response = undefined;

  try {
    await CheckVenueExists(event.venueName);
    if(await checkAdmin(event.authentication) || (await checkVenueManager(event.venueName,event.authentication) && await noActiveShows(event.venueName))) {
      await DeleteVenue(event.venueName);
      await DeleteLayout(event.venueName);
      let shows = await GetShowID(event.venueName);
      for(let i=0;i<shows.length;i++) {
        await DeleteBlocks(shows[i].showID);
        await DeleteSeats(shows[i].showID);
        await DeleteShow(shows[i].showID);
      }
      
      response = {
        statusCode: 200,
        body: ""+event.venueName+" venue and all of it's shows have been deleted"
      };
    } else {
      response = {
        statusCode: 400,
        error: "cannot delete venue"
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