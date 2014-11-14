app.service('MapService', function(){
  var _mapOptions = {
    center: { lat: 51.845794, lng: 5.863969 }, //Nijmegen
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  };

  /**
   * Initializes the map
   */
  this.initialize = function() {
    return new google.maps.Map(document.getElementById('map-canvas'), _mapOptions);
  }

  /**
   * Draws markers on the map
   */
  this.drawMarkers = function(map, properties) {
    var markers = [];
    for (var t = 0; t < properties.length; t++) {
      var property = properties[t];

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(property.comment.split(",")[0], property.comment.split(",")[1]),
        id: property.code, // set the ID for lookup purposes, @see selectMarker
        title: property.name,
        icon: 'static/img/marker.png',
        map: map
      });
      markers.push(marker);

    }
    return markers;
  }

});