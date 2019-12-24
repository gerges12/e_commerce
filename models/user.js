var mongoose = require("mongoose") ;
var bcrypt = require('bcrypt-nodejs') ;

var Schema = mongoose.Schema ;


var userSchema = mongoose.Schema({
    firstname:{type:String, require: true} ,
    lastname:{type:String, require: true} ,

    email:{type:String, require: true} ,
    password:{type:String, require: true} ,
    phone:{type:Number, require: true} ,
    city:{type:String, require: true} ,  
    gender:{type:String, require: true} ,   
    date: {type: Date} ,
    bookmarks:[{ type: Schema.Types.ObjectId , ref:'item'} ],


 

}) ;

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password,this.password) ;
} ;

module.exports= mongoose.model('user' ,userSchema )