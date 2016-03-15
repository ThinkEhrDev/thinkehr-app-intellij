(function (angular) {

    var app = angular.module('ThinkEhrApp', ['ngRoute', 'ngResource', 'ngMessages', 'ThinkEhrFormPresent'])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: 'app/views/tfpView.html',
                    controller: 'ViewController',
                    resolve: {
                        presentation: ['AppSettings', 'PresentationResource', function (AppSettings, PresentationResource) {
                            return PresentationResource.post(
                                {
                                    "queryRequestData": {
                                        "aql": AppSettings.form.aql,
                                        "aqlParameters": {}
                                    },
                                    "formData": [
                                        {
                                            "formName": AppSettings.form.name,
                                            "formVersion": AppSettings.form.version
                                        }
                                    ]
                                }
                            ).$promise;
                        }]
                    }

                }).otherwise(
                {
                    redirectTo: '/'
                }
            );

            $httpProvider.defaults.headers.common['Authorization'] = "Basic bWF0aWphazptYXBha28yNw==";

        }])
        .factory('AppSettings', [function() {
            return {
                restUrl : 'https://rest.ehrscape.com/rest/v1',
                form: {
                    name: 'VitalSignsPsDemo',
                    version: '1.0.1',
                    compositionUid: 'f8edbe05-bf87-4924-bc97-68844a8fc5f9::matijak.ehrscape.com::1',
                    aql: "select c from Composition c where c/uid/value = 'f8edbe05-bf87-4924-bc97-68844a8fc5f9::matijak.ehrscape.com::1'"
                }
            };
        }])
        .factory('PresentationResource', ['$resource', 'AppSettings', function($resource, AppSettings) {
            return $resource(
                AppSettings.restUrl + "/presentation",
                {},
                {
                    post: {method: 'POST', isArray: true}
                }
            )
        }])
        .controller('AppCtrl', [function () {

        }])
        .controller('ViewController', ['$scope', 'AppSettings', 'PresentationResource', 'presentation', function($scope, AppSettings, PresentationResource, presentation) {

            $scope.presentation = presentation[0]['composition'];
            console.log('ViewController', presentation);
            }])
        ;

}(angular));

