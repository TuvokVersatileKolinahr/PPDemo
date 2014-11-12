angular.module('propertypassport.config',[])
  .constant('config', {
    'version': 0.2,
    'localdev': true,
    'baseUrl': 'http://pc06698',
    'serviceUrl': '/REST/FrameUI/demo/demo_webclient/SensorService',
    'executeMethodGetList': 'getAllProperties',
    'executeMethodSave': 'putAllProperties',
    'cache_refresh': 1
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

/**
 * Frontend cache, used for minification of the data traffic between front-end and backend and communication between controllers
 */
app.factory('dataCache', function($cacheFactory) {

  return $cacheFactory('properties');
});

/**
 * Filer number data
 */
app.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    }
});