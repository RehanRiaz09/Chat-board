const mongoose = require("mongoose")
const messageSchema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    room: {type: String, required: true,},
    content: {type: String, required: true,},
    timestamp: {type: Date, default: Date.now}
})
module.exports = mongoose.model("Message", message)