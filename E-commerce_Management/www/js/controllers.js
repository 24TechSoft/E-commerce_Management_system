var app = angular.module('abad.controllers', []);
var device_id = '1001';

$(document).on("click", ".incr-btn", function (e) {
  var $button = $(this);
  var oldValue = $button.parent().find('.quantity').val();
  $button.parent().find('.incr-btn[data-action="decrease"]').removeClass('inactive');
  if ($button.data('action') == "increase") {
      var newVal = parseFloat(oldValue) + 1;
  } else {
      // Don't allow decrementing below 1
      if (oldValue > 1) {
          var newVal = parseFloat(oldValue) - 1;
      } else {
          newVal = 1;
          $button.addClass('inactive');
      }
  }
  $button.parent().find('.quantity').val(newVal);
  e.preventDefault();
});
$(document).on('change', '.quantity', function(){
  var str = $(this).prop('id');
  var id = str.split('_');
  var package = JSON.parse($(this).val());
  $('#price_'+id[1]).text(package.Price);
  $('#itemPackage_'+id[1]).text(package.PackageName);
  //console.log(package);
});

$(document).on('change', '.quantity2', function(){
  var str = $(this).prop('id');
  var id = str.split('_');
  var package = JSON.parse($(this).val());
  $('#price2_'+id[1]).text(package.Price);
  $('#itemPackage2_'+id[1]).text(package.PackageName);
  //console.log(package);
});

app.controller('WelcomeController', function($scope,$location,$ionicLoading){
  $scope.$on('$ionicView.enter', function(){
    $ionicLoading.show();
    $location.path('app/home');
  });
});

app.controller('MenuController', function(DataService,sharedCartService,$scope,$ionicScrollDelegate,$timeout,$location,$cordovaSQLite,$ionicPopup,$cordovaDevice) {
  $scope.data = [];
  var _this = this;
  var cart = sharedCartService.cart;
  $scope.data=["JavaScript","Java","Ruby","Python"];

   
   $scope.scrollFunction = function(event){
    if($ionicScrollDelegate.getScrollPosition().top > 260){
      $('#foot-menu').fadeOut();
      $('#float-cart').fadeIn();
    }else{
      $('#foot-menu').fadeIn();
      $('#float-cart').fadeOut();
    }
  };

  $scope.scrollb = function() {
    $timeout(function () {
       $scope.scrolling = false;         
    });
  };

   $scope.$on('$stateChangeSuccess', function () {
      
      document.addEventListener('deviceready', function () {
        device_id = $cordovaDevice.getUUID();
      }, false);

      $scope.cart=sharedCartService.cart;
      $scope.total_qty=sharedCartService.total_qty;
      $scope.total_amount=sharedCartService.total_amount;
      DataService.getCart(device_id).then(function(res){
        // console.log(res.data);
        // alert(res.data.length);
        var tot_amt = 0;
        for(var i=0; i<res.data.length; i++){
          tot_amt+=parseFloat(res.data[i].TotalPrice);
          cart.get(res.data[i].ID,res.data[i].ItemID,res.data[i].Photo,res.data[i].ItemName,res.data[i].ItemPackage,res.data[i].Price,res.data[i].PackageQuantity,res.data[i].Quantity);
        }
        $scope.total_qty=res.data.length;
     
        $scope.total_amount=tot_amt;

      });
    });

  //getting Categories.....................................
  DataService.getCategories().then(function(res){
    $scope.categories = res.data;
    console.log(res);
  });

  $scope.profile = function(){
    var query = 'SELECT first_name, username FROM registration';
      
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      var len = res.rows.length;
      if(len > 0){
         $location.path('/app/profile');
      }else{
         $location.path('/app/login');
      }
    });
  }

  $scope.showCart = function(){
    $location.path('/app/cart');
  }

  $scope.orderPreview = function(){
    // var query = 'SELECT first_name, username FROM registration';
      
    // $cordovaSQLite.execute(db, query, []).then(function(res) {
    //   var len = res.rows.length;
    //   if(len > 0){
        $location.path('/app/order/preview');
      //  }else{
      //    $location.path('/app/login');
      // }
    // });
  }

  $scope.updateAddress = function(){
    var query = 'SELECT first_name, username FROM registration';
      
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      var len = res.rows.length;
      if(len > 0){
        alert(res.rows.item);
        $location.path('/app/address/update');
      }else{
         $location.path('/app/login');
      }
    });
  }

  $scope.logout = function(){
    var query = 'DELETE FROM registration';

    $cordovaSQLite.execute(db, query).then(function(res) {
      var alertPopup = $ionicPopup.alert({
                   title: 'Logout',
                   template: 'Successfully logout'
                 });
                 alertPopup.then(function(res) {
                   $location.path('/app/home');
                });
    });
  }

  $scope.getEditAddress = function(addressID,address1,address2,location,city,state,pin,phone,contactPerson){
    $location.path('app/address/update/'+addressID);
    $scope.data.addressID=addressID;
    $scope.data.address1=address1;
    $scope.data.address2=address2;
    $scope.data.location=location;
    $scope.data.city=city;
    $scope.data.state=state;
    $scope.data.pin=pin;
    $scope.data.phone=phone;
    $scope.data.contactPerson=contactPerson;

   }

});

app.controller('HomeController', function(DataService,$scope,$ionicLoading){
  $scope.data = [];
  var _this = this;
  $scope.$on('$ionicView.enter', function(){
    //Getting the Categories..........................

    DataService.getCategories().then(function(res){
      //console.log(res);
      $scope.categories = res.data;
      $ionicLoading.hide();
    });

    //Getting the Items...............................
    DataService.getHotItems().then(function(res){
      //console.log(res);
      _this.hotItems = res.data;
      _this.hotcnt = 5; 
      $ionicLoading.hide();
    });

    DataService.getRecentItems().then(function(res){
      //console.log(res);
      _this.recentItems = res.data;
      _this.recentcnt = 5; 
      $ionicLoading.hide();
    });
  });

});

app.controller('SupportController', function($scope, $ionicPopup){
  $scope.makeCall = function(){
  var alertPopup = $ionicPopup.confirm({
               title: '24 X 7 Support',
               template: 'Call DigitalPacemaker at 9090987878?',
             }).then(function(res){
                if(res){
                  console.log('Your Call is connecting.....');
                  alert('Your Call is connecting.....');
                }
             });
  };
});

app.controller('LoginController', function(LoginService, $scope, $location,$cordovaSQLite,$ionicLoading){
  $scope.data = [];
  
  $scope.login = function(){
    $ionicLoading.show();
    var userid    = $scope.data.userid;
    var password  = $scope.data.password;
    var flag      = true;

    if(userid == undefined || password == undefined){
      document.getElementById('error-msg-error').style.display = 'block';
      flag = false;
    }
    if(flag){
      LoginService.login(userid, password).then(function(response){
        if(response.data.length == 1){
            var query = 'SELECT first_name, username FROM registration where username=?';
    
            $cordovaSQLite.execute(db, query, [userid]).then(function(res) {
            var len = res.rows.length;
            if(len > 0){
               $ionicLoading.hide();
               $location.path('app/home');
            }else{
               LoginService.login(userid, password).then(function(response){
                if(response.data.length == 1){
                var query = "INSERT INTO registration(id,first_name,last_name,email,phone,username,address,pin) VALUES (?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query, [response.data[0].ID,response.data[0].Name,response.data[0].Name,response.data[0].Email,response.data[0].PhoneNo,response.data[0].UserID,response.data[0].Address,response.data[0].PinCode]).then(function(res){
                  $ionicLoading.hide();
                  $location.path('app/home');
                },
                function(err){
                  alert('insert error');
                });
                }
              });
             }
            }, 
            function (err) {
            alert('select error');
            });
          }
      });
    }
  }
  $scope.hideError = function(name){
      document.getElementById('error-msg-'+name).style.display = 'none';
  }
  
});

app.controller('RegistrationController', function(RegistrationService,$scope,$ionicPopup,$location){

  $scope.getDuplicateEmail = function(){
    RegistrationService.getDuplicateEmail($scope.data.email).then(function(response){
      if(response.data.Error == '1'){
         document.getElementById('error-msg-email').style.display = 'block';
         document.getElementById('error-msg-email').innerHTML = "*Email already exist!";
       }
    })
  };

  $scope.getDuplicatePhone = function(){
    RegistrationService.getDuplicatePhone($scope.data.phone).then(function(response){
      if(response.data.Error == '1'){
         document.getElementById('error-msg-phone').style.display = 'block';
         document.getElementById('error-msg-phone').innerHTML = "*Phone number already exist!";
       }
    })
  };

  $scope.getDuplicateUserID = function(){
    RegistrationService.getDuplicateUserID($scope.data.username).then(function(response){
      if(response.data.Error == '1'){
         document.getElementById('error-msg-username').style.display = 'block';
         document.getElementById('error-msg-username').innerHTML = "*Username already exist!";
       }
    })
  };

  $scope.signup = function(){
    var fname     = $scope.data.first_name;
    var lname     = $scope.data.last_name;
    var email     = $scope.data.email;
    var phone     = $scope.data.phone;
    var password  = $scope.data.password;
    var cpassword = $scope.data.password_confirmation;
    var username  = $scope.data.username;
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var flag    = true;

    if(fname == undefined){
      document.getElementById('error-msg-fname').style.display = 'block';
      flag = false;
    }

    if(fname == undefined){
      document.getElementById('error-msg-lname').style.display = 'block';
      flag = false;
    }

    if(email == undefined){
      document.getElementById('error-msg-email').style.display = 'block';
      flag = false;
    }else if(!email.match(EMAIL_REGEXP)){
      document.getElementById('error-msg-email').style.display = 'block';
      document.getElementById('error-msg-email').innerHTML = '*Email is not valid!';
      flag = false;
    }

    if(phone == undefined){
      document.getElementById('error-msg-phone').style.display = 'block';
      flag = false;
    }

    if(username == undefined){
      document.getElementById('error-msg-username').style.display = 'block';
      flag = false;
    }

    if(password == undefined){
      document.getElementById('error-msg-password').style.display = 'block';
      flag = false;
    }else if(password != cpassword){
      document.getElementById('error-msg-mismatch').style.display = 'block';
      flag = false;
    }
    if(flag){
      RegistrationService.register(fname, lname, username, email, phone, password).then(function(res){
        if(res.data.Error == '0'){
          var alertPopup = $ionicPopup.alert({
                   title: 'Success',
                   template: res.data.Message
                 });
                 alertPopup.then(function(res) {
                   $scope.data.first_name = "";
                   $scope.data.last_name = "";
                   $scope.data.email = "";
                   $scope.data.phone = "";
                   $scope.data.username = "";
                   $scope.data.password = "";
                   $scope.data.password_confirmation = "";
                   $location.path('/app/login');
                });
        }
        else{
          var alertPopup = $ionicPopup.alert({
                   title: 'Fail',
                   template: res.data.Message
                 });
                 alertPopup.then(function(res) {
                  
                 });
        }
      });
    }
  }

  $scope.hideError = function(name){
      document.getElementById('error-msg-'+name).style.display = 'none';
  }
  
});

app.controller('ProductController', function(DataService,sharedCartService,$scope,$ionicLoading,$stateParams,$http,$cordovaDevice){
  
  //global variable shared between different pages. 
  var cart = sharedCartService.cart;

  document.addEventListener('deviceready', function () {
      device_id = $cordovaDevice.getUUID();
    }, false);

  $ionicLoading.show();
  $scope.data = [];
  var _this = this;

  $scope.numberOfItemsToDisplay = 5; // number of item to load each time

  $scope.addMoreItem = function(done) {
    if ($scope.items.length > $scope.numberOfItemsToDisplay)
      $scope.numberOfItemsToDisplay += 5; // load 20 more items
      $scope.$broadcast('scroll.infiniteScrollComplete');
    
  }

  $scope.$on('$ionicView.enter', function(){
   
    //getting Items By Category...................................
    DataService.itemsByCategory($stateParams.id).then(function(res){
      console.log(res.data);
      _this.cnt = res.data.length;
      $scope.items = res.data;

      $ionicLoading.hide();
    });

    //getting Category Name.......................................
    DataService.getCategoryName($stateParams.id).then(function(res){
      _this.catName = res.data[0];
      $ionicLoading.hide();
    });


  });

  //show product page
  $scope.showProductInfo=function (id,desc,img,name,price) {  
    // we use session to store details about the current product displayed in the product page
     sessionStorage.setItem('product_info_id', id);
     sessionStorage.setItem('product_info_desc', desc);
     sessionStorage.setItem('product_info_img', img);
     sessionStorage.setItem('product_info_name', name);
     sessionStorage.setItem('product_info_price', price);
     
     // used to move to a different page 
     window.location.href = "#/page13";
   };
 
   //add to cart function
   $scope.addToCart=function(id,image,name){
    // function cart.add is declared in services.js
    var package = JSON.parse(document.getElementById('package_'+id).value);
    var packageQty = document.getElementById('quantity_'+id).value;
    console.log(package);
    console.log(packageQty);
    var pack_name=$('#itemPackage_'+id).text();
   
    var price=document.getElementById('price_'+id).innerHTML;

    cart.add(id,image,name,pack_name,price,packageQty,packageQty*package.Quantity);
  
    cart.productAlreadyExist($scope.data.id);
    $scope.pid=sharedCartService.pid;
    $scope.total_qty=sharedCartService.total_qty;
    DataService.addToCart(device_id,id,name,package.PackageName,packageQty,package.Price,packageQty*package.Quantity).then(function(res){
      console.log(res.data);
    });

   };


   $scope.getItemPrice = function(data){
    console.log(data);
   }
});

app.controller('ProductSingleController', function(DataService,sharedCartService,$scope,$ionicLoading,$stateParams){
  $ionicLoading.show();
  var _this = this;
  $scope.data = [];
  var cart = sharedCartService.cart;

   $scope.$on('$ionicView.enter', function(){
    DataService.getItem($stateParams.id).then(function(res){
      $ionicLoading.hide();
      _this.item = res.data[0];
      console.log(res);
    });
   });

   //add to cart function
   $scope.addToCart=function(id,image,name){
    // function cart.add is declared in services.js
    var package = JSON.parse(document.getElementById('package2_'+id).value);
    var packageQty = document.getElementById('quantity2_'+id).value;
    // console.log(package);
    // console.log(packageQty);
    var pack_name=$('#itemPackage2_'+id).text();
   
    var price=document.getElementById('price2_'+id).innerHTML;

    cart.add(id,image,name,pack_name,price,packageQty,packageQty*package.Quantity);
  
    cart.productAlreadyExist($scope.data.id);
    $scope.pid=sharedCartService.pid;
    $scope.total_qty=sharedCartService.total_qty;
    DataService.addToCart(device_id,id,name,package.PackageName,packageQty,package.Price,packageQty*package.Quantity).then(function(res){
      console.log(res.data);
    });

   };
  
});

app.controller('CartController', function(DataService,$scope,sharedCartService,$ionicPopup,$state,$cordovaSQLite,$cordovaDevice,$ionicLoading){
    $ionicLoading.show();
    var cart = sharedCartService.cart;
    $scope.$on('$stateChangeSuccess', function () {
      document.addEventListener('deviceready', function () {
        device_id = $cordovaDevice.getUUID();
      }, false);

      DataService.getPreviousAddresses(32).then(function(res){
        $scope.noOfAddress =  res.data.length;
        $scope.addresses = res.data[0];
      })

      $scope.cart=sharedCartService.cart;
      console.log($scope.cart);
      $scope.total_qty=sharedCartService.total_qty;
      $scope.total_amount=sharedCartService.total_amount;
      DataService.getCart(device_id).then(function(res){
              
        var tot_amt = 0;
        for(var i=0; i<res.data.length; i++){
          console.log(res.data[i].ItemID);
          tot_amt+=parseFloat(res.data[i].TotalPrice);
          cart.get(res.data[i].ID,res.data[i].ItemID,res.data[i].Photo,res.data[i].ItemName,res.data[i].ItemPackage,res.data[i].Price,res.data[i].PackageQuantity,res.data[i].Quantity);
        }
        $scope.total_qty=res.data.length;
        
        $scope.total_amount=tot_amt;
        $ionicLoading.hide();
      });
    });
    //remove function
    $scope.removeFromCart=function(c_id,id,qty){

      DataService.removeFromCart(id,qty).then(function(res){
          console.log(res.data);
      });
      $scope.cart.drop(c_id);  // deletes the product from cart. 
      
      // dynamically update the current $scope data.
      $scope.total_qty=sharedCartService.total_qty;
      $scope.total_amount=sharedCartService.total_amount;
      
    };
    
    // increments the qty
    $scope.inc=function(c_id,package,packqty,qty,price){
      // console.log(qty+' / '+packqty);
      // console.log(qty/packqty);
      var q=qty/packqty;
      DataService.addItemToCart(device_id,c_id,package,1,q,price).then(function(res){
        console.log(res.data);
      });
      $scope.cart.increment(c_id);
      $scope.total_qty=sharedCartService.total_qty;
      $scope.total_amount=sharedCartService.total_amount;
    };
    
    // decrements the qty
    $scope.dec=function(c_id,id,qty){
      if(qty>1){
        DataService.removeFromCart(id,1).then(function(res){
          console.log(res.data);
        });
      }
      $scope.cart.decrement(c_id);
      $scope.total_qty=sharedCartService.total_qty;
      $scope.total_amount=sharedCartService.total_amount;
    };
    
    $scope.checkout=function(){
      if($scope.total_amount>0){
        var query = 'SELECT first_name, username FROM registration';
      
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          var len = res.rows.length;
          if(len > 0){
            //alert(res.rows.item);
            $state.go('app.address-details');  // used to move to checkout page.
          }else{
            $state.go('app.login');
          }
        });
        
      }
      else{
        //alerts the user that cart is empty.
        var alertPopup = $ionicPopup.alert({
          title: 'No item in your Cart',
          template: 'Please add Some Items!'
        });
      }
    };
});

app.controller('PlaceOrderController', function(DataService,$scope,$location,$ionicLoading,$ionicPopup,$cordovaDevice,$stateParams){
  $scope.data = [];
  document.addEventListener('deviceready', function () {
        device_id = $cordovaDevice.getUUID();
  }, false);

  $scope.$on('$ionicView.enter', function(){
    $ionicLoading.show()
    DataService.getPreviousAddresses(32).then(function(res){
      console.log(res.data);
      $scope.noOfAddress =  res.data.length;
      $scope.addresses = res.data;
      $ionicLoading.hide();
    });
    

  });

  $scope.getPaymentPage = function(){
    if($scope.data.addressID == undefined){
      var alertPopup = $ionicPopup.alert({
               title: 'Warning',
               template: 'Select a delivery address.'
             });
    }else{
      $location.path('app/payment/'+$scope.data.addressID);
    }
  }

  $scope.placeOrder = function(){
    if($stateParams.id == undefined){
      var alertPopup = $ionicPopup.alert({
               title: 'Warning',
               template: 'Select a delivery address.'
             });
    }else{
      DataService.placeOrder(device_id,32,$stateParams.id).then(function(res){
        var alertPopup = $ionicPopup.alert({
               title: 'Success',
               template: res.data.Message
             });
      });  
    }
  }

  $scope.deleteAddress = function(){
    var alertPopup = $ionicPopup.confirm({
               title: 'Delete',
               template: 'Do you want to delete?'
             });
             alertPopup.then(function(res) {
              if(res){
                DataService.deleteAddress($scope.data.addressID).then(function(res){
                    console.log(res.data);
                });
              }
            });
  }
});

app.controller('ProfileController', function(DataService, $scope,$ionicLoading,$location,$ionicPopup,$cordovaSQLite){
  $scope.data = {};
  var _this = this;

  $scope.$on('$ionicView.enter', function(){
    //$ionicLoading.show();
    var query = 'SELECT id,first_name,last_name,email,phone,username,address,pin FROM registration';
      
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      var len = res.rows.length, i;

      if(len > 0){
        for(i=0;i<len;i++){
          _this.fname     = res.rows.item(i).first_name;
          _this.lname     = res.rows.item(i).last_name;
          _this.email     = res.rows.item(i).email;
          _this.phone     = res.rows.item(i).phone;
          _this.username  = res.rows.item(i).username;
          _this.address   = res.rows.item(i).address;
          _this.pin       = res.rows.item(i).pin;
          
          $scope.data.email       = res.rows.item(i).email;
          $scope.data.phone       = res.rows.item(i).phone;
          $scope.data.address     = res.rows.item(i).address;
          $scope.data.pin         = res.rows.item(i).pin;
          $scope.data.id          = res.rows.item(i).id;
          
        }
      }
    });

  $ionicLoading.hide();
  });

  $scope.updateAccount = function(){
    var id        = $scope.data.id;
    var email     = $scope.data.email;
    var phone     = $scope.data.phone;
    var address   = $scope.data.address;
    var pin       = $scope.data.pin;
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var flag    = true;

    if(email == undefined){
      document.getElementById('error-msg-email').style.display = 'block';
      flag = false;
    }else if(!email.match(EMAIL_REGEXP)){
      document.getElementById('error-msg-email').style.display = 'block';
      document.getElementById('error-msg-email').innerHTML = '*Email is not valid!';
      flag = false;
    }

    if(phone == undefined){
      document.getElementById('error-msg-phone').style.display = 'block';
      flag = false;
    }

    if(flag){
      DataService.updateAccount(id,email,phone,address,pin).then(function(response){
        if(response.data.Error == 0){
          var query = "UPDATE registration SET email=?,phone=?,address=?,pin=? WHERE id= id";
          $cordovaSQLite.execute(db, query, [email,phone,address,pin]).then(function(){
            $ionicLoading.hide();
            
            var alertPopup = $ionicPopup.alert({
               title: 'Success',
               template: response.data.Message
             });
             alertPopup.then(function(res) {
              $scope.data.email = '';
              $scope.data.phone = '';
              $scope.data.address = '';
              $scope.data.pin = '';
              
              $location.path('app/profile');
            });
          });
        }
      });
    }
  };

  $scope.changePassword = function(){
    var id              = $scope.data.id;
    var oldPassword     = $scope.data.oldPassword;
    var newPassword     = $scope.data.newPassword;
    var confirmPassword = $scope.data.confirmPassword;
    var flag = true;

    if(oldPassword == undefined){
      document.getElementById('error-msg-opassword').style.display = 'block';
      flag = false;
    }
    if(newPassword == undefined){
      document.getElementById('error-msg-npassword').style.display = 'block';
      flag = false; 
    }else if(newPassword != confirmPassword){
      document.getElementById('error-msg-cpassword').style.display = 'block';
      flag = false; 
    }

    if(flag){
      DataService.changePassword(32,oldPassword,newPassword).then(function(res){
        console.log(res);
        if(res.data.Error == 1){
          var alertPopup = $ionicPopup.alert({
               title: 'Fail',
               template: res.data.Message
             });
             alertPopup.then(function(res) {
              $scope.data.oldPassword = '';
              $scope.data.newPassword = '';
              $scope.data.confirmPassword = '';
              $location.path('app/profile');
            });
        }else{
          var alertPopup = $ionicPopup.alert({
               title: 'Success',
               template: res.data.Message
             });
             alertPopup.then(function(res) {
              $scope.data.oldPassword = '';
              $scope.data.newPassword = '';
              $scope.data.confirmPassword = '';
              $location.path('app/profile');
            });
        }
      });
    }


  }

  $scope.hideError = function(name){
      document.getElementById('error-msg-'+name).style.display = 'none';
  }
});

app.controller('OrderController', function(DataService, $scope, $ionicLoading){
  $ionicLoading.show();
  $scope.$on('$ionicView.enter', function(){
    DataService.getOrdersByCustomer('33',0,10).then(function(res){
      console.log(res.data);
      $ionicLoading.hide();
    });
  });
  $ionicLoading.hide();
});

app.controller('AddressController', function(DataService, $scope, $ionicPopup,$stateParams,$location){
   $scope.saveNewAddress=function(){
    var address1 = $scope.data.address1;
    var address2 = $scope.data.address2;
    var location = $scope.data.location;
    var city     = $scope.data.city;
    var state    = $scope.data.state;
    var pin      = $scope.data.pin;
    var phone    = $scope.data.phone;
    var contactPerson = $scope.data.contactPerson;
    var flag     = true;

    if(address1 == undefined){
      document.getElementById('error-msg-address1').style.display = 'block';
      flag = false;
    }

    if(address2 == undefined){
      document.getElementById('error-msg-address2').style.display = 'block';
      flag = false;
    }

    if(location == undefined){
      document.getElementById('error-msg-location').style.display = 'block';
      flag = false;
    }

    if(city == undefined){
      document.getElementById('error-msg-city').style.display = 'block';
      flag = false;
    }

    if(state == undefined){
      document.getElementById('error-msg-state').style.display = 'block';
      flag = false;
    }

    if(pin == undefined){
      document.getElementById('error-msg-pin').style.display = 'block';
      flag = false;
    }
    if(phone == undefined){
      document.getElementById('error-msg-phone').style.display = 'block';
      flag = false;
    }
    if(contactPerson == undefined){
      document.getElementById('error-msg-contactPerson').style.display = 'block';
      flag = false;
    }

    if(flag){
      DataService.saveNewAddress(32,address1,address2,location,city,state,pin,phone,contactPerson).then(function(res){
        var alertPopup = $ionicPopup.alert({
               title: 'Success',
               template: 'Address '+res.data
             });
             alertPopup.then(function(res) {
              $scope.data.address1 = '';
              $scope.data.address2 = '';
              $scope.data.location = '';
              $scope.data.city = '';
              $scope.data.state = '';
              $scope.data.pin = '';
              $scope.data.phone = '';
              $scope.data.contactPerson = '';
              $location.path('app/address/details');
            });

      });
    }
   };

   $scope.editAddress = function(addressID){
    var address1 = $scope.data.address1;
    var address2 = $scope.data.address2;
    var location = $scope.data.location;
    var city     = $scope.data.city;
    var state    = $scope.data.state;
    var pin      = $scope.data.pin;
    var phone    = $scope.data.phone;
    var contactPerson = $scope.data.contactPerson;
    var flag     = true;

    if(address1 == undefined){
      document.getElementById('error-msg-address1').style.display = 'block';
      flag = false;
    }

    if(address2 == undefined){
      document.getElementById('error-msg-address2').style.display = 'block';
      flag = false;
    }

    if(location == undefined){
      document.getElementById('error-msg-location').style.display = 'block';
      flag = false;
    }

    if(city == undefined){
      document.getElementById('error-msg-city').style.display = 'block';
      flag = false;
    }

    if(state == undefined){
      document.getElementById('error-msg-state').style.display = 'block';
      flag = false;
    }

    if(pin == undefined){
      document.getElementById('error-msg-pin').style.display = 'block';
      flag = false;
    }
    if(phone == undefined){
      document.getElementById('error-msg-phone').style.display = 'block';
      flag = false;
    }
    if(contactPerson == undefined){
      document.getElementById('error-msg-contactPerson').style.display = 'block';
      flag = false;
    }

    if(flag){
      DataService.editAddress($stateParams.addressID,address1,address2,location,city,state,pin,phone,contactPerson).then(function(res){
        var alertPopup = $ionicPopup.alert({
               title: 'Success',
               template: 'Address '+res.data
             });
             alertPopup.then(function(res) {
              $scope.data.address1 = '';
              $scope.data.address2 = '';
              $scope.data.location = '';
              $scope.data.city = '';
              $scope.data.state = '';
              $scope.data.pin = '';
              $scope.data.phone = '';
              $scope.data.contactPerson = '';
              $location.path('app/address/details');
            });

      });
    }
  }

});


//Cart.....................................................
//---------------------------------------------------------



  // directives...................

app.directive('isNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        
        var clean = val.replace(/[^-0-9\.]/g, '');
        var negativeCheck = clean.split('-');
        var decimalCheck = clean.split('.');
        if(!angular.isUndefined(negativeCheck[1])) {
            negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
            clean =negativeCheck[0] + '-' + negativeCheck[1];
            if(negativeCheck[0].length > 0) {
                clean =negativeCheck[0];
            }
            
        }
          
        if(!angular.isUndefined(decimalCheck[1])) {
            decimalCheck[1] = decimalCheck[1].slice(0,2);
            clean =decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});

app.directive('restrictTo', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var re = RegExp(attrs.restrictTo);
            var exclude = /Backspace|Enter|Tab|Delete|Del|ArrowUp|Up|ArrowDown|Down|ArrowLeft|Left|ArrowRight|Right/;

            element[0].addEventListener('keydown', function(event) {
                if (!exclude.test(event.key) && !re.test(event.key)) {
                    event.preventDefault();
                }
            });
        }
    }
});

app.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  return {
    link: function(scope, elm) {

      elm.on("keyup",function(){
            var isMatchRegex = EMAIL_REGEXP.test(elm.val());
            if( isMatchRegex && elm.hasClass('warning') || elm.val() == ''){
              elm.removeClass('warning');
            }else if(isMatchRegex == false && !elm.hasClass('warning')){
              elm.addClass('warning');
            }
      });
    }
  }
});

//searching.......


app.controller('repeaterCtrl', function ($scope, $ionicFilterBar) {
  $scope.values = window.Values.sort(function (a, b) {
    return a.first_name > b.first_name ? 1 : -1;
  });

  $scope.doRefresh = function () {
    $scope.values = window.Values;
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.showFilterBar = function () {
    filterBar = $ionicFilterBar.show({
      items: $scope.values,
      update: function (filteredItems) {
        $scope.values = filteredItems
      }
      //filterProperties : 'first_name'
    });
  }
})