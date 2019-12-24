var mongoose = require("mongoose") ;
var itemSchema = mongoose.Schema({
    name:{type:String} ,
    price:{type:String} ,
    department:{type:String} ,

    file:{type:String , require:true} ,
   date: {type: Date} ,
   description:{type:String}

}) ;



module.exports= mongoose.model('item' ,itemSchema )