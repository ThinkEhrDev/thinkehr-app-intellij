(function (angular) {

    var app = angular.module('ThinkEhrApp', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: 'app/views/tfpView.html'

                }).otherwise(
                {
                    redirectTo: '/'
                }
            );

        }])
        .controller('AppCtrl', [function () {

        }])
        ;

}(angular));

