var express = require("express") ;
var mongoose = require("mongoose") ;
var bodyParser=require('body-parser') ;
var cors= require("cors") ;
var path = require('path'); 


var http = require('http') ;

 
var app=express() ;

mongoose.connect('mongodb://localhost:27017/ecommersc' , { useNewUrlParser: true , useUnifiedTopology: true   }) ;

var port = process.env.port || 8081 ;
app.use(cors()) ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'uploads')));

var appRoutes = require('./routes/appRoutes') ;
var userRoutes = require('./routes/user') ; 


app.use('/',appRoutes) ;
app.use('/user',userRoutes) ; 


http.createServer(app).listen(port , function(){
    console.log("server listening") ;
}) ;