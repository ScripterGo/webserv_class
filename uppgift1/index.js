
const express = require("express");
const { json } = require("express/lib/response");
const fs = require("fs");
var mysql = require("mysql");
const { SHORT } = require("mysql/lib/protocol/constants/types");
const { stringify } = require("querystring");
const app = express();
app.listen(3000);

function get_string(obj){
    let s = "";
    s += obj["id"] + " ";
    s += "<br>";
    s += "name: " + obj["name"] + "<br>";
    s += "email: " + obj["email"] + "<br>";
    s += "homepage: " + obj["homepage"] + "<br>";
    s += "comment: " + obj["comment"] + "<br>";
    s += "time: " + obj["time"] + "<br>"
    s += "---------------------<br>";
    return s;
}

async function display_data(res){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "guest_book"
    });

    con.connect(function(err){
        if(err) throw err;
        console.log("Connected!");
        
        let sql_string = "SELECT* FROM _data";
        con.query(sql_string, function(err, result, fields){
            if(err) throw err;
            for(let i = 0; i < result.length; i++){
                res.write(get_string(result[i]));
            }
            console.log(result);
            return result;
        });
    
        con.end(function(err){
            if(err) throw err;
            console.log("Disconnected!");
        })
    });
}

async function db_update(name, email, homepage, comment){
    let connection = mysql.createConnection({
        host : "localhost",
        user : "root",
        password: "",
        database: "guest_book"
    });
    
    connection.connect(function(err){
        if(err) throw err;

        let sql_string = `INSERT INTO _data (name, email, homepage, comment, time) VALUES ('${name}', '${email}', '${homepage}', '${comment}', NOW());`; 
        connection.query(sql_string, function(err, result, fields){
            if(err) throw err;
            console.log("Submission successful!");
        })
    });
}

app.get("/", async function(req,res){
    fs.readFile("index.html", function(err, data){
        res.write(data);
        display_data(res)
    });
});

app.use(express.urlencoded({extended: true}));
app.post("/post-route", function(req, res){
    console.log(req.body);
    console.log(req.body["name"]);

    db_update(req.body["name"], req.body["email"], req.body["homepage"], req.body["comment"]);
    res.end(req.body["name"]);
})

