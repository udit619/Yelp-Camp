var mongoose = require('mongoose');
var Comment = require('./comment');

var campSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    },
        username:String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }
    ]
});

var camp = mongoose.model("camp",campSchema);

module.exports = camp;