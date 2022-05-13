const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");

//require my initial function
const { initialQuestion } = require("./functions/initialQuestion.js");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

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

initialQuestion();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
