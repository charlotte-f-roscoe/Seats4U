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
  let CheckShowOverlap = (venueName, showDate, startTime, endTime) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Shows WHERE venueName=? AND showDate=?", [venueName, showDate], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.length >= 1)) {
          for (let i = 0; i < rows.length; i++) {
            if ((rows[i].startTime <= startTime && startTime < rows[i].endTime) || (rows[i].startTime < endTime && endTime <= rows[i].endTime)) {
              return reject("Show is overlapping with an existing show");
            }
          }
        }
        return resolve("Show does not overlap");
      });
    });
  };
  let CreateShow = (venueName, showName, showDate, startTime, endTime, defaultPrice, active, soldOut) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO Shows(venueName,showName,showDate,startTime,endTime,defaultPrice,active,soldOut) VALUES(?,?,?,?,?,?,?,?);", [venueName, showName, showDate, startTime, endTime, defaultPrice, active, soldOut], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.affectedRows == 1)) {
          return resolve("Show was created");
        }
        else {
          return reject(showName + " show could not be created");
        }
      });
    });
  };
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
  let GetShowID = (venueName, showName, showDate, startTime, endTime) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT showID FROM Shows WHERE venueName=? AND showName=? AND showDate=? AND startTime=? AND endTime=?", [venueName, showName, showDate, startTime, endTime], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data[0].showID);
      });
    });
  };
  let GetLayout = (venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Layouts WHERE venueName=?", [venueName], (error, data) => {
        if (error) { return reject(error); }
        return resolve(data[0]);
      });
    });
  };
  let CheckVenueExists = (value) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT venueName FROM Venues WHERE venueName=?", [value], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.length == 1)) {
          return resolve("venue exists");
        }
        else {
          return reject("venue does not exist");
        }
      });
    });
  };
  let isBlockValid = (block, layout) => {
    return new Promise((resolve, reject) => {
      if (block.section == "left" && block.rows[1] <= layout.leftRowNum) {
        return resolve("left good");
      }
      else if (block.section == "center" && block.rows[1] <= layout.centerRowNum) {
        return resolve("center good");
      }
      else if (block.section == "right" && block.rows[1] <= layout.rightRowNum) {
        return resolve("center good");
      }
      else {
        return reject("block too big");
      }
    });
  };
  let isBlockOverlap = (blocks, i) => {
    return new Promise((resolve, reject) => {
      for (let j = i + 1; j < blocks.length; j++) {
        let overlap = blocks[i].section == blocks[j].section && ((blocks[j].rows[0] <= blocks[i].rows[0] && blocks[i].rows[0] <= blocks[j].rows[1]) || ((blocks[j].rows[0] <= blocks[i].rows[1] && blocks[i].rows[1] <= blocks[j].rows[1])));
        if (overlap) {
          return reject("blocks " + i + "," + j + " overlapping");
        }
      }
      return resolve("no block overlap");
    });
  };
  let CreateBlocks = (showID, block) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO Blocks(showID,price,startRow,endRow,blockSection) VALUES(?,?,?,?,?)", [showID, block.price, block.rows[0], block.rows[1], block.section], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.affectedRows == 1)) {
          return resolve("block inserted");
        }
        else {
          return reject("block not inserted");
        }
      });
    });
  };
  let InsertSeat = (showID, section, row, col) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO Seats(showID,rowNum,colNum,seatSection,available) VALUES(?,?,?,?,?)", [showID, row, col, section, 1], (error, rows) => {
        if (error) { return reject(error); }
        if ((rows) && (rows.affectedRows == 1)) {
          return resolve("seat inserted");
        }
        else {
          return reject("seat not inserted");
        }
      });
    });
  };
  let CheckActiveDate = (date, active, startTime) => {
    return new Promise((resolve, reject) => {
      if (active == 0) { return resolve("Not activating"); }
      const timeZone = "America/New_York";
      let curr = new Date(new Date().toLocaleString('en-US', { timeZone }));
      let timeStr = `${curr.getHours()}${curr.getMinutes()}`;
      curr.setHours(0, 0, 0, 0);
      let showDate = new Date(Date.parse(date));
      let isInFuture = showDate > curr || (showDate.getYear() == curr.getYear() && showDate.getMonth() == curr.getMonth() && showDate.getDate() == curr.getDate() && startTime >= timeStr);
      if (isInFuture) {
        return resolve("show date is in future, can activate");
      }
      else {
        return reject("Show is in the past and cannot be activated");
      }
    });
  };
  let CheckBlockDefaultPrice = (defaultPrice, blocks) => {
    return new Promise((resolve, reject) => {
      if (defaultPrice == -1 && blocks.length == 0) {
        return reject("No defaultPrice or blocks set");
      }
      else if (defaultPrice != -1 && blocks.length != 0) {
        return reject("Cannot have a defaultPrice and blocks");
      }
      else if (defaultPrice == -1) {
        return resolve("using blocks");
      }
      else {
        return resolve("using defaultPrice");
      }
    });
  };
  let CheckBlocksCoverAll = (layout, blocks) => {
    return new Promise((resolve, reject) => {
      let rowsInLayout = layout.leftRowNum + layout.centerRowNum + layout.rightRowNum;
      let rowsInBlocks = 0;
      for (let i = 0; i < blocks.length; i++) {
        rowsInBlocks += blocks[i].rows[1] - blocks[i].rows[0] + 1;
      }
      if (rowsInBlocks == rowsInLayout) {
        return resolve("number of seats in blocks and layout equal");
      }
      else if (rowsInBlocks < rowsInLayout) {
        return reject("Blocks do not cover all seats");
      }
      else {
        reject("Should never be here blockSeats>layoutSeats");
      }
    });
  };

  let response = undefined;

  try {
    await CheckVenueExists(event.venueName);
    if (await checkAdmin(event.authentication) || await checkVenueManager(event.authentication, event.venueName)) {
      await CheckActiveDate(event.show.showDate, event.show.active, event.show.startTime);
      await CheckShowOverlap(event.venueName, event.show.showDate, event.show.startTime, event.show.endTime);
      const usingBlocks = "using blocks" === await CheckBlockDefaultPrice(event.show.defaultPrice, event.show.blocks);
      const layout = await GetLayout(event.venueName);
      const blocks = event.show.blocks;
      //check blocks
      if (usingBlocks) {
        for (let i = 0; i < blocks.length; i++) {
          await isBlockValid(blocks[i], layout);
          await isBlockOverlap(blocks, i);
        }
        await CheckBlocksCoverAll(layout, blocks);
      }
      await CreateShow(event.venueName, event.show.showName, event.show.showDate, event.show.startTime, event.show.endTime, event.show.defaultPrice, event.show.active, event.show.soldOut);

      const showID = await GetShowID(event.venueName, event.show.showName, event.show.showDate, event.show.startTime, event.show.endTime);
      //Create seats
      //left
      for (let r = 1; r <= layout.leftRowNum; r++) {
        for (let c = 1; c <= layout.leftColNum; c++) {
          await InsertSeat(showID, "left", r, c);
        }
      }
      //center
      for (let r = 1; r <= layout.centerRowNum; r++) {
        for (let c = 1; c <= layout.centerColNum; c++) {
          await InsertSeat(showID, "center", r, c);
        }
      }
      //right
      for (let r = 1; r <= layout.rightRowNum; r++) {
        for (let c = 1; c <= layout.rightColNum; c++) {
          await InsertSeat(showID, "right", r, c);
        }
      }
      //Create blocks
      for (let i = 0; i < blocks.length; i++) {
        await CreateBlocks(showID, blocks[i]);
      }
      let result = {
        "showID": showID,
        "showName": event.show.showName,
        "date": event.show.showDate,
        "startTime": event.show.startTime,
        "endTime": event.show.endTime,
        "defaultPrice": event.show.defaultPrice,
        "blocks": event.show.blocks,
        "active": event.show.active,
        "soldOut": event.show.soldOut,
        "venueManager": event.authentication
      };

      response = {
        statusCode: 200,
        body: result
      };
    }
    else {
      response = {
        statusCode: 400,
        error: "Not authorized"
      };
    }
  }
  catch (err) {
    console.log(err);
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