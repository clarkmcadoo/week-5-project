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
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "Unlimited Snow Cones",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
  })
);

const words = fs
  .readFileSync("/usr/share/dict/words", "utf-8")
  .toUpperCase()
  .split("\n"); //Imports library of words.
var chosenWordIndex = Math.floor(Math.random() * words.length); //Picks a random number from the library of words length.
var chosenWord = words[chosenWordIndex]; //generates random word.
var mysteryWord = chosenWord.split("");
var wordOnScreen = [];

for (i = 0; i < mysteryWord.length; i++) {
  wordOnScreen[i] = "_ ";
}

function changeDisplay(correctGuess, j) {
  wordOnScreen[j] = correctGuess;
}

var display = wordOnScreen.join(" ");

console.log(mysteryWord, wordOnScreen);

var correctGuess = [];
var wrongGuess = [];
var numberWrongGuessRemain = 10;

//ROUTES---------------------------------//

app.get("/", function(req, res) {
  res.render("index", {
    word: display,
    wrong: wrongGuess,
    number: numberWrongGuessRemain
  });
});

app.post("/", function(req, res) {
  var userGuess = req.body.guess.toUpperCase();

  if (typeof userGuess === "string" && userGuess.length === 1) {
    findTheMatch(userGuess);
  } else {
    res.redirect("/");
  }

  function findTheMatch(letter) {
    if (mysteryWord.indexOf(letter) == -1) {
      wrongGuess.push(letter);
      numberWrongGuessRemain = numberWrongGuessRemain - 1;
      res.redirect("/");
    } else {
      for (i = 0; i < mysteryWord.length; i++) {
        if (letter == mysteryWord[i]) {
          changeDisplay(letter, i);
        }
        //console.log(letter, wordOnScreen);
      }
      display = wordOnScreen.join(" ");
      res.redirect("/");
    }
  }
});

//LISTENER------------------------------//
app.listen(port, function(req, res) {
  console.log("Your mystery word app is running on port:", port);
});
