
// var data_url = 'static/js/temperaturedata.js';

function getTempGraph (data_url, graph_element) {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 400 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%d-%b-%y").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate('cardinal')
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.temp); });

  var svg = d3.select(graph_element).append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json(data_url, function(error, data) {
    data.forEach(function(d) {
      d.time = Date.parse(d.time);
    });

    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain(d3.extent(data, function(d) { return d.temp; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Energy Δ");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
  });

}
/*  augmenting native DOM functions for common removal functions  */
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
function removeTempGraph () {
  document.getElementsByClassName('graph')[0].getElementsByTagName('svg').remove();
}