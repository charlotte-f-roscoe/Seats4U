const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

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

    let GetLayout = (venueName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Layouts where venueName = ?", [venueName], (error, rows) => {
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
        const auth = await checkVenueManager(event.authentication);
        const adminAuth = await checkAdmin(event.authentication);

        if (auth.length > 0) {
            const layout = await GetLayout(auth[0].venueName);
            response = {
                statusCode: 200,
                layout: layout,
            };
        }
        else if (adminAuth.length > 0) {
            const layout = await GetLayout(event.venueName);
            response = {
                statusCode: 200,
                layout: layout,
            };
        } else {
            response = {
                statusCode: 400,
                error: "User is not authorized venue manager "
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