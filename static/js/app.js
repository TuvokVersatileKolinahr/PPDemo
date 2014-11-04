var app = angular.module('propertypassport', [])

  .controller('MainController', ['$scope', '$http', function($scope, $http){

	  $http.get('static/js/mock.js').
	  success(function(data, status, headers, config) {
	   	$scope.properties = data;
	   	console.log('Got ' + $scope.properties.length + ' properties');
	  }).
	  error(function(data, status, headers, config) {
	    console.error('Could not retrieve properties from server...');
	  });


	  /* Init maps */
	  function initialize() {
        var mapOptions = {
          center: { lat: 52.2573142, lng: 6.0717659},
          zoom: 8
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);


  }]);