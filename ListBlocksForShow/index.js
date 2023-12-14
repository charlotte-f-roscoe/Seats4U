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
      pool.query("SELECT * FROM Administrators WHERE authentication=?", [value], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length == 1);
      });
    });
  };
  let checkVenueManager = (authentication, venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Venues WHERE venueManager=? AND venueName=?", [authentication, venueName], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length == 1);
      });
    });
  };
  let IsValidShowID = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT venueName FROM Shows WHERE showID=?", [showID], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows[0].venueName);
      });
    });
  };
  let GetBlocks = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Blocks WHERE showID=?", [showID], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };

  let response = undefined;

  try {
    let venueName = await IsValidShowID(event.showID);
    if (await checkAdmin(event.authentication) || await checkVenueManager(event.authentication, venueName)) {
      let blocks = await GetBlocks(event.showID);

      for (let i = 0; i < blocks.length; i++) {
        blocks[i] = {
          "price": blocks[i].price,
          "section": blocks[i].blockSection,
          "rows": [blocks[i].startRow, blocks[i].endRow]
        };
      }

      response = {
        statusCode: 200,
        body: blocks
      };
    }
    else {
      response = {
        statusCode: 400,
        error: "No authorization"
      };
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