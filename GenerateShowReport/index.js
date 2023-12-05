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
      pool.query("SELECT * FROM Administrators WHERE authentication=?",[value], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows.length==1);
      });
    });
  };
  let GetShowInfo = () => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows", [], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data);
      });
    });
  };
  let GetNumSeats = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=?", [showID], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data.length);
      });
    });
  };
  let GetNumSeatsSold = (showID,section) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=? AND available=? AND seatSection=?", [showID,0,section], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data.length);
      });
    });
  };
  let GetBlockPrice = (showID,section) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT price FROM Blocks WHERE showID=? AND seatSection=?", [showID,section], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data[0].price);
      });
    });
  };
  
  let response = undefined;
  
  try {
    if(await checkAdmin(event.authentication)) {
      let shows = await GetShowInfo();
      for(let i=0;i<shows.length;i++) {
        let totalSeats = await GetNumSeats(shows[i].showID);
        let seatsSoldRight = await GetNumSeatsSold(shows[i].showID,"right");
        let seatsSoldCenter = await GetNumSeatsSold(shows[i].showID,"center");
        let seatsSoldLeft = await GetNumSeatsSold(shows[i].showID,"left");
        let totalProceeds = 0;
        if(shows[i].defaultPrice == -1) {
          //blocks
          totalProceeds = await GetBlockPrice(shows[i].showID,"right") * seatsSoldRight +  await GetBlockPrice(shows[i].showID,"left") * seatsSoldLeft +  await GetBlockPrice(shows[i].showID,"center") * seatsSoldCenter;
        } else {
          //defaultPrice
          totalProceeds = (seatsSoldRight+seatsSoldCenter+seatsSoldLeft) * shows[i].defaultPrice;
        }
        shows[i] = {
          "showID": shows[i].showID,
          "venueName": shows[i].venueName,
          "showName": shows[i].showName,
          "showDate": shows[i].showDate,
          "startTime": shows[i].startTime,
          "endTime": shows[i].endTime,
          "defaultPrice": shows[i].defaultPrice,
          "active": shows[i].active,
          "soldout": shows[i].soldout,
          "seatsSold": (seatsSoldCenter+seatsSoldLeft+seatsSoldRight),
          "seatsLeft": (totalSeats-(seatsSoldCenter+seatsSoldLeft+seatsSoldRight)),
          "totalProceeds":totalProceeds
        };
      }
      response = {
        statusCode: 200,
        body: shows
      };
    } else {
      response = {
        statusCode: 400,
        error: "Not authorized"
      };
    }
    
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