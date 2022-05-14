const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");

//require my initial function
const { initialQuestion } = require("./functions/initialQuestion.js");
const { response } = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

console.log(
  logo({
    name: "Employee Manager",
    font: "Speed",
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: "grey",
    logoColor: "bold-green",
    textColor: "green",
  }).render()
);

// let state = "start";
initialQuestion();

// function init() {
//   state = "start";
//   if (state == "start") {
//     state = "stop";
//     return initialQuestion();
//   }
// }

//initialize the app
// init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
