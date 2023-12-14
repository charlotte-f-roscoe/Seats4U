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
  let SearchDB = (value) => {
    value = "\%"+value+"\%";
    return new Promise((resolve, reject) => {
       pool.query("SELECT * FROM Shows WHERE showName LIKE ? OR venueName LIKE ? OR showDate LIKE ? order by venueName, showDate, startTime", [value,value,value], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };
  
  let response = undefined;
  
  try {
    let results = await SearchDB(event.search);
    
    response = {
      statusCode: 200,
      shows: results
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