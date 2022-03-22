const mysql = require("mysql");
const config = require('_const/db.json');


const { host, port, user, password, database } = config.database;
const mysqlConnection = mysql.createConnection({ host, port, database, user, password, multipleStatements: true});

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connected*****");
  } else {
    console.log("Connection Failed");
  }
});

module.exports = mysqlConnection;