var express=require('express');
var router=express.Router();


var routes = function(product)
{
   
    router.route('/electronics')
    .post(function(req,res){
        var prod=new product(req.body);
    prod.save();
    res.status(301).send(prod);
    })
    .get(function(req,res){
    var query={};
    if(req.query.productID)
        {
            query.productID=req.query.productID;
        }
    product.find(query,function(err,productModel){
      if(err){
          console.log("chaavu",err);
      }else{
          
    res.send(productModel);
    }
    });
           
           });
router.route('/electronics/:id')
.put(function(req,res){
    
    product.findById(req.params.id,function(err,productModel)
                    {
                        if(err)
                            res.status(301).send(err);
                        else
                            {
                                productModel.productName=req.body.productName;
                                productModel.productCategory=req.body.productCategory;
                                productModel.productID=req.body.productID;
                                productModel.price=req.body.price;
                            }
        res.json(productModel);
                            
        
    })
    
})
.get(function(req,res){
  
    product.findById(req.params.id,function(err,productModel){
      if(err){
          console.log("chaavu",err);
      }else{
          
    res.send(productModel);
    }
    });
      });

    return router;

    
};

module.exports=routes;