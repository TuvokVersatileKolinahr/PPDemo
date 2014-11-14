/**
 * MainController. Responsible fot the 'mapview'.
 */
app.controller('MainController', function($scope, $http, config, PropertyData, MapService){

  /** --- local variables --- **/

  /**
   * Initializes the map
   */
  var map = MapService.initialize();
  var markers = [];
  var propertyPromise = function() {
    PropertyData.getProperties()
      .then(function(data) {
        // promise fulfilled
        if (data.result.length > 0) {
          $scope.properties = data.result;
          markers = MapService.drawMarkers(map, data.result);
          for (var i = markers.length - 1; i >= 0; i--) {
            var marker = markers[i];
            // // wrap inside a closure to keep reference to the right marker...
            (function(marker){
              google.maps.event.addListener(marker, 'click', function() {
                // show side panel
                $scope.$apply(function(){
                  $scope.showInfo = true;
                  $scope.selectMarker(marker.id);
                });
              });
            })(marker);
          };
        } else {
          console.log("Received no properties.");
        }
      }, function(error) {
        console.error("Error fetching properties", error);
      });
  };
  propertyPromise();
  
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