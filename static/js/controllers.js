var ppControllers = angular.module('ppControllers', []);

ppControllers.controller('EditController', ['$scope', '$http', 'config', '$routeParams', 'dataCache', function($scope, $http, config, $routeParams, dataCache){
    $scope.propertyId = $routeParams.propertyId;
    var properties = dataCache.get('properties.list');
    console.log('properties.length', properties.length);

    //TODO: After succesfull edit a cacherefresh is due
    dataCache.put('properties.ts', 0);

}]);

ppControllers.controller('MainController', ['$scope', '$http', 'config', 'dataCache', function($scope, $http, config, dataCache){

  var map, markers = [];
  var properties = dataCache.get('properties.list');
  /**
   * Zoom to a marker with a specific ID on the map
   * @param string The id of the marker
   * @return google.maps.Marker the selected marker or undefined when not found
   */
  $scope.selectMarker = function(id){
    var marker;
    markers.forEach(function(m){
      if (m.id == id){
        marker = m;
      }
    });

    if (marker){
      // handle icons
      for (var i=0; i<markers.length; i++) {
        markers[i].setIcon('static/img/marker.png');
      }         
      marker.setIcon( 'static/img/selected-marker.png' );

      map.panTo(marker.getPosition());
      //map.setZoom(18);
      $scope.properties.forEach(function(p){
        if (p.code === marker.id){
          $scope.selected = p;
        }
      });
      console.log('Zoom to marker ' + id);
    }
    return marker;
  };
  $scope.selectMarkerWithInfo = function(id){
    if ($scope.selectMarker(id)){
      $scope.showInfo = !$scope.showInfo;
    }
  }
  $scope.clear = function(event){
    $scope.showInfo = false;
    if(event){
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /* Init maps */
  function initialize() {
    var mapOptions = {
      center: { lat: 51.5873617, lng: 4.7663469},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  function drawMarkers () {
    for (var t = 0; t < $scope.properties.length; t++) {
      var property = $scope.properties[t];
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(property.comment.split(",")[0], property.comment.split(",")[1]),
        id: property.code, // set the ID for lookup purposes, @see selectMarker
        title: property.name,
        icon: 'static/img/marker.png',
        map: map
      });
      markers.push(marker);

      // wrap inside a closure to keep reference to the right marker...
      (function(marker){
        google.maps.event.addListener(marker, 'click', function() {
         
          // show side panel
          $scope.$apply(function(){
            $scope.showInfo = true;
            $scope.selectMarker(marker.id);
          });
        });
      })(marker);
    }
  }

  initialize();

    // if (properties && (Date.now() - dataCache.get('properties.ts') < 20000 )) { //we have a cached version of the properties & cache is less than 20 seconds old
  if (properties && (Date.now() - dataCache.get('properties.ts') < 300000 )) { //we have a cached version of the properties & cache is less than 5 minutes old
    $scope.properties = properties;
    console.log('Got cached ' + $scope.properties.length + ' properties');
    drawMarkers();
  } else { //we need to fetch the properties
    if (config.localdev) {
      $http.get('static/js/mock.js').
        success(  function(data, status, headers, config) {
          $scope.properties = data.result;
          dataCache.put('properties.list', data.result);
          dataCache.put('properties.ts', Date.now());

          console.log('Got ' + $scope.properties.length + ' properties');

          drawMarkers();
        }).
        error(function(data, status, headers, config) {
          console.error('Could not retrieve properties from server...');
        });        
    } else {
      $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethod}).
        success(  function(data, status, headers, config) {
          $scope.properties = data.result;
          dataCache.put('properties.list', data.result);
          dataCache.put('properties.ts', Date.now());

          console.log('Got ' + $scope.properties.length + ' properties');

          drawMarkers();
        }).
        error(function(data, status, headers, config) {
          console.error('Could not retrieve properties from server...');
        });
    }
  }

  // google.maps.event.addDomListener(window, 'load', initialize);

}]);