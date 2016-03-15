(function (angular) {

    var app = angular.module('ThinkEhrApp', ['ngRoute', 'ngResource', 'ngMessages', 'ThinkEhrFormPresent', 'thinkehrForms4'])
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


                })
                .when('/form/:compositionUid?', {
                    templateUrl: 'app/views/form.html',
                    controller: 'FormController'
                })
                .otherwise(
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
                    version: '1.0.11',
                    compositionUid: '06810633-5ce9-423f-906c-2c5bbd656c29::matijak.ehrscape.com::1',
                    aql: "select c from Composition c where c/uid/value = '06810633-5ce9-423f-906c-2c5bbd656c29::matijak.ehrscape.com::1'",
                    ehrUid: '9cfc25f3-e8a8-4e6b-8414-823517294f5d',
                    templateId: 'Vital Signs'
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
        .factory('FormResource', ['$resource', 'AppSettings', function($resource, AppSettings) {
            return $resource(
                AppSettings.restUrl + "/form/:name/:version",
                {
                    resources: 'form-description,form-dependencies'
                }
            )
        }])
        .factory('CompositionResource', ['$resource', 'AppSettings', function($resource, AppSettings) {
            return $resource(
                AppSettings.restUrl + "/composition",
                {
                    format: 'STRUCTURED',
                    ehrId: AppSettings.form.ehrUid,
                    templateId: AppSettings.form.templateId
                },
                {
                    post: {method: 'POST'},
                    load: {method: 'GET', url: AppSettings.restUrl + '/composition/:compositionUid'},
                    update: {method: 'PUT', url: AppSettings.restUrl + '/composition/:compositionUid'}
                }

            )
        }])
        .controller('AppCtrl', ['$scope', 'AppSettings', function ($scope, AppSettings) {
            $scope.compositionUid = AppSettings.form.compositionUid;

        }])
        .controller('ViewController', ['$scope', 'AppSettings', 'PresentationResource', 'presentation', function($scope, AppSettings, PresentationResource, presentation) {

            $scope.presentation = presentation[0]['composition'];
            console.log('ViewController', presentation);
            }])
        .controller('FormController', ['$scope', 'AppSettings', 'FormResource', 'CompositionResource', '$routeParams',
            function($scope, AppSettings, FormResource, CompositionResource, $routeParams) {
                console.log('params', $routeParams);

                var valuesPromise;
                if ($routeParams.compositionUid) {
                    valuesPromise = CompositionResource.load({compositionUid: $routeParams.compositionUid}).$promise
                } else {
                    valuesPromise = null;
                }

            FormResource.get({
                name: AppSettings.form.name,
                version: AppSettings.form.version
            })
                .$promise.then(function(formData) {


                var formDesc;
                var formDep;
                angular.forEach(formData.form.resources, function (resource) {
                    if (resource.name === 'form-description') {
                        formDesc = resource;
                    } else if (resource.name === 'form-dependencies') {
                        formDep = resource;
                    }
                });

                $scope.context = {
                    'language': 'en',
                    'territory': 'SI'
                };
                $scope.value = {};

                if (valuesPromise) {
                    valuesPromise.then(function(values) {
                        $scope.value = values.composition;
                        console.log('values', values);
                        $scope.model = thinkehr.f4.parseFormDescription($scope.context, formDesc.content, $scope.value, formDep.content);
                    });
                } else {
                    $scope.model = thinkehr.f4.parseFormDescription($scope.context, formDesc.content, $scope.value, formDep.content);
                }



                $scope.save = function($event) {
                    $scope.value['ctx/language'] = 'en';
                    $scope.value['ctx/territory'] = 'SI';
                    $scope.value['ctx/composer_name'] = 'matijak';
                    $event.preventDefault();
                    if (!valuesPromise) {
                        CompositionResource.post($scope.value).$promise.then(function(success) {
                            console.log('success', success);
                        });
                    } else {
                        CompositionResource.update({compositionUid: AppSettings.form.compositionUid}, $scope.value).$promise.then(function(success) {
                            console.log('update', success);
                        });
                    }

                };

                console.log('formData', formDesc, formDep);
            });
            }])
        ;

}(angular));

