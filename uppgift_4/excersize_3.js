
var express = require("express");
var SQL = require("mysql");

var app = express();
app.listen(3000);

app.get("/", function(req,res){
    let connection = SQL.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "test"
    });

    let key_arr = Object.keys(req.query);
    console.log(key_arr);
    let SQL_string = "SELECT * FROM users";
    
    for(let i = 0; i < key_arr.length; i++){
        let key = key_arr[i];
        if(key == "förnamn" || key == "efternamn"){
            SQL_string = "SELECT * FROM users WHERE " + key + "=" + "'" + req.query[key] + "'";
        }
    }
    console.log(SQL_string);
    let data_result = connection.query(SQL_string, function(err, result, fields){
        res.send(result);
    });
});

app.use(express.json());
app.post("/", function(req, res){
    if(!req.body.förnamn || !req.body.efternamn || !req.body.ålder){
        res.status(422).send("422 Unprocessable entity");
        return;
    }
    if(typeof(req.body.förnamn) != "string" || typeof(req.body.efternamn) != "string" || typeof(req.body.ålder) != "number"){
        res.status(422).send("422 Unprocessable entity");
        return;
    } 

    let sql_string = `INSERT INTO users (förnamn, efternamn, ålder) VALUES ('${req.body.förnamn}', '${req.body.efternamn}', ${req.body.ålder});
    SELECT LAST_INSERT_ID();`;
    console.log(sql_string);
    let connection = SQL.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "test",
        multipleStatements: true // OBS: måste tillåta att vi kör flera sql-anrop i samma query
    });
    
    connection.query(sql_string, function(err, result, fields){
        if(err){
            res.status(500).send("500 Internal Server error");
            throw err;
        }
        console.log(result);
        res.send(`Inserted at ID: ${result[0].insertId}\n`);
    });
});
