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
  
  let GetActiveShows = () => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows WHERE active=?",[1], (error,rows) => {
        if(error) { return reject(error); }
        resolve(rows);
      });
    });
  };
  
  let response = undefined;
  
  try {
    let activeShows = await GetActiveShows();
    
    response = {
      statusCode: 200,
      body: activeShows
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