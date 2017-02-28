var express= require('express');
var app=express();
var mongoose=require('mongoose');
var loginrouter=express.Router();
var products=require('./models/products_model');
var user=require('./models/user_model');
 var cookieParser = require('cookie-parser');
  var  expressSession = require('express-session');

var db=mongoose.connect('mongodb://admin:admin@ds117839.mlab.com:17839/heroku_hqt7r27m',function(err){
    if(err)
        {
            throw err;
        }
    else
        {
            console.log("mongodb connected succesfully");
        }
});
 var warnings={"existingEmail":"","wrongCredentials":""};
   
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

    



var port=8080;

app.use(expressSession({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
    store: new (require('express-sessions'))({
        storage: 'mongodb',
        instance: mongoose, // optional 
        host: 'localhost', // optional 
        port: 27017, // optional 
        db: 'EcommerceDatabase', // optional 
        collection: 'sessions', // optional 
        expire: 86400 // optional 
    })
}));
app.use(function(req, res, next){
    
  if(req.session.logedin|| req.session.userName){
      
  }
    else
        {
    req.session.logedin=false;
             req.session.userName="";
        }
    //res.locals.user = false;
  next();
});


app.use(express.static('public'));
app.use(express.static('src/views'));

app.set('views','./src/views');

/*app.set('views',__dirname);*/
app.use('/loginorsignup',loginrouter);
app.set('views','./src/views');
app.set('view engine','ejs');
loginrouter.route('/register')
.post(function(req,res)
       {
          var userDetails={
                "firstName":req.body.fname,
                 "lastName":req.body.lname,
    "emailId":req.body.email,
    "password":req.body.password,
    "mobilebno":req.body.mnumber

            }
      
        console.log(userDetails.firstName); 
    user.count({"emailId":userDetails.emailId},function(err,results)
          {
            console.log(results);
              var count=JSON.parse(results);
                 var data={
                "count":count
                 };
              
              if(count>0)
                   {  
                       res.json(data);
                 
                  }
              else
                  {
                       var users=new user(userDetails);
                users.save();
                      req.session.userName=userDetails.firstName+userDetails.lastName;
                      data.userDetails=userDetails;
                        req.session.logedin=true;
                      data.logedin=true;
                      console.log(data.userDetails);
                      console.log("username"+req.session.userName);
                      data.userName=req.session.userName;
                      req.session.userDetails=data.userDetails;
                res.json(data);
    
                      
                  }
            
          });
});

loginrouter.route('/login')
.post(function(req,res)
     {
        
        var loginDetails={
                "email":req.body.emailId.toLowerCase(),
                "password":req.body.password
        
        }
    
    
        user.count({"emailId":loginDetails.email}&&{"password":loginDetails.password},function(err,results)
         {   var count=JSON.parse(results);
          
            var data={
                "count":count,
                "logedin": req.session.logedin,
                
            };
          
           
        
           
            
              if(count>0)
                  {
                      
                    
                       user.find({"emailId":req.body.emailId.toLowerCase()},function(err,docs)
                                {
                           console.log(docs);
                           data.userDetails=docs[0];
                            console.log(data.userDetails);
                           req.session.userDetails=data.userDetails;
                      req.session.userName=data.userDetails.firstName+data.userDetails.lastName;
                     data.userName=req.session.userName;
                      console.log(req.session.userName);
                       req.session.logedin=true;
                      data.logedin=true;
                      res.json(data);
                   
                       });
                     
                  }
                  else
                      {
                          
                          res.json(data);
                      }
                     
        
            
          })
    
    
})
  
   
    
app.get('/productsdata',function(req,res)
        { 
        products.aggregate(
   [ { $sample: { size: 4 } } ],function(err,docs)
            {
                res.json(docs);
            }
)
            
        });

app.get('/refresh',function(req,res)
{  console.log(req.session.logedin);
    var data={
    "logedin":req.session.logedin,
        "userName":req.session.userName,
        "userDetails":req.session.userDetails
    };
 res.json(data);
//res.render('index');
});
app.post('/refresh',function(req,res)
{  console.log(req.session.logedin);
    var data={
    "logedin":req.session.logedin,
        "userName":req.session.userName,
        "userDetails":req.session.userDetails
    };
 res.json(data);
//res.render('index');
});
app.post('/logout',function(req,res)
{  req.session.logedin=false;
    req.session.userName="";
    var emailId=req.session.userDetails.emailId;
    
    var data={
    "logedin":req.session.logedin,
     "userName":req.session.userName  
    };
 user.update({ emailId:emailId},{
   $set: {
     "attocart":[]}},function(err,docs){});
  user.update(
   { emailId: emailId },
   { $push: { attocart: { $each: req.body.itemArray} } },function(err,docs){
       if(err)
           {
               console.log(err);
           }
       else
           {
               console.log(docs);
              
           }
       
       
   }
)
   user.update(
   { emailId: emailId },
   { $push: { wishlist: { $each: req.body.wishListArray} } },function(err,docs){
       if(err)
           {
               console.log(err);
           }
       else
           {
               console.log(docs);
              
           }
       
       
   }
)
 res.json(data);
//res.render('index');
});
app.post('/editprofile',function(req,res)
 { 
	
    
    var newdata={
        "password":req.body.password,
        "address":req.body.address,
        "mobilebno":req.body.mobilebno,
        "email":req.body.email
    };
    console.log(newdata);
  
user.update({ emailId:newdata.email },{
   $set: {
     "mobilebno":newdata.mobilebno,
       "password":newdata.password,
       "address":newdata.address
     }
    },function(err,updated){
     var data={
         "updated":false
     }
        if(err)
            {
                res.json(data);
            }
    else{
        data.updated=true;
        console.log(updated);
        res.json(data);
    }
});
});
app.get('/home',function(req,res)
       {
    console.log(" recvd req");
  
  products.find(function(err,docs)
  {
    console.log(docs);
      res.json(docs);
  });
    
});
app.post('/men',function(req,res)
 { console.log(res.locals.user+"localvariable");
	
    
    var category=req.body.category;
     
  products.find({$and:[{department:{$ne:"women"}},{category:{$eq:category}}]},function(err,docs)
  {
      res.json(docs);
  });
});
app.get('/men',function(req,res)
       {
    console.log(" recvd req");
  
  products.find({department:{$eq:"men"}},function(err,docs)
  {
    console.log(docs);
      res.json(docs);
  });
    
});
app.get('/women',function(req,res)
       {
    console.log(" recvd req");
  
  products.find({department:"women"},function(err,docs)
  {
    console.log(docs);
      res.json(docs);
  });
    
});
app.post('/women',function(req,res)
 { 
    console.log(req.body.category);
    var category=req.body.category;
     
  products.find({$and:[{department:{$ne:"men"}},{category:{$eq:category}}]},function(err,docs)
  {
    console.log(docs);
      res.json(docs);
  });
});
app.get('/electronics',function(req,res)
       {
    console.log(" recvd req");
  
  products.find({department:"electronics"},function(err,docs)
  {
    console.log(docs);
      res.json(docs);
  });
    
});
app.post('/electronics',function(req,res)
 { 
    console.log(req.body.category);
    var category=req.body.category;
     
  products.find({$and:[{department:{$eq:"electronics"}},{category:{$eq:category}}]},function(err,docs)
  {
    console.log(docs);
      res.json(docs);
  });
});
app.post('/search',function(req,res){
    req.session.searchedvalues=req.body.searchValue;
    var searchItem=req.body.searchValue;
     console.log("Search result "+req.session.searchedvalues);
  
    
  products.find( { $text: { $search:searchItem } },{ score: { $meta: "textScore" } }
).sort( { score: { $meta: "textScore" } } ).exec(function(err,docs){
      
        console.log(docs);
      res.json(docs);
    
  });
});
app.post('/placeorder',function(req,res){
    
    var emailId=req.session.userDetails.emailId;
    
    console.log("data"+req.body.itemArray);
    
    
    user.update(
   { emailId: emailId },
   { $push: { orders: { $each: req.body.itemArray} } },function(err,docs){
       if(err)
           {
               console.log(err);
           }
       else
           {
               console.log(docs);
               console.log("len "+req.body.itemArray.length);
               if(req.session.userDetails.orders==null)
               {req.session.userDetails.orders=[];
               }
               for(var i=0;i<req.body.itemArray.length;i++)
                   { console.log(req.session.userDetails);
                 
               req.session.userDetails.orders.push(req.body.itemArray[i]);
                   }
               var updated={"status":true};
               res.json({"status":true});
           }
       
       
   }
)
    
});

app.listen(process.env.PORT||5000,function(err)
{
	console.log("running server on port "+port);
	
}); 
