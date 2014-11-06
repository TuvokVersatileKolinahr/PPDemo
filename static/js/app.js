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
var app = angular.module('propertypassport', ['propertypassport.config'])

  .controller('MainController', ['$scope', '$http', 'config', function($scope, $http, config){

  var map, markers = [];

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
  $scope.clear = function(){
    $scope.showInfo = false;
  }

  function drawMarkers (data) {
    for (var t = 0; t < data.result.length; t++) {
      var property = $scope.properties[t];
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(property.comment.split(",")[0], property.comment.split(",")[1]),
        id: property.code, // set the ID for lookup purposes, @see selectMarker
        title: property.name,
        map: map
      });
      markers.push(marker);

      // wrap inside a closure to keep reference to the right marker...
      (function(marker){
        google.maps.event.addListener(marker, 'click', function() {               
          // TODO select the property in the list
          // show side panel
          $scope.$apply(function(){
            $scope.showInfo = true;
            $scope.selectMarker(marker.id);
          });
        });
      })(marker);
    }
  }

  if (config.localdev) {
    $http.get('static/js/mock.js').
      success(  function(data, status, headers, config) {
        $scope.properties = data.result;

        console.log('Got ' + $scope.properties.length + ' properties');

        drawMarkers(data);
      }).
      error(function(data, status, headers, config) {
        console.error('Could not retrieve properties from server...');
      });
  } else { 
    $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethod}).
      success(  function(data, status, headers, config) {
        $scope.properties = data.result;

        console.log('Got ' + $scope.properties.length + ' properties');

        drawMarkers(data);
      }).
      error(function(data, status, headers, config) {
        console.error('Could not retrieve properties from server...');
      });
    }

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