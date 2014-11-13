/**
 * EditController. Responsible fot the 'editview'.
 */
app.controller('EditController', function($scope, $http, config, $routeParams, dataCache){

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
    $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethodSave, args: aArguments}).
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

