var db = null;

angular.module('abad', ['ionic', 'ngCordova', 'abad.controllers'])

.run(function($ionicPlatform,$state,$ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.Connection){
      if(navigator.connection.type == Connection.NONE){
        $ionicLoading.hide();
        $state.go('offline');

      }
    }
  });

  document.addEventListener("offline", function(){
    $ionicLoading.hide();
    $state.go('offline');
  }, false);

  document.addEventListener("online", function(){
    $ionicLoading.hide();
    $state.go('app.home')
  }, false);

  document.addEventListener('deviceready', function() {
    db = window.sqlitePlugin.openDatabase({name: 'abad.db', location: 'default'});
    db.transaction(function(tr) {
      //tr.executeSql('DROP TABLE IF EXISTS registration');
      tr.executeSql('CREATE TABLE IF NOT EXISTS registration(id,first_name,last_name,email,phone,username,address,pin)');
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuController'
  })

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeController'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      }
    }
  })

   .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'RegistrationController'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeController',
        controllerAs: 'HomeCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.searching', {
    url: '/searching',
    views: {
      'menuContent': {
        templateUrl: 'templates/searching.html'
      }
    }
  })

  .state('app.categories', {
    url: '/categories',
    views: {
      'menuContent': {
        templateUrl: 'templates/categories.html'
      }
    }
  })

  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('app.support', {
    url: '/support',
    views: {
      'menuContent': {
        templateUrl: 'templates/support.html',
        controller: 'SupportController'
      }
    }
  })

  .state('app.cart', {
    url: '/cart',
    views: {
      'menuContent': {
        templateUrl: 'templates/cart.html',
        controller: 'CartController'
      }
    }
  })

  .state('app.products', {
    url: '/products/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller: 'ProductController',
        controllerAs: 'ProductCtrl'
      }
    }
  })

  .state('app.product-single', {
    url: '/product/single/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/product-single.html',
        controller: 'ProductSingleController',
        controllerAs: 'ProductSingleCtrl'
      }
    }
  })

  .state('app.order-preview', {
    url: '/order/preview',
    views: {
      'menuContent': {
        templateUrl: 'templates/order-preview.html',
        controller: 'CartController'
      }
    }
  })

  .state('app.payment', {
    url: '/payment/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/payment.html',
        controller: 'PlaceOrderController'
      }
    }
  })

  .state('app.address-details', {
    url: '/address/details',
    views: {
      'menuContent': {
        templateUrl: 'templates/address-details.html',
        controller: 'PlaceOrderController'
      }
    }
  })

   .state('app.address-add', {
    url: '/address/add',
    views: {
      'menuContent': {
        templateUrl: 'templates/address-add.html',
        controller: 'AddressController'
      }
    }
  })

  .state('app.address-update', {
    url: '/address/update/:addressID',
    views: {
      'menuContent': {
        templateUrl: 'templates/address-update.html',
        controller: 'AddressController'
      }
    }
  })

  .state('app.orders', {
    url: '/orders',
    views:{
      'menuContent': {
        templateUrl: 'templates/orders.html',
        controller: 'OrderController'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileController',
        controllerAs: 'ProfileCtrl'
      }
    }
  })

  .state('app.profile-update', {
    url: '/profile/update',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-update.html',
        controller: 'ProfileController',
        controllerAs: 'ProfileCtrl'
      }
    }
  })

  .state('app.change-password', {
    url: '/change/password',
    views: {
      'menuContent': {
        templateUrl: 'templates/change-password.html',
        controller: 'ProfileController',
        controllerAs: 'ProfileCtrl'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html'
      }
    }
  })

  .state('offline', {
    url: '/connection/error',
    templateUrl: 'templates/connection-error.html'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
