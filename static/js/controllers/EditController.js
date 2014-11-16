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
    PropertyData.updateProperty($scope.selected.primaryKey, "\""+$scope.selected.name+"\"")
      .then(function(data) {
        // promise fulfilled
        if (data.result.length > 0) {
          //TODO: After succesfull edit a cacherefresh is due
          dataCache.put('properties.ts', 0);
          dataCache.put('properties.list', data.result);
        } else {
          console.log("Received no properties.");
        }
      }, function(error) {
        console.error("Error fetching properties", error);
      });
    };
  };


});

