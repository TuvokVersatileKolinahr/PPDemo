/**
 * EditController. Responsible fot the 'editview'.
 */
app.controller('EditController', function($scope, $http, config, $routeParams, PropertyData){

  /** --- local variables --- **/
  $scope.propertyId = $routeParams.propertyId;

  var propertyPromise = function() {
    PropertyData.getProperties()
      .then(function(data) {
        // promise fulfilled
        if (data.result.length > 0) {
          // Find the selected property
          data.result.forEach(function(p){
            if (p.code === $scope.propertyId){
              $scope.selected = p;
            }
          });
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
   * Updates a property
   *
   * @param Object the property
   */
  $scope.update = function(property) {
    // var aArguments    = [$scope.selected.primaryKey, "\""+$scope.selected.name+"\""];
    // $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethodSave, args: aArguments}).
    //   success(  function(data, status, headers, config) {
    //     $scope.properties = data.result;
    //     dataCache.put('properties.list', data.result);
    //     dataCache.put('properties.ts', Date.now());

    //     console.log('Got ' + $scope.properties.length + ' properties');

    //     // drawMarkers();
    //     $location.path( "/" );
    //   }).
    //   error(function(data, status, headers, config) {
    //     console.error('Could not retrieve properties from server...');
    //   });
  };

  //TODO: After succesfull edit a cacherefresh is due
  // dataCache.put('properties.ts', 0);

});

