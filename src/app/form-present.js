(function(angular) {

    angular.module('ThinkEhrFormPresent', [])
        .directive('tfpPresent', [function () {

            return {
                restrict: 'A',
                scope: {
                    tfpPresent: "="
                },
                link: function (scope, element, attrs) {
                    console.log("tfpPresent", scope.tfpPresent);
                }
            };

        }])
        ;

}(angular));
