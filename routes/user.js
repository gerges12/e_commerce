var express=require('express') ;
var router =express.Router();


var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');  

var user = require("../models/user") ;

router.post('/signup' ,async(req , res , next)=>{
var x;
  await user.findOne({email:req.body.email}, function(err,res){
      x=res;
    });

 if(x){
    res.status(500).json({message:"user exist"}) ;
 }

  else 
    user.create({
     firstname : req.body.firstname,
     lastname : req.body.lastname,
      password : bcrypt.hashSync(req.body.password, 8) ,
      email : req.body.email,
      phone : req.body.phone,
      city : req.body.city,
      gender : req.body.gender,
      date : req.body.date,
  },
    function (err, user) {
      if (err) 
      res.status(500).json({message:err}) ;

      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({ auth: true, token: token , user:user });
    }); 
      
 
} ) 





router.post('/signin' ,async(req , res , next)=>{
   user.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (!user.validPassword(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      } else {
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 
        });
        res.status(200).json({ auth: true, token: token , user:user });      }
    }
  });
  } ) 

  router.get('/showusers'   , (req , res , next)=>{

    user.find().
   exec(function (err, users) {
   
 if (err) return err;
    res.status(200).json({user:users}) ;

});
} ) ;

  

router.post('/addToBookmark' ,  verifyToken ,(req , res , next)=>{

   console.log("3",req.body) ;
   console.log("4",req.user) ;

   user.findByIdAndUpdate(
    req.user._id,
    {$push: {"bookmarks":req.body._id }}, 
    {new: true},
    function(err,user){
        if(err){
            res.json({error :err}) ; 
        }

        res.json({message:"like done" }) ;
   }); 


});
router.get('/bookmarks_shown' ,  verifyToken ,(req , res , next)=>{

  user.findById(req.user._id).
   populate("bookmarks").
   exec(function (err, user) {

 if (err) return err;
      res.json({message:user.bookmarks }) ;
      console.log()

});


});



 function  verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, config.secret)
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }

   user.findOne({_id:payload.id}, function(err,res){

    req.user =res;
    next()

    });
}
module.exports=router ;
