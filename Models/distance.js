const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DistanceSchema = new Schema({
    source:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    distance:{
        type: Number,
        required: true
    },
    hits:{
        type: Number,
        required: true
    },
})
const distance = mongoose.model('Distance', DistanceSchema)
module.exports = distance