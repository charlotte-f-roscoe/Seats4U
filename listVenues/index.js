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
    let GetVenues = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Venues", (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            });
        });
    };
    let checkAdmin = (value) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Administrators where authentication = ?", [value], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows.length);
            });
        });
    };
    let response = undefined;
    try {
        const auth = await checkAdmin(event.authentication);
        if (auth > 0) {
            let shows = await GetVenues();
            response = {
                statusCode: 200,
                shows: shows
            };
        }
        else {
            response = {
                statusCode: 400,
                error: "User not authorized administrator"
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