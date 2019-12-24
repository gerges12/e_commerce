var express=require('express') ;
var router =express.Router();
const multer = require('multer');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var user = require("../models/user") ;


var config = require('../config');  


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null,file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

var item = require("../models/item") ;

router.post('/createitem' ,upload.single('productImage'),(req , res , next)=>{
    var n = req.body.name;
    var p = req.body.price;
    var dept = req.body.department;
    console.log("22022" , req.file) ;


    var productImage=req.file.filename  ; 
     var date = new Date() ;
     var descr = req.body.description ;
 
       item.create({
             
             "name": n ,
             "price":p ,
             "file":productImage ,
             "description":descr , 
             "department":dept
           },  function(err, item){
               if (err)
               res.status(500).json({message:err}) ;

               res.status(200).json({message:item}) ;
             
               
             }
         );
} )

router.get('/showitem'  ,verifyToken ,(req , res , next)=>{

  

    item.find().sort({ date: -1 }).
   exec(function (err, items) {
   // how to access to user who authenticated to sent
   //it with res.json
 if (err) return err;
 console.log("855555",req.user) ;

    res.status(200).json({message:items , user:req.user}) ;

});
} ) ;

router.put('/updata_item'  , (req , res , next)=>{
  item.findByIdAndUpdate(
    req.body._id,
    req.body,
    {new: true},
    
    (err, item) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({msg:item}) ;
    }
)

} )

router.put('/updataphoto'  , upload.single('productImage') , (req , res , next)=>{

console.log("hhh"  ,req.file)
console.log("hhh2"  ,req.body._id)

item.findOneAndUpdate({ _id: req.body._id }, {file:req.file.filename}, {
  new: true
} , (err, item) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({msg:item}) ;
    });

} )  

router.delete('/delete/:id' ,(req , res , next)=>{
 
    item.findOneAndRemove({_id:req.params.id},(err ,item )=>{
        if (err)
        res.status(500).json({message:err}) ;

        res.status(200).json({msg:item}) ;
    }) ;
} ) 

router.get('/showoneitem/:id' ,verifyToken ,(req , res , next)=>{
 
  item.findById(req.params.id,(err ,item )=>{
      if (err)
      res.status(500).json({message:err}) ;

      res.status(200).json({msg:item}) ;
  }) ;
} )

router.get('/showitemsbydepartment/:id' ,verifyToken ,(req , res , next)=>{
 
  item.find({department:req.params.id},(err ,items )=>{
      if (err)
      res.status(500).json({message:err}) ;

      res.status(200).json({msg:items}) ;
  }) ;
} )


router.get('/test' ,verifyToken ,(req , res , next)=>{
  res.status(200).json({msg:"fhghgh"}) ;

  
} )



router.delete('/delete_all' ,(req , res , next)=>{
 
  item.deleteMany({},(err ,item )=>{
      if (err)
      res.status(500).json({message:err}) ;

      res.status(200).json({msg:"all deleted"}) ;
  }) ;
} )



function verifyToken(req, res, next) {
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
    });
 next()
}


module.exports=router ;
