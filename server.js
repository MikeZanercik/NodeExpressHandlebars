const exphbs = require("express-handlebars");
const express = require("express");
const mysql = require("mysql");

const app = express();

//Set up port
const PORT = process.env.PORT || 8080

app.use(expres.static("public"));

//express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "burgers_db"
});

connection.connect(function(err){
    if (err){
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});



app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});