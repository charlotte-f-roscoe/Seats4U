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

  let CheckShowExists = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT venueName FROM Shows WHERE showID=?", [showID], (error, rows) => {
        if (error) { return reject(error); }
        if(rows && rows.length == 1) {
          return resolve(rows[0].venueName);
        } else {
          return reject("Show does not exist");
        }
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
  let ShowInactive = (showID) => {
    return new Promise((resolve, reject) => {
       pool.query("SELECT active FROM Shows WHERE showID=?",[showID], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows[0].active==0);
      });
    });
  };

  let response = undefined;

  try {
      let venueName = await CheckShowExists(event.showID);
      if(await checkAdmin(event.authentication) || (await checkVenueManager(venueName,event.authentication) && await ShowInactive(event.showID))) {
        await DeleteBlocks(event.showID);
        await DeleteSeats(event.showID);
        await DeleteShow(event.showID);
        
        response = {
          statusCode: 200,
          body: ""+event.showID+" show has been deleted"
        };
      } else {
        response = {
          statusCode: 400,
          error: "cannot delete show"
        }
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