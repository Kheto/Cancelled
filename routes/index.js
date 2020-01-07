var express = require("express");
var router = express.Router();
var data = require("../data/airtableaccess");
var https = require("https");

/* GET home page. */
router.get("/people/", function(req, res, next) {
  data.fetchPeople(function sendResponse(people) {
    res.render("people", { people: people });
  });
});

router.get("/people/:id", function(req, res, next) {
  data.fetchPerson(req.params.id, function sendResponse(person) {
    res.render("person", { person: person });
  });
});

router.get("/", function(req, res, next) {
  res.redirect("/search/");
});

router.get("/search/", function(req, res, next) {
  res.render("search");
});

router.get("/search/:str", function(req, res, next) {
  data.autoCompleteName(req.params.str, function(result) {
    res.json(result);
  });
});

router.get("/tweet/", function(req, res, next) {
  if (req.headers.tweeturl.indexOf("twitter.com") > -1) {
    getTweet(req.headers.tweeturl, response => {
      res.json(response);
    });
  } else {
    res.json({});
  }
});

function getTweet(url, callback) {
  https
    .get("https://publish.twitter.com/oembed?url=" + url, resp => {
      let data = "";

      // A chunk of data has been recieved.
      resp.on("data", chunk => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        callback(JSON.parse(data));
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
}

module.exports = router;
