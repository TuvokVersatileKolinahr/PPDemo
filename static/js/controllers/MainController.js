/**
 * MainController. Responsible fot the 'mapview'.
 */
app.controller('MainController', function($scope, $http, config, PropertyData, MapService){

  /** --- local variables --- **/
  $scope.properties = new PropertyData();

  /**
   * Initializes the map
   */
  var map = MapService.initialize();

  $scope.$watch("properties", function(newValue, oldValue) {
    if ($scope.properties) {
      console.log('Resultset is loaded', $scope.properties.result);
    }
  });
  
  // var markers = MapService.drawMarkers(map, $scope.properties.result);

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

});