var mongoose=require('mongoose');
var schema=mongoose.Schema;
var productsSchema=new mongoose.Schema({
productName:{type:String},
    department:{type:String},
    category:{type:String},
    brand:{type:String},
    size:{
          s:{type:Number},
            m:{type:Number},
            l:{type:Number},
          xl:{type:Number},
          xxl:{type:Number}
          },
    quantity:{type:Number},
    price:{type:Number},
    productDescription:{type:String},
    image:{type:String},
    manufacturer:{type:String},
    specifications:{type:String},
    rating:{type:Number},
    warrantyPeriod:{type:String},
    color:{type:String}
},{collection:'products'});
productsSchema.index( { productName: "text", productDescription: "text" ,brand: "text",category: "text",department: "text",manufacturer: "text"   } );
module.exports=mongoose.model('products',productsSchema);