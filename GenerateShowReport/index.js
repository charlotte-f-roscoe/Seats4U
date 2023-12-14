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
  let checkVenueManager = (venueName,venueManager) => {
    return new Promise((resolve, reject) => {
       pool.query("SELECT * FROM Venues WHERE venueName=? AND venueManager=?",[venueName,venueManager], (error, rows) => {
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
  let GetShowAtVenueInfo = (venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows WHERE venueName=?", [venueName], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data);
      });
    });
  };
  let GetSeats = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Seats WHERE showID=?", [showID], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data);
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
    let shows = {};
    if(await checkAdmin(event.authentication) || await checkVenueManager(event.venueName,event.authentication)) {
      if(event.venueName == "") {
        shows = await GetShowInfo();
      } else {
        shows = await GetShowAtVenueInfo(event.venueName);
      }
    } else {
      response = {
        statusCode: 400,
        error: "no authorization"
      };
      return response;
    }
    for(let i=0;i<shows.length;i++) {
      let seats = await GetSeats(shows[i].showID);
      let seatsSoldRight = 0;
      let seatsSoldCenter = 0;
      let seatsSoldLeft = 0;
      for(let j=0;j<seats.length;j++) {
        if(seats[j].seatSection == "right" && seats[j].available == 0) {
          seatsSoldRight++;
        } else if(seats[j].seatSection == "center" && seats[j].available == 0) {
          seatsSoldCenter++;
        } else if(seats[j].seatSection == "left" && seats[j].available == 0) {
          seatsSoldLeft++;
        }
      }
      let totalProceeds = 0;
      if(shows[i].defaultPrice == -1) {
        //blocks
        let blocks = await GetBlocks(shows[i].showID);
        totalProceeds = 0;
        for(let j=0;j<blocks.length;j++) {
          if(blocks[j].section == "right") {
            totalProceeds += (blocks[j].price*seatsSoldRight);
          } else if(blocks[j].section == "left") {
            totalProceeds += (blocks[j].price*seatsSoldLeft);
          } else {
            totalProceeds += (blocks[j].price*seatsSoldCenter);
          }
        }
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
        "seatsLeft": (seats.length-(seatsSoldCenter+seatsSoldLeft+seatsSoldRight)),
        "totalProceeds":totalProceeds
      };
      
      response = {
        statusCode: 200,
        body: shows
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