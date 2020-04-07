const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

const Workout = require("./models/exerciseModel");

const databaseUrl = "workout";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.put("/api/exercise/?", ({body}, res) => {
  res.json(body);
  //code that finds most recent workout from database
  //populates fields with that data
})

app.post("/api/workouts", ({body}, res) => {
  console.log(body);
});

app.get("/api/workouts", (req, res) => {
  console.log('hello')
  //send all workouts from db to front end in json format
  db.workouts.find({}, (err, data) => {
    console.log(data)
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  })
})

app.put("/api/workouts/:id", (req, res) => {
  let id = req.params.id;
  
})

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/stats.html'))
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'));
});

app.post("/exercise", (req, res) => {
  Workout.create(req.body)
    .then(dbWorkout => 
      res.json(dbWorkout))
    .catch(err => {
      res.json(err);
    });
})

//route that adds new exercise to db when user clicks add-another button in exercise.html

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
