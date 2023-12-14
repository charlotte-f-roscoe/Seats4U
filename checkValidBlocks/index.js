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
  
  let response = undefined;
  
  try {
    await CheckVenueExists(event.venueName);
    let layout = await GetLayout(event.venueName);
    const blocks = event.blocks;
    for (let i = 0; i < blocks.length; i++) {
          await isBlockValid(blocks[i], layout);
          await isBlockOverlap(blocks, i);
    }
    response = {
      statusCode: 200,
      status: "blocks are valid"
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