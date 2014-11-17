/**
 * EditController. Responsible fot the 'editview'.
 */
app.controller('EditController', function($scope, $http, config, $routeParams, PropertyData, $location){

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
    //"\""+$scope.selected.name+"\""
    PropertyData.updateProperty($scope.selected.primaryKey, property)
      .then(function(data) {
        // promise fulfilled
        if (data.result.length === 0) { //there is no error
          $location.path( "#/properties" );
        }
      }, function(error) {
        console.error("Error fetching properties", error);
      });
  };

});

