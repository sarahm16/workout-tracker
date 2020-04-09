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
  //send all workouts from db to front end in json format
  db.workouts.find({}, (err, data) => {
    //loop through exercises in most recent workout, add total duration
    let totalDuration = 0;
    for(let i=0; i<data[0].exercises.length; i++) {
      totalDuration += data[0].exercises[i].duration
    }
    
    //add total duration key value pair to data
    data[0].totalDuration = totalDuration;

    //handle errors, send data to front end (workout.js)
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  })
})

app.put("/api/workouts/:id", (req, res) => {
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

app.get("/api/workouts/range", (req, res) => {
  db.workouts.find({}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  })
})

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
