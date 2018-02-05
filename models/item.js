var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    votedBy: {
        type: Array
    },
    votes: {
        type: Number,
        default: 0
    }
})

var Item = mongoose.model('Item', itemSchema);

module.exports = {
    Item
}