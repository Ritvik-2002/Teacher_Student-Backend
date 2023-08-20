const pg = require('pg');
const dotenv = require('dotenv').config();


var conString = process.env.API 
var client = new pg.Client(conString);
client.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected");
    }
}
);


module.exports = client;