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
    let CheckShowOverlap = (venueName,showDate,startTime,endTime) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Shows WHERE venueName=? AND showDate=?", [venueName,showDate], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length >= 1)) {
                    for(let i=0;i<rows.length;i++) {
                        if((rows[i].startTime <= startTime && startTime < rows[i].endTime) || (rows[i].startTime < endTime && endTime <= rows[i].endTime)) {
                            return reject("Show is overlapping with an existing show");
                        }
                    }
                }
                return resolve("Show does not overlap");
            });
        });
    };
    let CreateShow = (venueName,showName,showDate,startTime,endTime,defaultPrice,active,soldOut) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Shows(venueName,showName,showDate,startTime,endTime,defaultPrice,active,soldOut) VALUES(?,?,?,?,?,?,?,?);", [venueName,showName,showDate,startTime,endTime,defaultPrice,active,soldOut], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.affectedRows == 1)) {
                    return resolve("Show was created");
                }
                else {
                    return reject(showName+" show could not be created");
                }
            });
        });
    };
    let checkAdmin = (value) => {
      return new Promise((resolve, reject) => {
           pool.query("SELECT * FROM Administrators WHERE authentication=?",[value], (error, rows) => {
              if (error) { return reject(error); }
              return resolve(rows.length==1);
          });
      });
    };
    let checkVenueManager = (authentication,venueName) => {
      return new Promise((resolve, reject) => {
           pool.query("SELECT * FROM Venues WHERE venueManager=? AND venueName=?",[authentication,venueName], (error, rows) => {
              if (error) { return reject(error); }
              return resolve(rows.length==1);
          });
      });
    };
    let GetShowID = (venueName,showName,showDate,startTime,endTime) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT showID FROM Shows WHERE venueName=? AND showName=? AND showDate=? AND startTime=? AND endTime=?", [venueName,showName,showDate,startTime,endTime], (error, data) => {
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
    let isBlockValid = (block,layout) => {
        return new Promise((resolve, reject) => {
            if(block.section == "left" && block.rows[1] <= layout.leftRowNum) {
                return resolve("left good");
            } else if(block.section == "center" && block.rows[1] <= layout.centerRowNum) {
                return resolve("center good");
            } else if(block.section == "right" && block.rows[1] <= layout.rightRowNum) {
                return resolve("center good");
            } else {
                return reject("block too big");
            }
        });
    };
    let isBlockOverlap = (showID,block) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Blocks WHERE showID=? AND blockSection=?", [showID,block.section], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length >= 1)) {
                    for(let i=0;i<rows.length;i++) {
                        if((rows[i].startRow <= block.rows[0] && block.rows[0] <= rows[i].endRow) || (rows[i].startRow <= block.rows[1] && block.rows[1] <= rows[i].endRow)) {
                            return reject("Block overlaps");
                        }
                    }
                }
                return resolve("no overlap in blocks");
            });
        });
    };
    let CreateBlocks = (showID,block) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Blocks(showID,price,startRow,endRow,blockSection) VALUES(?,?,?,?,?)",[showID,block.price,block.rows[0],block.rows[1],block.section], (error,rows) => {
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
    
    let response = undefined;
    
    try {
        await CheckVenueExists(event.venueName);
        if(await checkAdmin(event.authentication) || await checkVenueManager(event.authentication,event.venueName)) {
            await CheckShowOverlap(event.venueName,event.show.showDate,event.show.startTime,event.show.endTime);
            
            const layout = await GetLayout(event.venueName);
            //const seats = 0;
            /* !!!
            blocks need row layout test
            get layout
            make empty seats
            */
            
            await CreateShow(event.venueName,event.show.showName,event.show.showDate,event.show.startTime,event.show.endTime,event.show.defaultPrice,event.show.active,event.show.soldOut);
            
            const blocks = event.show.blocks;
            
            let showID = await GetShowID(event.venueName,event.show.showName,event.show.showDate,event.show.startTime,event.show.endTime);
            
            for(let i=0;i<blocks.length;i++) {
                await isBlockValid(blocks[i],layout);
                await isBlockOverlap(showID,blocks[i]);
                await CreateBlocks(showID,blocks[i]);
            }
            let result = {
                "showID": showID,
                "showName": event.show.showName,
                "date": event.show.showDate,
                "startTime": event.show.startTime,
                "endTime": event.show.endTime,
                "blocks": event.show.blocks,
                "active": event.show.active,
                "soldOut": event.show.soldOut,
                "venueManager": event.authentication
            };
            
            response = {
                statusCode: 200,
                body: result
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