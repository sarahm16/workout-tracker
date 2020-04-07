const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    day: Date,
    exercises: [
        {
            type: {
                type: String,
                //required: true
            },
            name: {
                type: String,
                trim: true,
                //required: true
            },
            duration: {
                type: Number,
                // required: true
            },
            weight: {
                type: Number
            },
            reps: {
                type: Number
            },
            sets: {
                type: Number
            },
            distance: {
                type: Number
            }
        }
    ]

})

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;