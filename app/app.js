
var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.bootstrap']);

// configuring our routes 
// =============================================================================
// app.config(function($stateProvider, $urlRouterProvider) {
    
//     $stateProvider
    
//         // route to show our basic form (/form)
//         .state('home', {
//             url: '/home',
//             templateUrl: 'homeTemplate1.html',
//             controller: 'mainController'
//         })
        
//         // nested states 
//         // each of these sections will have their own view
//         // url will be nested (/form/profile)
//         .state('wizard.step1', {
//             url: '/step1',
//             templateUrl: 'wizard-step1.html'
//         })
        
//         .state('wizard.step2', {
//             url: '/step2',
//             templateUrl: 'wizard-step2.html'
//         })

//         .state('wizard.step3', {
//             url: '/step3',
//             templateUrl: 'wizard-step3.html'
//         })

//         .state('wizard.step4', {
//             url: '/step4',
//             templateUrl: 'wizard-step4.html'
//         });
       
//     // catch all route
//     // send users to the home page 
//     $urlRouterProvider.otherwise('/home');
// });

app.controller('navbarController', function($scope) {
    $scope.isCollapsed = true;
});

// our controller for the form
// =============================================================================
app.controller('mainController', function($scope, $timeout) {
    
    // we will store all of our form data in this object
    $scope.formData = {};
    $scope.direction = 'backward';
    
    
    $scope.incrementStep = function(incrementCount) {
      // find the current steo and move to the next one.
      // Just don't refer to this from the last step and no one gets hurt.
      var currentStep = $state.current.name;
      var currentIndex = parseInt(currentStep.slice(-1));
      var nextIndex = currentIndex + incrementCount;
      var nextStep = currentStep.substring(0, currentStep.length - 1) + nextIndex.toString();

      if (incrementCount === -1) {$scope.direction = 'backward'} else {$scope.direction = 'forward'};

      // this is a bit hacky but it works.  Without this, the current form never sees the new class value that 
      // is set by $scope.direction.  So you end up with some funky cross-animation.
      $timeout(function() {
          $state.go(nextStep);

          $timeout(function() {
              // Reset so that 'backward' is the default.  Because people like to use the back button in the browser.
              // This needs to have a timeout of at least 750 - At 500, the animations swap halfway thru.
              $scope.direction = 'backward'
          }, 1000);


      }, 100);


    };

});
