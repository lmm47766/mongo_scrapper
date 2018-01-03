var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

var db = require("./models");


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;


if (process.env.MONGODB_URI) {

  mongoose.connect(process.env.MONGODB_URI);

} else {

  mongoose.connect("mongodb://localhost/mongo-scraper", {
    useMongoClient: true


  });
}
// Routes

app.get('/', function (req, res) {
    db.Flixster
    .find({})
    .then(function(dbFlixster) {
        res.render('index', {dbFlixster});
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/scrape", function(req, res) {
  
  axios.get("https://www.flixster.com/").then(function(response) {
    
    var $ = cheerio.load(response.data);
    var results = [];
    
    $('div.carousel-item').each(function(i, element) {

      var result = {};

      result.img = $(this).find('a').children('img').attr('src');
      result.title = $(this).find('.movie-title').text();
      result.link = $(this).find('a').attr('href');

      db.Flixster
        .create(result)
        .then(function() {
          res.end();
        })
        .catch(function(error) {
          res.json(error);
        });

    });
  });
});



app.post("/save", function(req, res) {

  db.Article
    .create({
      title: req.body.info.title,
      img: req.body.info.img,
      link: req.body.info.link
    }).then(function(result) {
      res.end();
    }).catch(function(err) {
      res.json(err);
    });

});

app.post("/delete", function(req, res) {

  db.Article
    .remove({
      title: req.body.info.title
    }).then(function(result) {
      res.end();
    }).catch(function(err) {
      res.json(err);
    });

});


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      res.render("saved", { dbArticle });
    })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {

  db.Article
    .findOne({
      _id: req.params.id
    })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });

});

// Route for saving/updating an Article's associated Note
app.post("/save/:id", function(req, res) {

  db.Note
    .create({
        body: req.body.info.body
      })
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {  note: dbNote._id  }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });

});

app.post("/del/:id", function(req, res) {

  db.Note
    .remove({
      _id: req.params.id
    }).then(function(result) {
      res.end();
    }).catch(function(err) {
      res.json(err);
    });

});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});