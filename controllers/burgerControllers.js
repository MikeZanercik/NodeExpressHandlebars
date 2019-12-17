const express = require("express");
const router = express.Router();
const burger = require("../models/burgers.js");

//routes
router.get("/", function(req, res) {
  burger.all(function(data) {
   
     const burgers = data
    
    console.log(burgers);
    res.render("index", burgers);
  });
});

router.post("/api/burgers", function(req, res) {
  console.log(req.body)
  burger.create([
    "name"
  ], [
    req.body.name
  ], function(result) {
    res.json({ id: result.insertId });
  });
});

router.put("/api/burgers/:id", function(req, res) {
  const condition = "id = " + req.params.id;

  console.log("condition", condition);

  burger.update({
    devoured: req.body.devoured
  }, condition, function(result) {
    if (result.changedRows == 0) {
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

router.delete("/api/burgers/:id", function(req, res) {
  const condition = "id = " + req.params.id;

  burger.delete(condition, function(result) {
    if (result.affectedRows == 0) {
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

module.exports = router;
