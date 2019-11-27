var exphbs = require("express-handlebars");
var express = require("express");
var mysql = require("mysql");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "burgers_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// get all burgers from db
app.get("/", (req, res) => {
    connection.query("SELECT * FROM burgers", (err, data) => {
        if (err) {
            return res.status(500).end();
        }
        res.render("index", { burgers: data });
    });
});

//add a burger
app.post("/api/burgers", (req, res) => {
    connection.query("INSERT INTO burgers (burger_name) VALUES ?", [req.body.burger], function (
        err,
        result
    ) {
        if (err) {
            // If an error occurred, send a generic server failure
            return res.status(500).end();
        }

        // Send back the ID of the new burger
        res.json({ id: result.insertId });
    });
});

// devour a burger
app.delete("/api/burgers/:id",  (req, res) => {
    connection.query("DELETE FROM burgers WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            // If an error occurred, send a generic server failure
            return res.status(500).end();
        }
        else if (result.affectedRows === 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
        }
        res.status(200).end();

    });
});


app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});