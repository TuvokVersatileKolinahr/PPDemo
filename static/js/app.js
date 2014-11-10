angular.module('propertypassport.config',[])
  .constant('config', {
    'version': 0.2,
    'localdev': true,
    'baseUrl': 'http://pc06698',
    'serviceUrl': '/REST/FrameUI/demo/demo_webclient/SensorService',
    'executeMethod': 'getAllProperties'
  })
/**
 * Demo app for the Planon Property Passport
 *
 * Specs: http://2z9ox8.axshare.com/
 */
var app = angular.module('propertypassport', ['propertypassport.config', 'ngRoute', 'ppControllers']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/properties', {
        templateUrl: 'partials/mapview.html',
        controller: 'MainController'
      }).
      when('/properties/:propertyId', {
        templateUrl: 'partials/editview.html',
        controller: 'EditController'
      }).
      otherwise({
        redirectTo: '/properties'
      });
  }]);
