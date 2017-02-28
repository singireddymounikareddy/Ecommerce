var myApp=angular.module("myApp",['ngRoute','ngStorage']);
myApp.controller("myController",['$scope','$http','$location','$localStorage',function($scope,$http,$location,$localStorage){
    
     $http.get('/refresh').then(function(response)
        { //console.log(response.data.logedin);   
         var logedin=response.data.logedin;
         $scope.userName=response.data.userName;
          $scope.loginshow=!logedin;
    $scope.myaccountshow=logedin;
         $scope.userDetails=response.data.userDetails
           
        });
    $scope.product= $localStorage.productSpecific;
    $scope.size=$localStorage.prodSize;
  

  
                                                         
                                                         
        
     $scope.refreshProductPage=function(){
         if(typeof $scope.product !== 'undefined') 
             {
                 if($scope.product.department=="electronics")
            {
                $scope.pshow=false;
                $scope.phide=true;
                //console.log("electronics")
            }
        else{
            var array=Object.keys($scope.product.size);
           // console.log(array);
            $scope.size=array;
            
            $localStorage.prodSize=$scope.size;
            $scope.pshow=true;
            $scope.phide=false;
          //  console.log("other")
        }      
             }
     
     }  
        
        
     $scope.refreshProductPage();   
        
        
        
        
        
        
    
  /* $localStorage.wishLS=[];
    $localStorage.itemLS=[];*/
   
     $scope.subTotal=0;
    $scope.displayProduct=function(product)
    {//console.log("in displaypro");
        
        $scope.product=product;
        $localStorage.productSpecific= $scope.product;
       // $scope.product= $localStorage.productSpecific;
        if($scope.product.department=="electronics")
            {
                $scope.pshow=false;
                $scope.phide=true;
                //console.log("electronics")
            }
        else{
            var array=Object.keys($scope.product.size);
            //console.log(array);
            $scope.size=array;
            
            $localStorage.prodSize=$scope.size;
            $scope.pshow=true;
            $scope.phide=false;
           // console.log("other")
        }
        $location.path('/productpage');
    }
    
  
$scope.placeOrder=function()
    { 
        
        
        var data={"itemArray":$scope.itemArray};
       // console.log(data.itemArray);
        $http.post('/placeorder',data).then(function(response)
         {  
             if(response.data.status)
                 {
                       $localStorage.itemLS=[];
                     $scope.itemArray=[];
                     $scope.cartItems();
                     //console.log("in checkoutController");
                     $location.path('/yo');
                     
                 }
            else
                {
                     $location.path('/cartpage');
                }
            
        });
    
    };
  
     $scope.itemArray=$localStorage.itemLS||[];
    $scope.wishListArray=$localStorage.wishLS||[];
   // console.log($localStorage.wishLS+"---in wl");
    $scope.cartItems=function()
    {
         $scope.totalItemsInCart=0;
     for(var i=0;i<$scope.itemArray.length;i++)
        {
            $scope.totalItemsInCart=$scope.totalItemsInCart+$scope.itemArray[i].count;
            
        }
        return $scope.totalItemsInCart;
    }
   
    
    
        $scope.addItem=function(prodID,prodName,prodImage,prodPrice,prodQuantity,prodBrand,prodManufacturer)
    {
           // console.log(product);
   var itemIndex= $scope.isItemPresent(prodID,$scope.itemArray);
       // console.log(itemPresent);
           // console.log(itemIndex);
    if(itemIndex==-1)
        {
            
             $scope.itemArray.push({pid:prodID,pname:prodName,pimg:prodImage,pprice:prodPrice,pquantity:prodQuantity,pbrand:prodBrand,pmanufacturer:prodManufacturer,  count:1});
        }
        else
            {
                if($scope.itemArray[itemIndex].count<$scope.itemArray[itemIndex].pquantity)
                {
                ($scope.itemArray[itemIndex].count)++; 
               } 
            }
            
       //console.log($scope.itemArray);
        $scope.totalItemsInCart++;
        
       // console.log($scope.itemArray);
        
    };
   $scope.isItemPresent=function(productID,list)
    {
      var itemIndex=-1;
        for(var i=0;i<list.length;i++)
        {
           if(list[i].pid==productID)//
               {//console.log("in delispresent index");
                   itemIndex=i;
                  break;
                   
               }
          
        }
       //console.log(itemIndex+"itemprs index");
        return itemIndex;
    };
    $scope.subtotal=function()
    {$scope.sum=0;
        for(var index=0;index<$scope.itemArray.length;index++)
            {
              $scope.sum=$scope.sum+$scope.itemArray[index].pprice*$scope.itemArray[index].count; 
                
            }
    // console.log($scope.sum);
        return $scope.sum;
    }
    $scope.flag=false; 

   $scope.wishList=function(product,index)
  
  {
   
     $scope.flagSel= $scope.styleFlag(index); 


      var itemIndex=$scope.isItemPresent(product._id, $scope.wishListArray);
   
      if(itemIndex==-1)
          {
              
            $scope.wishListArray.push({pid:product._id,pname:product.productName,pbrand:product.brand,pmanufacturer:product.manufacturer,pimg:product.image,pprice:product.price,size:product.size,pquantity:product.quantity}) ; 
          }
      else
      {
           $scope.wishListArray.splice(itemIndex,1);
      }
      
  };
     $scope.styleFlag=function(index)
    {$scope.selectedIndex=index;
        if($scope.flag==false)
          {//console.log("in false if");
           //console.log($scope.flag);
              $scope.flag=true;
           //console.log($scope.flag);
          }
       else if($scope.flag==true){
         // console.log("in true if");
          $scope.flag=false;
      }
    return $scope.selectedIndex;    
        
    }; 

   // console.log($scope.itemArray);
  
  // $scope.wishListArray= $localStorage.wishLS;
  $scope.deleteProduct=function(product,arrayList)
  {
   
       
     var itemIndex= $scope.isItemPresent(product.pid,arrayList);
    
      
          arrayList.splice(itemIndex,1);
       //$localStorage.itemLS=$scope.itemArray;
      
      //console.log($scope.itemArray);
      
  };
    $localStorage.wishLS= $scope.wishListArray;
    $scope.logout=function()
    {
         var data={"itemArray":$scope.itemArray,
                  "wishListArray":$scope.wishListArray};
        $http.post('/logout',data).then(function(response)
                                 {
             var logedin=response.data.logedin;
             $scope.loginshow=!logedin;
            $scope.myaccountshow=logedin;
            $scope.emailid="";
            $scope.password="";
            $localStorage.itemLS=[];
            $scope.itemArray=[];
            
$location.path("/");
        });
    }
     
   
    $scope.search=function()
  {
        if($scope.searchitem)
        {
        $location.path("/search");
    //console.log($scope.searchitem);
      var data={
          "searchValue":$scope.searchitem
                }
         //console.log($scope.searchitem);
      $http.post("/search",data).then(function(res) {
          $scope.products=res.data;
          if($scope.products.length)
              {
                  $scope.notAvailable="";
                  $scope.searcitem="";
              }
          else
              {
                  $scope.notAvailable="Sorry We dont  have any Products with name - "+ $scope.searchitem ;
                   $scope.searcitem="";
              }
       })
        }
        else
            $location.path("/");
  };
    $scope.login=function()
    { $scope.warningmsg="";
     
        var data={
            "emailId":$scope.emailid,
            "password":$scope.password
        }
        //console.log(data);
        
        $http.post("/loginorsignup/login",data).then(function(res) {
            
          var count=res.data.count;
            var logedin=res.data.logedin;
           var userName=res.data.userName;
            //console.log(res.data.Details);
            //console.log(count);
            if(count>0)
                {// console.log(count);
                 
                    angular.element('#close').click();
                 $scope.userName=userName;
                 $scope.loginshow=!logedin;
                 $scope.myaccountshow=logedin;
                 $localStorage.itemLS=res.data.userDetails.attocart;
                 $scope.itemArray=$localStorage.itemLS;
                // console.log($scope.loginshow);
                  /*$scope.myaccuntshow="false";*/
                    $location.path("/homepage.html");
   
                }
            else{
                $scope.warningmsg="Invalid Credentials";
            }
       })
        
    }
    $scope.validateForm=function()
    {
         $scope.warningmsg="";
        
         if($scope.pswrd==$scope.cpswrd)
        {
              var data={
          "fname":$scope.fname,
                  "lname":$scope.lname,
                  "email":$scope.email,
                  "password":$scope.pswrd,
                  "mnumber":$scope.mnumber
      };
           // console.log(data.fname);
            
                  $http.post("/loginorsignup/register",data).then(function(res) {
          var count=res.data.count;
                      if(count>0)
                          {
                              $scope.warningmsg="Already Existing User";
                          }
                      else
                          {
                               angular.element('#close').click();
                            $scope.loginshow=false;
                              $scope.myaccountshow=true;
                              
                              $scope.userName=res.data.userName;
                            $scope.userDetails=res.data.userDetails;
                           $location.path("/homepage.html");
                          }
  
    

       })
            
           
	    }
        else
	    {
		  alert("Entered passwords didn't match");
            
	    }
    }
    $scope.range = function(count){

  var ratings = []; 

  for (var i = 0; i < count; i++) { 
    ratings.push(i) 
  } 

  return ratings;
}
  $scope.shippingCost=function()
    {$scope.shipCost=0;
      if($scope.sum<1000&&$scope.sum>0) 
          {
              
            $scope.shipCost=50;  
          }
        return $scope.shipCost;
    };
    $scope.total=function()
    {
        
      return $scope.subtotal()+$scope.shippingCost() ;  
        
    }; 
   
  

}]);

myApp.controller("homepageController",['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams){
    
    
    
     var databaseproducts=function()
    {
    $http.get('/productsdata').then(function(response)
        { 
            $scope.products=response.data;
        });
    };
    databaseproducts();
    
    
    
}]);
myApp.controller("searchController",['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams){
    
    
    
}]);

myApp.controller("catWomenController",['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams){
   var refresh=function(){
        var category=$routeParams.category;
       // console.log(category);
        if(category==null)
            {
     
     $http.get('/women').then(function(response)
        { // console.log("data recvd");                      
        $scope.products=response.data;
        });
            }
       else
           {
                var data={
                  "category":category  
                };
                 $http.post('/women',data).then(function(response)
            { // console.log("data recvd");                      
        $scope.products=response.data;
        });
           }
     
 } ; 
    
    refresh(); 
    $scope.range = function(count){

  var ratings = []; 

  for (var i = 0; i < count; i++) { 
    ratings.push(i) 
  } 

  return ratings;
}
    
}]);
myApp.controller("catMenController",['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams){
  
    
    var refresh=function(){
        var category=$routeParams.category;
        //console.log(category);
        if(category==null)
            {
                
            
       /* if($routeParams.category==null)
     */
    $http.get('/men').then(function(response)
        { // console.log("data recvd");                      
        $scope.products=response.data;
        });
            }
        else
            {
                var data={
                  "category":category  
                };
                 $http.post('/men',data).then(function(response)
            { // console.log("data recvd");                      
        $scope.products=response.data;
        });
            }
 } ; 
     $scope.range = function(count){

  var ratings = []; 

  for (var i = 0; i < count; i++) { 
    ratings.push(i) 
  } 

  return ratings;
}
    refresh();
    
    
    
}]);
myApp.controller("catElectronicsController",['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams){
  
    
                
            
    var refresh=function(){
      var category=$routeParams.category;
        //console.log(category);
        if(category==null)
            {
     $http.get('/electronics').then(function(response)
        { // console.log("data recvd");                      
        $scope.products=response.data;
        });
    }
    else
    {
         var data={
                  "category":category  
                };
                 $http.post('/electronics',data).then(function(response)
            { // console.log("data recvd");                      
        $scope.products=response.data;
        });
    }
     
 } ; 
     $scope.range = function(count){

  var ratings = []; 

  for (var i = 0; i < count; i++) { 
    ratings.push(i) 
  } 

  return ratings;
}
    refresh(); 
    
}]);
myApp.controller("yourorderController",['$scope','$http','$location','$routeParams','$localStorage',function($scope,$http,$location,$routeParams,$localStorage){
    $http.get('/refresh').then(function(response)
        { //console.log(response.data.logedin);   
         var logedin=response.data.logedin;
         $scope.userName=response.data.userName;
          $scope.loginshow=!logedin;
    $scope.myaccountshow=logedin;
      
         $scope.userDetails=response.data.userDetails
        
        }); 
    
    
    
}]);

myApp.controller("youraccountController",['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams){
    $http.get('/refresh').then(function(response)
        { //console.log(response.data.logedin);   
         var logedin=response.data.logedin;
         $scope.userName=response.data.userName;
          $scope.loginshow=!logedin;
    $scope.myaccountshow=logedin;
         $scope.userDetails=response.data.userDetails
        
        });
    $scope.saveNotification="";
     $scope.hideNum=false;
       $scope.showNum=true;
    $scope.changepasswordshow=false;
   $scope.changeNum=function()
   {
       $scope.hideNum=true;
       $scope.showNum=false;
   };
   $scope.validatePassword=function()
   {
       if($scope.password==$scope.userDetails.password)
           {
               $scope.changepasswordshow=true;
               
           }
       else{
           alert("Entered password didn't match");
            
       }
       
   };
    $scope.saveChanges=function()
    {
        var newdata={};
       // console.log($scope.userDetails.password);
       // console.log("here");
        //console.log(newdata);
        if($scope.newpassword==null)
            {
               var password=$scope.userDetails.password;
               // console.log(password);
                newdata.password=password;
               // console.log("here");
            }
        else{
        newdata.password=$scope.newpassword;
        }
        if($scope.newaddress==null)
            {
               newdata.address=$scope.userDetails.address;
            }
        else{
           newdata.address=$scope.newaddress;
        }
        if($scope.cmobileno==null)
            {
                newdata.mobilebno=$scope.userDetails.mobilebno;
            }
        else{
            newdata.mobilebno=$scope.cmobileno;
        }
        newdata.email=$scope.userDetails.emailId;
         $http.post('/editprofile',newdata).then(function(response)
         {  
             if(response.data.updated)
                 {
                     $scope.saveNotification="Changes Saved Succesfully";
                 }
        });
        
    }
    
}]);
myApp.controller("checkoutController",['$scope','$http','$location','$localStorage',function($scope,$http,$location,$localStorage){
   
    
    }]);
myApp.controller("cartpageController",['$scope','$http','$location','$localStorage',function($scope,$http,$location,$localStorage){
    $http.get('/refresh').then(function(response)
        { //console.log(response.data.logedin);   
         var logedin=response.data.logedin;
         $scope.loginCheck=logedin;
         $scope.userName=response.data.userName;
          $scope.loginshow=!logedin;
    $scope.myaccountshow=logedin;
         $scope.userDetails=response.data.userDetails
        
        });
   
 
        
        
    
    $scope.onclickCheckout=function()
    {
       
        if($scope.loginCheck)
        {
            if($scope.itemArray.length>0)
                {
            $location.path('/checkout'); 
                }
            else
                {
                      $location.path('/cartpage'); 
                }
        }
        else
            {
                 angular.element('#loginorsignup').click();
               // console.log("Please Login or signup");
            }
        
    }
    
    }]);

myApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'homepage.html',
			controller: 'homepageController'
		})
		.when('/cw', {
			templateUrl: 'categorywomenpage.html',
			controller: 'catWomenController'
		})
    .when('/cw/:category', {
			templateUrl: 'categorywomenpage.html',
			controller: 'catWomenController'
		})
     .when('/cm', {
			templateUrl: 'categorymenpage.html',
			controller: 'catMenController'
		}) 
    .when('/cm/:category', {
			templateUrl: 'categorymenpage.html',
			controller: 'catMenController'
		}) 
        .when('/search', {
			templateUrl: 'searchpage.html',
			controller: 'searchController'
		})
     .when('/electronics', {
			templateUrl: 'categoryelectronics.html',
			controller: 'catElectronicsController'
		}) 
    .when('/electronics/:category', {
			templateUrl: 'categoryelectronics.html',
			controller: 'catElectronicsController'
		}) 
    .when('/ya', {
			templateUrl: 'youraccount.html',
			controller: 'youraccountController'
		}) 
     .when('/yo', {
			templateUrl: 'yourorders.html',
			controller: 'yourorderController'
		}) 
    
     .when('/wishList', {
			templateUrl: 'wishListPage.html',
			controller: 'yourorderController'
		})
    
    .when('/checkout', {
			templateUrl: 'checkoutpage.html',
			controller: 'checkoutController'
		}) 
.when('/cartpage', {
			templateUrl: 'cartpage.html',
			controller: 'cartpageController'
		}) 
    .when('/productpage', {
			templateUrl: 'productPage.html',
			controller: 'myController'
		}) 
    
        

    
		.otherwise({
			redirectTo: '/'
		});
});

