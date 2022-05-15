//require all of the necessary packages
const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");

//require my initial function
const { initialQuestion } = require("./lib/initialQuestion.js");

// create the listening PORT using process environment variables or 3001
const PORT = process.env.PORT || 3001;
// create the app variable
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//console log the logo created through use of the asciiart-logo package
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

// run the initial function
initialQuestion();

// console that the server is active
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
