var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    register_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);