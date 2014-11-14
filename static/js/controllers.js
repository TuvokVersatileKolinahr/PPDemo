var ppControllers = angular.module('ppControllers', []);

/**
 * EditController. Responsible fot the 'editview'.
 */
ppControllers.controller('EditController', function($scope, $http, config, $routeParams, dataCache){

  /** --- local variables --- **/


  /** --- scoped variables --- **/
  $scope.propertyId = $routeParams.propertyId;
  $scope.properties = dataCache.get('properties.list')
  // Find the selected property
  $scope.properties.forEach(function(p){
    if (p.code === $scope.propertyId){
      $scope.selected = p;
    }
  });


  /** --- public methods --- **/

  /**
   * Updates a property
   *
   * @param Object the property
   */
  $scope.update = function(property) {
    var aArguments    = [$scope.selected.primaryKey, "\""+$scope.selected.name+"\""];
    $http.post(config.serviceUrl + config.buildingServiceName, {method:config.executeMethodSave, args: aArguments}).
      success(  function(data, status, headers, config) {
        $scope.properties = data.result;
        dataCache.put('properties.list', data.result);
        dataCache.put('properties.ts', Date.now());

        console.log('Got ' + $scope.properties.length + ' properties');

        // drawMarkers();
        $location.path( "/" );
      }).
      error(function(data, status, headers, config) {
        console.error('Could not retrieve properties from server...');
      });
  };

  //TODO: After succesfull edit a cacherefresh is due
  dataCache.put('properties.ts', 0);

});


/**
 * MainController. Responsible fot the 'mapview'.
 */
ppControllers.controller('MainController', function($scope, $http, config, dataCache){

  /** --- local variables --- **/

  var map, markers = [];
  var properties = dataCache.get('properties.list');

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
      // center: { lat: 51.5873617, lng: 4.7663469},//Breda
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

  /**
   * Handles the properties that are received from an external JSON/Webservice
   *
   * @param Object data
   * @param String return staus of the call
   * @param Object the headers
   * @param Object the configuration
   */
  function _handleProperties(data, status, headers, config) {
    if (data.result){
      for(var i=0; i < data.result.length; i++) {
        data.result[i].photoref = _fixPhotoRef(data.result[i].photoref);
      }

      $scope.properties = data.result;
      dataCache.put('properties.list', data.result);
      dataCache.put('properties.ts', Date.now());

    } else {
      dataCache.get('properties.list')
    }
    _drawMarkers();
  }

  /**
   * Initializes the map
   */
  _initialize();

  /**
   * Fetch the data from an external source if there is no cache version or if the cache is overdue
   */
  if (properties && (Date.now() - dataCache.get('properties.ts') < config.cache_refresh )) {
    //we have a cached version of the properties & cache is less than 'config.cache_refresh' old
    $scope.properties = properties;
    console.log('Got cached ' + $scope.properties.length + ' properties');
    _drawMarkers();
  } else { //we need to fetch the properties
    if (config.localdev) {
      $http.get('static/js/mock-nijmegen.js').
        success( _handleProperties ).
        error(function(data, status, headers, config) {
          console.error('Could not retrieve properties from server...');
        });        
    } else {
      $http.post(config.serviceUrl + config.buildingServiceName, {method:config.executeMethodGetList}).
        success( _handleProperties ).
        error(function(data, status, headers, config) {
          console.error('Could not retrieve properties from server...');
        });
    }
  }

});