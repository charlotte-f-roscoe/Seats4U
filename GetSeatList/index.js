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
  let ValidShow = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows WHERE showID=?", [showID], (error, rows) => {
        if (error) { return reject(error); }
        if (rows && rows.length === 1) {
          return resolve(rows[0]);
        }
        else {
          return reject("Show does not exist");
        }
      });
    });
  };
  let GetSeatsRow = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=? AND available=? order by rowNum", [showID,1], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };
  let GetSeatsSection = (showID, section) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=? AND available=? AND seatSection=?", [showID, 1, section], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };
  let GetBlocks = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Blocks WHERE showID=?", [showID], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data);
      });
    });
  };
  
  let response = undefined;

  try {
    let seats = [];
    let show = await ValidShow(event.showID);
    let blocks = [];
    if(show.defaultPrice === -1) {
      blocks = await GetBlocks(event.showID);
    }
    if (event.sortBy === 'seatSection' || event.sortBy === 'price') {
      seats = (await GetSeatsSection(event.showID, 'left')).concat(await GetSeatsSection(event.showID, 'center')).concat(await GetSeatsSection(event.showID, 'right'));
    } else if (event.sortBy === 'rowNum') {
      seats = await GetSeatsRow(event.showID);
    } else {
      response = {
        statusCode: 400,
        error: `Cannot sort by ${event.sortBy}`
      };
      return response;
    }
    for (let i = 0; i < seats.length; i++) {
      let seatPrice = show.defaultPrice;
      if (seatPrice === -1) {
        let blockIndex = 0;
        while (seatPrice === -1 && blockIndex < blocks.length) {
          if (blocks[blockIndex].blockSection === seats[i].seatSection && blocks[blockIndex].startRow <= seats[i].rowNum && seats[i].rowNum <= blocks[blockIndex].endRow) {
            seatPrice = blocks[blockIndex].price;
          }
          blockIndex++;
        }
        if(seatPrice === -1) {
          response = {
            statusCode:400,
            error:"Cannot fetch prices"
          };
          return response;
        }
      }
      seats[i] = {
        location: [seats[i].rowNum, seats[i].colNum],
        section: seats[i].seatSection,
        price: seatPrice
      };
    }
    if(event.sortBy === 'price') {
      seats.sort((a, b) => b.price - a.price);
    }
    response = {
      statusCode: 200,
      body: seats
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