
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database : "tabibi"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected! ok");
  
     con.query("SELECT * FROM `rdv`", function (err, result) {
       if (err) throw err;
       console.log(result);
     });
});