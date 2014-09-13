
var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngTouch']);

app.controller("HomeController", function($scope) {
    $scope.title = "Home";
});
