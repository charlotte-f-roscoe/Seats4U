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
    value = "\%" + value + "\%";
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows WHERE showName LIKE ? OR venueName LIKE ? OR showDate LIKE ? order by venueName, showDate, startTime", [value, value, value], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };
  let GetActiveShows = () => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows WHERE active=?", [1], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };
  let updateActiveShows = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Shows SET active=? WHERE showID=?", [0, showID], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };

  let response = undefined;

  try {
    let activeShows = await GetActiveShows();
    const timeZone = "America/New_York";
    let curr = new Date(new Date().toLocaleString('en-US', { timeZone }));
    let timeStr = `${curr.getHours()}${curr.getMinutes()}`;
    curr.setHours(0, 0, 0, 0);
    for(let i=0;i<activeShows.length;i++) {
      let showDate = activeShows[i].showDate;
      let isInFuture = showDate > curr || (showDate.getYear() == curr.getYear() && showDate.getMonth() == curr.getMonth() && showDate.getDate() == curr.getDate() && activeShows[i].startTime >= timeStr);
      if(!isInFuture) {
        await updateActiveShows(activeShows[i].showID);
      }
    }
    let results = await SearchDB(event.search);

    response = {
      statusCode: 200,
      shows: results
    };
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