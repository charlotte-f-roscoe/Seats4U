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
  
  let ComputerArgumentValue = (value) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT showName FROM Shows WHERE venueName=?", [value], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.length == 1)) {
            return resolve(rows[0].value);
        } else {
            return reject("unable to locate constant '" + value + "'");
        }
      });
    });
  };
  
  let response = undefined;
  
  try {
    const venueName = ComputerArgumentValue(event.arg1);
    const layout = ComputerArgumentValue(event.arg2);
    const venueAuthentication = 0; //generate random sequence of 8?
    
    let result = {
      "venueName": venueName,
      "shows": [],
      "layout": layout,
      "venueAuthentication": venueAuthentication
    };
    
    response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (err) {
    response = {
      statusCode: 400,
      error: err
    };
  } finally {
    pool.end();
  }
  
//   { “venueName” : “venue name”,
// “shows” : [ ],
// “layout” : {
// “center” : [6, 3],
// “left” : [0, 0],
// “right” : [0, 0] },
// “venue authentication” : sequence of numbers }

  // TODO implement
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify('Hello from Lambda!'),
  // };
  return response;
};
