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
    Workout.create(body)
    .then(dbWorkout =>
      res.json(dbWorkout))
    .catch(err => {
      res.json(err);
    });  
});

app.get("/api/workouts", (req, res) => {
  //console.log('hello')
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
  console.log(id)
  db.workouts.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, (err, data) => {
    let newExerciseArray = data.exercises;
    newExerciseArray.push(req.body);

    db.workouts.updateOne({
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        exercises: newExerciseArray
      }
    }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    })
  })
})

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/stats.html'))
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'));
  // db.collections.workouts.insertOne({}, (err, data) => {
  
  // })
});

//route that adds new exercise to db when user clicks add-another button in exercise.html

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
