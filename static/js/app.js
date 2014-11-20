angular.module('propertypassport.config',[])
  .constant('config', {
    'version': 0.2,
    'localdev': true,
    'baseUrl': 'http://localhost:8070',
    'serviceUrl': '/REST/FrameUI/demo/demo_webclient/BuildingService',
    'executeMethodGetList': 'getAllProperties',
    'executeMethodSave': 'putAllProperties',
    'cache_refresh': 300000 // 5 minutes
  })
/**
 * Demo app for the Planon Property Passport
 *
 * Specs: http://2z9ox8.axshare.com/
 */
var app = angular.module('propertypassport', ['propertypassport.config', 'ngRoute']);

app.config(function($routeProvider) {
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
  });

/**
 * Frontend cache, used for minification of the data traffic between front-end and backend and communication between controllers
 */
app.factory('propertyCache', function($cacheFactory) {
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

/**
 * Use this directive as two-way-filter for the rounding of the numbers
 *
 * HTML-view:
 * <input roudnumber type="text" data-ng-model="entity.date" /> 
 */
app.directive('roudnumber', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      //convert data from view format to model format
      function fromModel(data) {
        return parseInt(data, 10); //converted
      }
      //convert data from model format to view format
      function toModel(data) {
        return parseInt(data, 10); //converted
      }
      //add the methods to the registry      
      ngModel.$parsers.push(fromModel);
      ngModel.$formatters.push(toModel);
    }
  }
});

/**
 * Convert to lowercase
 *
 * HTML-view:
 * <input lowercase type="text" data-ng-model="entity.date" /> 
 */
app.directive('lowercase', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      //convert data from view format to model format
      function fromModel(text) {
        return (text || '').toUpperCase();
      }
      //convert data from model format to view format
      function toModel(text) {
        return (text || '').toLowerCase();
      }
      //add the methods to the registry      
      ngModel.$parsers.push(fromModel);
      ngModel.$formatters.push(toModel);
    }
  };
});
