(function (angular) {

    var app = angular.module('ThinkEhrApp', ['ngRoute', 'ngMessages', 'ngResource', 'ThinkEhrFormPresent', 'thinkehrForms4'])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider
                .when("/",
                    {
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
                    }
                )
                .when('/form/:compositionUid?', {
                    templateUrl: 'app/views/formView.html',
                    controller: 'FormController'
                })
                .otherwise(
                    {
                        redirectTo: '/'
                    }
                );

            $httpProvider.defaults.headers.common['Authorization'] = "Basic bWF0aWphazptYXBha28yNw==";


        }])
        .factory('AppSettings', [function () {
            return {
                restUrl: 'https://rest.ehrscape.com/rest/v1',
                form: {
                    name: 'VitalSignsPS',
                    version: '1.0.1',
                    compositionUid: 'f07f5924-9dfb-4ba1-88af-b7d9aa7b8754::matijak.ehrscape.com::1',
                    aql: "select c from Composition c where c/uid/value = 'f07f5924-9dfb-4ba1-88af-b7d9aa7b8754::matijak.ehrscape.com::1'"
                }
            };
        }])
        .factory('PresentationResource', ['$resource', 'AppSettings', function ($resource, AppSettings) {
            return $resource(
                AppSettings.restUrl + "/presentation",
                {},
                {
                    post: {method: 'POST', isArray: true}
                }
            )
        }])
        .factory('FormResource', ['$resource', 'AppSettings', function ($resource, AppSettings) {
            return $resource(
                AppSettings.restUrl + "/form/:name/:version",
                {
                    resources: 'form-description,form-dependencies'
                }
            )
        }])
        .controller('AppCtrl', ['$scope', 'AppSettings', function ($scope, AppSettings) {
            $scope.compositionUid = AppSettings.form.compositionUid;
        }])
        .controller('ViewController', ['$scope', "$route", "presentation", function ($scope, $route, presentation) {
            $scope.presentation = presentation[0]['composition'];
            console.log("scope.present", $scope.presentation, $route.current);
        }])
        .controller('FormController', ['$scope', 'AppSettings', 'FormResource', function ($scope, AppSettings, FormResource) {

            FormResource.get({
                name: AppSettings.form.name,
                version: AppSettings.form.version
            }).$promise.then(function(form) {

                var formDescription = null;
                var formDependencies = null;
                angular.forEach(form.form.resources, function (resource) {
                    if (resource.name === 'form-description') {
                        formDescription = resource;
                    }
                    else if (resource.name === 'form-dependencies') {
                        formDependencies = resource;
                    }
                });

                console.log('Form', formDescription, formDependencies);
                $scope.context = {
                    language: 'en',
                    territory: 'SI'
                };
                var values = {};
                $scope.model = thinkehr.f4.parseFormDescription($scope.context, formDescription.content, values, {});
                console.log('model', $scope.model);
            })
        }])
        ;

}(angular));

