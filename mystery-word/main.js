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
session.generatedWord = chosenWord;
var mysteryWord = chosenWord.split("");
var wordOnScreen = [];

for (i = 0; i < mysteryWord.length; i++) {
  wordOnScreen[i] = "_ ";
}

function changeDisplay(correctGuess, j) {
  wordOnScreen[j] = correctGuess;
}

var display = wordOnScreen.join(" ");

console.log(mysteryWord, wordOnScreen, display);


var guessedLetter = [];
var numberWrongGuessRemain = 10;
var didYouWin;
var errorMessage;

//ROUTES---------------------------------//

app.get("/", function(req, res) {
  res.render("index", {
    word: display,
    wrong: guessedLetter,
    number: numberWrongGuessRemain,
    errorMessage: errorMessage
  });
});


app.post("/", function(req, res) {
  var userGuess = req.body.guess.toUpperCase();

  if (userGuess.length === 1 && userGuess.match(/[A-Z]/)) {
    findTheMatch(userGuess);
    var errorMessage = false;

  } else {
    errorMessage = true;
    res.redirect("/");
  }

  function findTheMatch(letter) {
    if (guessedLetter.indexOf(letter) >= 0){
      return res.redirect("/");
    }

    if (mysteryWord.indexOf(letter) == -1) {
      guessedLetter.push(letter);
      numberWrongGuessRemain = numberWrongGuessRemain - 1;
      res.redirect("/");
    } else {
      for (i = 0; i < mysteryWord.length; i++) {
        if (letter == mysteryWord[i]) {
          changeDisplay(letter, i);
        }
      }
      guessedLetter.push(letter);              
      display = wordOnScreen.join(" ");
      res.redirect("/");
    }
  }
});

//LISTENER------------------------------//
app.listen(port, function(req, res) {
  console.log("Your mystery word app is running on port:", port);
});
