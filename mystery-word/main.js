const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 9999;
const app = express();
const fs = require("fs");

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: "Unlimited Snow Cones",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 600000}
}));

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n"); //Imports library of words.
var chosenWordIndex = (Math.floor(Math.random()*words.length)); //Picks a random number from the library of words length.
var chosenWord = words[chosenWordIndex]; //generates random word.
var mysteryWord = chosenWord.split("");

var guessingWord = chosenWord.replace(/\w/g, "_ ").split(" ");

var display = guessingWord.join(" ");



var correctGuess = [];
var wrongGuess = [];
var numberWrongGuessRemain = 10;


 


//ROUTES---------------------------------//

app.get("/", function(req, res){
    res.render("index", {word: display, wrong: wrongGuess, number: numberWrongGuessRemain});
    console.log(req.session);
})

app.post("/", function(req, res){
    wrongGuess.push(req.body.guess);
    res.redirect("/");
    console.log(wrongGuess);
})


//LISTENER------------------------------//
app.listen(port, function( req, res){
    console.log("Your mystery word app is running on port:", port);

})