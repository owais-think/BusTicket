const mongoose = require('mongoose')

const BusUsersSchema = new mongoose.Schema({
    email:String,
    name: String,
    password:String,
    phnumber: Number,
    Authorize:
    {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('bususers', BusUsersSchema)