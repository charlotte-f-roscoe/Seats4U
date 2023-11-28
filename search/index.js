const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });
  
  let ComputeArgumentValue = (value) => {
          return new Promise((resolve, reject) => {
              pool.query("SELECT showName FROM Shows WHERE showName=?", [value], (error, rows) => {
                  if (error) { return reject(error); }
                  if ((rows) && (rows.length == 1)) {
                      return resolve(rows[0].value);
                  } else {
                      return reject("unable to locate constant '" + value + "'");
                  }
              });
          });
  }
  
  // what will be returned.
  let response = undefined
  
  try {
    const arg1_value = await ComputeArgumentValue(event.arg1)
   
    result = arg1_value
    
    response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (err) {
    response = {
      statusCode: 400,
      error: err
    }
  } finally {
    pool.end()     // disconnect from database to avoid "too many connections" problem that can occur
  }
  
  return response;
}
