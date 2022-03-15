
var express = require("express");
var app = express();

app.listen(3000);

app.get("/", function(req, res){
    let res_string = "Hello World! <br>";

    for(let key in req.query){
        res_string += key + ": " + req.query[key] + "<br>";
    }

    res.send(res_string);
})

app.get("/:id", function(req,res){
    res.send("You sent the following id: " + req.params.id + "\n");
})

