(function(angular) {

    angular.module('ThinkEhrFormPresent', [])
        .directive('tfpValue', [function () {
            return {
                templateUrl: 'app/views/tfpValue.html',
                restrict: 'E',
                scope: {
                    ehrValue: '='
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
                    ehrCont: '='
                },
                link: function (scope, element, attrs) {

                    angular.forEach(scope.ehrCont.children, function (child) {
                        var childScope = $rootScope.$new(false, scope);
                        childScope.tfpElement = child;

                        if (isContainer(child)) {
                            var html = '<tfp-container ehr-cont="tfpElement" data-rm-type="{{tfpElement.rmType}}"></tfp-container>'
                        } else {
                            html = '<tfp-value ehr-value="tfpElement" data-rm-type="{{ehrValue.rmType}}"></tfp-value>'
                        }

                        var childElement = $compile(html)(childScope);
                        element.append(childElement);
                    });

                    function isContainer(child) {
                        return child.hasOwnProperty('children');
                    }

                }
            };

        }])
        ;

}(angular));
