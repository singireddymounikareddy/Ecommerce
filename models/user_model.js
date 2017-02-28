var mongoose=require('mongoose');
var schema=mongoose.Schema;
var userdetailsModel=new mongoose.Schema({
firstName:{ type:String },
    lastName:{ type:String },
    emailId:{ type:String },
    password:{ type:String },
    mobilebno:{ type:Number},
     address:{ type:String },
        wishlist:[],
        orders:[],
        attocart:[],
       
},{ collection:'userDetails' });
module.exports=mongoose.model('user',userdetailsModel);
