var express = require('express');
var router = express.Router();
var data = require("../data/airtableaccess")

/* GET home page. */
router.get('/people/', function(req, res, next) {
  data.fetchPeople(function sendResponse(people){
    res.render("people", {people: people})
  })
});

router.get('/people/:id', function(req, res, next){
  data.fetchPerson(req.params.id, function sendResponse(person){
    console.log(person)
    res.render("person", {person: person})
  })
});

router.get("/", function(req, res, next){
  res.redirect("/search/");
})

router.get("/test", function(req, res, next){
  data.fetchPeople(function sendResponse(people){
    res.render("testview", {content: JSON.stringify(people)})
  })
})

router.get("/search/", function(req, res, next){
  res.render("search", {})
})

router.get("/search/:str", function(req, res, next){
  data.autoCompleteName(req.params.str, function(result){
    res.json(result);
  })
})

module.exports = router;
