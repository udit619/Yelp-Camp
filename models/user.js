var mongoose = require('mongoose');
var passportlocalmongoose = require('passport-local-mongoose');
mongoose.promise = global.promise;

var UserSchema = new mongoose.Schema({
    username:String,
    password:String
});

UserSchema.plugin(passportlocalmongoose);


module.exports = mongoose.model('User',UserSchema);