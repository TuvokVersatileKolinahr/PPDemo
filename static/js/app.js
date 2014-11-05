var app = angular.module('propertypassport', [])

  .controller('MainController', ['$scope', '$http', function($scope, $http){
    var map, markers = [];

    /**
     * Zoom to a marker with a specific ID on the map
     * @param string The id of the marker
     */
    $scope.zoomToMarker = function(id){
      var marker;
      markers.forEach(function(m){
        if (m.id == id){
          marker = m;
        }
      });

      if (marker){
        map.setCenter(marker.getPosition());
        map.setZoom(18);
      }
    };

    // Get the data from the server...
    $http.get('static/js/mock.js').
    success(function(data, status, headers, config) {
      $scope.properties = data.result;

      console.log('Got ' + $scope.properties.length + ' properties');

      for (var t = 0; t < data.result.length; t++) {
        var property = $scope.properties[t];
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(property.comment.split(",")[0], property.comment.split(",")[1]),
          id: property.code, // set the ID for lookup purposes, @see zoomToMarker
          title: property.name,
          map: map
        });
        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {               
          // TODO select the property in the list
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
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);

  }]);