const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const path = require("path");

//defining which port to use
const PORT = process.env.PORT || 3000;

//requiring mongo model/schema
const Workout = require("./models/exerciseModel");

const databaseUrl = "workout";
const collections = ["workouts"];

//connecting to the mongo database
const db = mongojs(databaseUrl, collections);

//setting up express
const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

//create a new workout model from empty object, send json to front end where an empty document will be added to the collection
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

    //index of most recent workout
    let index = data.length-1;

    for(let i=0; i<data[index].exercises.length; i++) {
      console.log(data[index].exercises[i].duration)
      totalDuration += data[index].exercises[i].duration
    }
    
    //add total duration key value pair to data
    data[index].totalDuration = totalDuration;

    //handle errors, send data to front end (workout.js)
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  })
})

//finds workout with specific id
app.put("/api/workouts/:id", (req, res) => {
  db.workouts.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, (err, data) => {
    //add new exercise to that workout's exercise array
    let newExerciseArray = data.exercises;
    newExerciseArray.push(req.body);

    //update exercise array in database
    db.workouts.updateOne({
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        exercises: newExerciseArray
      }
    },
    //handle errors and return json data to front end (workout.js)
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    })
  })
})

//routes user to stats.html
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/stats.html'))
});

//finds all workouts in database, sends to front end (workout.js) in json format
app.get("/api/workouts/range", (req, res) => {
  db.workouts.find({}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  })
})

//routes user to exercise.html
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
