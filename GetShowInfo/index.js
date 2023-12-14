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
    let GetShowInfo = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Shows WHERE showID=?", [showID], (error, data) => {
                if (error) { return reject(error); }
                return resolve(data[0]);
            });
        });
    };
    let GetSeats = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=?",[showID], (error,rows) => {
        if(error) { return reject(error); }
        resolve(rows);
      });
    });
  };
    
    let response = undefined;
    
    try {
      let showInfo = await GetShowInfo(event.showID);
      let seatInfo = await GetSeats(event.showID);
      
      for(let i=0;i<seatInfo.length;i++) {
          seatInfo[i] = {
              "location": [seatInfo[i].rowNum,seatInfo[i].colNum],
              "section": seatInfo[i].seatSection,
              "available": seatInfo[i].available
          }
      }
      
      let result = {
        "showInfo": showInfo,
        "seats": seatInfo
      };
      
      response = {
          statusCode: 200,
          body: result
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