(function(angular) {

    angular.module('ThinkEhrFormPresent', [])
        .directive('tfpValue', [function () {
        
            return {
                templateUrl: 'app/views/tfpValue.html',
                restrict: 'E',
                scope: {
                    ehrValue: "="
                },
                link: function (scope, element, attrs) {
                    
                }
            };
        }])
        .directive('tfpContainer', ['$compile', '$rootScope', function ($compile, $rootScope) {

            return {
                templateUrl: 'app/views/tfpContainer.html',
                restrict: 'E',
                scope: {
                    ehrCont: "="
                },
                link: function (scope, element, attrs) {

                    angular.forEach(scope.ehrCont.children, function (child) {

                        var html;

                        var childScope = $rootScope.$new(false, scope);
                        childScope.tfpPresent = child;

                        if (isContainer(child)) {
                            html = '<tfp-container ehr-cont="tfpPresent"></tfp-container>'
                        } else {
                            html = '<tfp-value ehr-value="tfpPresent"></tfp-value>'
                        }

                        var childEl = $compile(html)(childScope);
                        element.append(childEl);
                    });


                    function isContainer(child) {
                        return child.hasOwnProperty('children');
                    }
                }
            };

        }])
        ;

}(angular));