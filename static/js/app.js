angular.module('propertypassport.config',[])
  .constant('config', {
    'version': 0.2,
    'localdev': true,
    'baseUrl': 'http://pc06698',
    'serviceUrl': '/REST/FrameUI/demo/demo_webclient/SensorService',
    'executeMethodGetList': 'getAllProperties',
    'executeMethodSave': 'putAllProperties',
    'cache_refresh': 100000000000
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
app.factory('dataCache', function($cacheFactory) {
  return $cacheFactory('properties');
});

app.factory('PropertyData', function($http, config, dataCache) {
  //Define the PropertyData function
  var PropertyData = function() {
    /**
     * Workaround for images in EE without Webdav configured. Fixes the reference as stored in EE to a file url.
     * 
     * This method assumes two things:
     * - the file is stored in "{PATH_TO_TOMCAT}webapps\static\buildings\filename.jpg"
     * - the file is accessible under url "/static/buildings/filename.jpg"
     * 
     * @param String ref to the EE image path
     * 
     * @return String file url
     */
    function _fixPhotoRef(ref) {
      var imgurl = '/static/buildings/no_image.jpg';
      if (ref)
        imgurl = ref.split('webapps')[1].replace(/\\/g, '/');

      if (config.localdev)
        imgurl = imgurl.slice(1);

      return imgurl;
    }

    this.initialize = function() {
      /**
       * Fetch the data from an external source if there is no cache version or if the cache is overdue
       */
      var propCache = dataCache.get('properties.list');

      if (propCache && (Date.now() - dataCache.get('properties.ts') < config.cache_refresh )) {
        //we have a cached version of the properties & cache is less than 'config.cache_refresh' old
        angular.extend(self, propCache);
      } else { //we need to fetch the properties
        if (config.localdev) {
          var propertiesList = $http.get('static/js/mock-nijmegen.js');
        } else {
          var propertiesList = $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethodGetList});
        }
      }
      var self = this;

      // When our $http promise resolves
      // Use angular.extend to extend 'this' with the properties of the response
      propertiesList.then(function(response){
        for(var i=0; i < response.data.result.length; i++) {
          response.data.result[i].photoref = _fixPhotoRef(response.data.result[i].photoref);
        }
        angular.extend(self, response.data);
      });

    }

    // Call the initialize function for every new instance
    this.initialize();
  }

  // Return a reference to this function
  return (PropertyData);
});

/**
 * Filer number data
 */
app.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    }
});