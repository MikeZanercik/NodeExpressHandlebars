const exphbs = require("express-handlebars");
const express = require("express");
const mysql = require("mysql");

const app = express();

//Set up port
const PORT = process.env.PORT || 8080

app.use(express.static("public"));

//express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "burgers_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

// get all burgers from db
app.get("/", (req, res) => {
    connection.query("SELECT * FROM burgers;", (err, data) => {
        if (err) {
            return res.status(500).end();
        }
        res.render("index", { burgers: data });
    });
});

//add a burger
app.post("/api/burgers", function (req, res) {
    connection.query("INSERT INTO burgers (burger_name) VALUES ?", [req.body.burgers], function (
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
app.delete("/api/burgers/:id", function (req, res) {
    connection.query("DELETE FROM burgers WHERE id = ?", [req.params.id], function (err, result) {
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