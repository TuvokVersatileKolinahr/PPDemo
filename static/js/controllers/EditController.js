/**
 * EditController. Responsible fot the 'editview'.
 */
app.controller('EditController', function($scope, $routeParams, PropertyData, $location){

  /** --- local variables --- **/
  $scope.propertyId = $routeParams.propertyId;

  /**
   * Initilizes the view.
   * retrieves the selected property from the central cached list.
   */
  PropertyData.getProperty($scope.propertyId)
    .then(function(data) {
      // promise fulfilled
      if (data) {
        $scope.selected = data;
      } else {
        console.log("Received no property.");
      }
    }, function(error) {
      console.error("Error fetching properties", error);
    });

  /** --- public methods --- **/

  /**
   * Updates a property
   *
   * @param Object the property
   */
  $scope.update = function(property) {
    PropertyData.updateProperty($scope.selected.primaryKey, property)
      .then(function(data) {
        // promise fulfilled
        if (data.result.length === 0) { //there is no error
          $location.path( "#/properties" );
        }
      }, function(error) {
        console.error("Error updating properties", error);
      });
  };

});

