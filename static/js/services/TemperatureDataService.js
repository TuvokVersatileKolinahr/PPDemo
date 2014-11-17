app.service('TemperatureDataService', function(config){
  var _chartOptions = {
    graphElement: '.graph'
  };

  /**
   * Adds the temperature graph to the info panel
   */
  this.insertGraph = function(sensorId) {
        removeTempGraph();
        console.log("Fetch temperature data selectMarker");
        if (config.localdev) {
          getTempGraph('static/js/temperaturedata.js?t_id=' + sensorId, _chartOptions.graphElement);
        } else {
          getTempGraph('/sensors/' + sensorId + '/readings/temp', _chartOptions.graphElement);
        }
  }

});