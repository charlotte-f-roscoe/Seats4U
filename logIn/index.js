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
    let checkVenueManager = (value) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Venues where venueManager = ?", [value], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            });
        });
    };
    let checkAdmin = (value) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Administrators where authentication = ?", [value], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            });
        });
    };

    let response = undefined;

    try {
        const vmAuth = await checkVenueManager(event.authentication);
        const adminAuth = await checkAdmin(event.authentication);
        if (vmAuth.length > 0) {
            response = {
                statusCode: 200,
                venueName: vmAuth[0].venueName,
                venueManager: vmAuth[0].venueManager,
                status: "user is a venue manager",
            };
        }
        else if (adminAuth.length > 0) {
            response = {
                statusCode: 200,
                adminAuth: adminAuth[0].authentication,
                status: "user is an administrator",
            };
        }
        else {
            response = {
                statusCode: 400,
                error: "User is not authorized "
            };
        }
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