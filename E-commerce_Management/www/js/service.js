var app = angular.module('abad');

var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
		};

app.factory('RegistrationService', function($http){

	 var registerUrl			= 'http://www.abadagro.com/AMR_API/CreateAccount';
	 var emailAlreadyExistsUrl 	= 'http://www.abadagro.com/AMR_API/GetDuplicateEmail';
	 var phoneAlreadyExistsUrl 	= 'http://www.abadagro.com/AMR_API/GetDuplicatePhone';
	 var useridAlreadyExistsUrl = 'http://www.abadagro.com/AMR_API/GetDuplicateUserID';

	 return {
	 	register: function(FirstName,LastName,UserID,Email,Phone,Password){
            var postData = $.param({
            	FirstName: FirstName,
                LastName: LastName,
                UserID: UserID,
                Email: Email,
                Phone: Phone,
                Password: Password
            });

           return $http.post(registerUrl,postData,config);
        },

        getDuplicateEmail: function(Email){
            var postData = $.param({
                Email: Email
            });

           return $http.post(emailAlreadyExistsUrl,postData,config);
        },

        getDuplicatePhone: function(Phone){
            var postData = $.param({
                Phone: Phone,
            });

           return $http.post(phoneAlreadyExistsUrl,postData,config);
        },

        getDuplicateUserID: function(UserID){
            var postData = $.param({
                UserID: UserID,
            });

           return $http.post(useridAlreadyExistsUrl,postData,config);
        },
    }
});

app.factory('LoginService', function($http){
	var loginUrl	= 'http://www.abadagro.com/AMR_API/Login';

	return{
		login: function(UserID,Password){
			var postData = $.param({
				UserID 		: UserID,
				Password	: Password
			});

			return $http.post(loginUrl,postData,config);
		}
	}
});

app.factory('DataService', function($http){
    var updateAccountURL        = 'http://www.abadagro.com/AMR_API/UpdateAccount';
    var changePasswordURL       = 'http://www.abadagro.com/AMR_API/UpdatePassword';
    var getCategoriesURL        = 'http://www.abadagro.com/AMR_API/GetCategories';
    var getItemsURL             = 'http://www.abadagro.com/AMR_API/GetItems';
    var getSpecialItemURL       = 'http://www.abadagro.com/AMR_API/GetSpecialItems'
    var getItemURL              = 'http://www.abadagro.com/AMR_API/GetItemDetailByID';
    var getItemsByCategoryURL   = 'http://www.abadagro.com/AMR_API/GetItemsByCategory';
    var addToCartURL            = 'http://www.abadagro.com/AMR_API/AddToCart';
    var getCartURL              = 'http://www.abadagro.com/AMR_API/ReadCart';
    var removeFromCartURL       = 'http://www.abadagro.com/AMR_API/RemoveFromCart';
    var saveNewAddressURL       = 'http://www.abadagro.com/AMR_API/SaveNewAddress';
    var getPreviousAddressesURL = 'http://www.abadagro.com/AMR_API/GetPreviousAddresses';
    var updateAddressURL        = 'http://www.abadagro.com/AMR_API/UpdateAddress';
    var deleteAddressURL        = 'http://www.abadagro.com/AMR_API/DeleteAddress';
    var placeOrderURL           = 'http://www.abadagro.com/AMR_API/PlaceOrder';
    var getOrdersByCustomerURL  = 'http://www.abadagro.com/AMR_API/GetOrdersByCustomer';

    return{

        updateAccount: function(ID,Email,PhoneNo,Address,PinCode){
            var postData = $.param({
                ID: ID,
                Email: Email,
                PhoneNo: PhoneNo,
                Address: Address,
                PinCode: PinCode,
                Vat: '0.00'
            });

           return $http.post(updateAccountURL,postData,config);
        },
        changePassword: function(ID,OldPassword,NewPassword){
            var postData = $.param({
                ID: ID,
                OldPassword: OldPassword,
                NewPassword: NewPassword,
            });

           return $http.post(changePasswordURL,postData,config);
        },
        getCategories: function(){
            return $http.get(getCategoriesURL);
        },
        getHotItems: function(){
            var postData = $.param({
                ItemType: '2'
            });
            return $http.post(getSpecialItemURL,postData,config);
        },
        getRecentItems: function(){
            var postData = $.param({
                ItemType: '1'
            });
            return $http.post(getSpecialItemURL,postData,config);
        },
        getItem: function(id){
            var postData = $.param({
                ItemID: id
            });
            return $http.post(getItemURL,postData,config);
        },
        itemsByCategory: function(catID){
            var postData = $.param({
                Category:catID,
                PinCode:''
            });
            return $http.post(getItemsByCategoryURL,postData,config);
        },
        getCategoryName: function(catID){
            var postData = $.param({
                ID:catID,
            });
            return $http.post(getCategoriesURL,postData,config);
        },
        addToCart: function(device_id,id,name,ItemPackage,PackageQuantity,price,qty){
            var totPrice = parseFloat(price) * parseInt(PackageQuantity);
            var postData = $.param({
                    IPAddress: device_id,
                    ItemID: id,
                    ItemName: name,
                    ItemPackage: ItemPackage,
                    PackageQuantity: PackageQuantity,
                    Quantity: qty,
                    Price: price,
                    TotalPrice: totPrice,
                    CustmerID: '32',
                });

            return $http.post(addToCartURL,postData,config);
        },
        addItemToCart: function(device_id,id,ItemPackage,PackageQuantity,qty,price,){
            var postData = $.param({
                    IPAddress: device_id,
                    ItemID: id,
                    ItemPackage: ItemPackage,
                    PackageQuantity: PackageQuantity,
                    Quantity: qty,
                    TotalPrice: price,
                });

            return $http.post(addToCartURL,postData,config);
        },
        removeFromCart: function(id,PackageQuantity){
            var postData = $.param({
                ID: id,
                PackageQuantity: PackageQuantity
            });
            return $http.post(removeFromCartURL,postData,config);
        },
        getCart: function(device_id){
            var postData = $.param({
                IPAddress: device_id
            });
            return $http.post(getCartURL,postData,config);
        },
        saveNewAddress: function(CustomerID,AddressLine1,AddressLine2,Location,City,State,PinCode,ContactNo,ContactPerson){
            var postData = $.param({
                CustomerID: CustomerID,
                AddressLine1: AddressLine1,
                AddressLine2: AddressLine2,
                Location: Location,
                City: City,
                State: State,
                PinCode: PinCode,
                ContactNo: ContactNo,
                ContactPerson: ContactPerson,
            });
            return $http.post(saveNewAddressURL,postData,config);
        },
        getPreviousAddresses: function(CustomerID){
            var postData = $.param({
                CustomerID: CustomerID
            });
            return $http.post(getPreviousAddressesURL,postData,config);
        },
        editAddress: function(CustomerID,AddressLine1,AddressLine2,Location,City,State,PinCode,ContactNo,ContactPerson){
            var postData = $.param({
                ID: CustomerID,
                AddressLine1: AddressLine1,
                AddressLine2: AddressLine2,
                Location: Location,
                City: City,
                State: State,
                PinCode: PinCode,
                ContactNo: ContactNo,
                ContactPerson: ContactPerson
            });
            return $http.post(updateAddressURL,postData,config);
        },
        deleteAddress: function(AddressID){
            var postData = $.param({
                ID: AddressID
            });
            return $http.post(deleteAddressURL,postData,config);
        },
        placeOrder: function(IPAddress,CustomerID,AddressID){
            var postData = $.param({
                CustomerID: CustomerID,
                IPAddress: IPAddress,
                AddressID: AddressID,
                DiscountAmount: 0,
                DeliveryType: 'COD'
            });
            return $http.post(placeOrderURL,postData,config);
        },
        getOrdersByCustomer: function(CustomerID,Lim1,Lim2){
            var postData = $.param({
                CustomerID: CustomerID,
                Lim1: Lim1,
                Lim2: Lim2
            });
            return $http.post(getOrdersByCustomerURL,postData,config);
        },
    }
});

//Cart...................................................
//-------------------------------------------------------

app.factory('sharedCartService', ['$ionicPopup',function($ionicPopup, $http, $location){  // $ionicPopup has to be defined here
    
    var cartObj = {};           // note that this is an Cart Object. It contains product list, total qty, and total amt
        cartObj.cart=[];        // array of product items
        cartObj.total_amount=0; // total cart amount
        cartObj.total_qty=0;    // total cart qty
        cartObj.pid=0;
        
    cartObj.cart.productAlreadyExist=function(id){
        if( cartObj.cart.find(id)!=-1 ){
            cartObj.pid=id;
        }
    }
    
    cartObj.cart.add=function(id,image,name,package,price,packqty,qty){

        if( cartObj.cart.find(id)!=-1 ){  //find() is declared in the bottom. 
                                         // It is used to check if the product is already added to the cart or not

            //Ionic popup
            //window.plugins.toast.showLongCenter('Item successfully added to Cart.');
            var alertPopup = $ionicPopup.alert({
                title: 'Product Already Added',
                template: 'Increase the qty from the cart'
            });
           
            
        }
        else{
            //insert this into cart array
            //window.plugins.toast.showLongCenter('Item successfully added to Cart.');
            cartObj.cart.push( { "cart_item_id": id , "cart_item_image": image , "cart_item_name": name , "cart_package_name": package , "cart_item_price": price , "cart_item_qty": packqty , "cart_package_qty": qty } );
            cartObj.total_qty+=1;   // increase the cartqty
            cartObj.total_amount+=parseInt(price*qty);  //increase the cart amount

        }
    };
    cartObj.cart.get=function(cartID,id,image,name,package,price,packqty,qty){
        if( cartObj.cart.find(id)!=-1 ){  //find() is declared in the bottom. 
                                         // It is used to check if the product is already added to the cart or not
            //Ionic popup
           
        }
        else{
            //insert this into cart array
            cartObj.cart.push( {"cart_id": cartID , "cart_item_id": id , "cart_item_image": image , "cart_item_name": name , "cart_package_name": package , "cart_item_price": price , "cart_item_qty": packqty , "cart_package_qty": qty } );
            cartObj.total_qty+=1;   // increase the cartqty
            cartObj.total_amount+=parseInt(price*packqty);  //increase the cart amount

        }
    };
    
    cartObj.cart.find=function(id){ 
        var result=-1;
        for( var i = 0, len = cartObj.cart.length; i < len; i++ ) {   // cart.length() gives the size of product list.
            if( cartObj.cart[i].cart_item_id === id ) {
                result = i;
                break;
            }
        }
        return result;
    };
    
    // used to delete a product 
    cartObj.cart.drop=function(id){
     //window.plugins.toast.showLongCenter('Item successfully removed from Cart.');
     var temp=cartObj.cart[cartObj.cart.find(id)]; //used to find the price and qty of the object to be deleted
     cartObj.total_qty-= parseInt(temp.cart_item_qty);  // decrements the product qty
     cartObj.total_amount-=( parseInt(temp.cart_item_qty) * parseInt(temp.cart_item_price) ); //decrements the product amt
     cartObj.cart.splice(cartObj.cart.find(id), 1); //used to remove product from the cart array. 
                                                    //splice() is a build in function to remove an array element.
 
    };
    
    //used to increment the product qty from the cart page
    // when a  product is added to cart. You can only increment the qty.
    cartObj.cart.increment=function(id){
        var itm_qty=cartObj.cart[cartObj.cart.find(id)].cart_item_qty;
         cartObj.cart[cartObj.cart.find(id)].cart_item_qty=parseInt(itm_qty)+1;
        
         cartObj.total_qty+= parseInt(1);
       
         cartObj.total_amount+=( parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) );  
    };
    
    // used to decrement the product qty from the cart page
    cartObj.cart.decrement=function(id){
        if(cartObj.cart[cartObj.cart.find(id)].cart_item_qty > 1){
             cartObj.cart[cartObj.cart.find(id)].cart_item_qty-=1;
             cartObj.total_qty-= 1;
             cartObj.total_amount-= parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) ;    
            
     
            if(cartObj.total_qty==0 || cartObj.total_amount<=0 ){
                cartObj.total_amount=0;
                cartObj.total_qty==0
            }
        }
 
         //if qty is 0 then remove it from the cart array.
         if(cartObj.cart[cartObj.cart.find(id)].cart_item_qty <= 0){
            cartObj.cart.splice(cartObj.cart[cartObj.cart.find(id)], 1);
            
         }
         
    };
    
    return cartObj;
}]);