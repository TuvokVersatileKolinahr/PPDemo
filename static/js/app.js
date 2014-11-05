var app = angular.module('propertypassport', [])

  .controller('MainController', ['$scope', '$http', function($scope, $http){
    var map;
	  $http.get('static/js/mock.js').
	  success(function(data, status, headers, config) {
	   	$scope.properties = data.result;

	   	console.log('Got ' + $scope.properties.length + ' properties');

      for (var t = 0; t < data.result.length; t++) {
        console.log("comment", data.result[t].comment.split(","));
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.result[t].comment.split(",")[0], data.result[t].comment.split(",")[1]),
          title: data.result[t].name,
          map: map
        });
      }
	  }).
	  error(function(data, status, headers, config) {
	    console.error('Could not retrieve properties from server...');
	  });


	  /* Init maps */
	  function initialize() {
        var mapOptions = {
          center: { lat: 51.5873617, lng: 4.7663469},
          zoom: 15,
          disableDefaultUI: true
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);

  }]);