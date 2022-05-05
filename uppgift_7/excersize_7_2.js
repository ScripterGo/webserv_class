
const webtoken = require("jsonwebtoken");
var express = require("express");
var SQL = require("mysql");
var app = express();
const crypto = require("crypto");


const secret_key = "???";
const db_name = "test";
const table_name = "users_hashed";

app.listen(3000);
app.use(express.json());

function hash_str(str){
    if(typeof(str) != "string"){
        str = toString(str);
    }
    let new_hash = crypto.createHash("sha256");
    new_hash.update(str);
    return new_hash.digest("hex");
}

//token går ut om 2 timmar
function create_token(id, förnamn, efternamn){
    return webtoken.sign({id: id, förnamn: förnamn, efternamn: efternamn}, secret_key, {expiresIn: 2*60*60});
}

function authorize_request(req){
    let token = req.body.token;
    if(!token){
        return false;
    }
    try{
        var decoded = webtoken.verify(token, secret_key);
    }catch(err){
        return false;
    }
    return true;
}

app.get("/users", function(req,res){
    if(!authorize_request(req)){
        res.status(500).send("No authorization provided!"); return 1;
    }
    
    let connection = SQL.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: db_name
    });

    let key_arr = Object.keys(req.query);
    console.log(key_arr);
    let SQL_string = "SELECT * FROM " + table_name;
    
    for(let i = 0; i < key_arr.length; i++){
        let key = key_arr[i];
        if(key == "förnamn" || key == "efternamn"){
            SQL_string = `SELECT * FROM ${table_name} WHERE ` + key + "=" + "'" + req.query[key] + "'";
        }
    }
    console.log(SQL_string);
    let data_result = connection.query(SQL_string, function(err, result, fields){
        res.send(result);
    });
});

app.post("/", function(req, res){
    if(!req.body.förnamn || !req.body.efternamn || !req.body.ålder){
        res.status(422).send("422 Unprocessable entity");
        return;
    }
    if(typeof(req.body.förnamn) != "string" || typeof(req.body.efternamn) != "string" || typeof(req.body.ålder) != "number"){
        res.status(422).send("422 Unprocessable entity");
        return;
    }

    let sql_string = `INSERT INTO ${table_name} (förnamn, efternamn, ålder, password) VALUES ('${req.body.förnamn}', '${req.body.efternamn}', '${req.body.ålder}', '${hash_str(req.body.password)}');
    SELECT LAST_INSERT_ID();`;
    console.log(sql_string);
    let connection = SQL.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: db_name,
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

app.get("/login", function(req, res){
    let förnamn = req.body.förnamn;
    let efternamn = req.body.efternamn;
    let password = req.body.password;
    if(!förnamn || !efternamn || !password){
        response.status(422).send("422 Unprocessable"); return 1;
    }

    let connection = SQL.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: db_name
    });
    let sql_string = `SELECT * FROM ${table_name} WHERE förnamn = '${förnamn}' AND efternamn = '${efternamn}' AND password = '${hash_str(password)}';`

    let data_result = connection.query(sql_string, function(err, result, fields){
        console.log(result);
        if(result.length > 0){
            console.log("user login: ");
            res.status(200).send(create_token(result[0].id, result[0].förnamn, result[0].efternamn));
        }else{
            res.status(200).send("failed to login!");
        }
    });
});

app.put("/:id", function(req, res){
    let to_update_id = req.params.id;
    let to_update_förnamn = req.body.förnamn;
    let to_update_efternamn = req.body.efternamn;
    let to_update_ålder = req.body.ålder;
    let to_update_password = req.body.password;

    if(!(to_update_id && to_update_förnamn && to_update_efternamn && to_update_ålder)){
        res.status(422).send("422 Unprocessable entity");
        return;
    }
    
    let SQL_string = `
        UPDATE ${table_name}
        SET förnamn = '${to_update_förnamn}', efternamn = '${to_update_efternamn}', ålder = '${to_update_ålder}', password = '${hash_str(to_update_password)}';
        WHERE id = ${to_update_id};
    `
    let connection = SQL.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: db_name
    });

    connection.query(SQL_string, function(err, result, fields){
        if(err){
            res.status(500).send("500 Internal server error!");
            throw err;
        }
        res.status(200).send("Update was successfull!");
    });
});


