/**
 * MainController. Responsible fot the 'mapview'.
 */
app.controller('MainController', function($scope, $http, config, PropertyData){

  /** --- local variables --- **/

  var map, markers = [];
  // var properties = dataCache.get('properties.list');

  $scope.properties = new PropertyData();

  /** --- public methods --- **/

  /**
   * Zoom to a marker with a specific ID on the map
   *
   * @param string The id of the marker
   *
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
      if ($scope.showInfo) {
        removeTempGraph();
        console.log("Fetch temperature data selectMarker");
        if (config.localdev) {
          getTempGraph('static/js/temperaturedata.js?t_id=' + $scope.selected.tempSensorId);
        } else {
          getTempGraph('/sensors/' + $scope.selected.tempSensorId + '/readings/temp');
        }
      }
    }
    return marker;
  };

  /**
   * Select marker with a specific ID and show info
   *
   * @param string The id of the marker
   */
  $scope.selectMarkerWithInfo = function(id){
    if ($scope.selectMarker(id)){
      console.log("Fetch temperature data selectMarkerWithInfo");
      $scope.showInfo = !$scope.showInfo;
    }
  }
  /**
   * Clears the info of a marker with a specific ID
   *
   * @param string The id of the marker
   */
  $scope.clear = function(event){
    $scope.showInfo = false;
    if(event){
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /** --- private methods --- **/

  /**
   * Initializes the map
   */
  function _initialize() {
    var mapOptions = {
      center: { lat: 51.845794, lng: 5.863969 }, //Nijmegen
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  /**
   * Draws markers on the map
   */
  function _drawMarkers () {
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

  /**
   * Initializes the map
   */
  _initialize();


});