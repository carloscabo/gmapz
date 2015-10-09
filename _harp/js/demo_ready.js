var
  map_sample_1,
  map_sample_2;

$(document).ready(function() {
  // La magia aquí

  // Map sample 1
  map_sample_1 = new GMapz.map(
    $('#map-sample-1'),
    { // Google Maps options
      scrollwheel: true, // Default
      scaleControl: true, // Default
      center: [48.860, 2.340],
      bound: [4.1335, 49.7198, 0.5464, 47.9851],
      // zoom: 9 You can set `zoom` instead of bounds
      // 'ROADMAP' / 'SATELLITE' / 'HYBRID' / 'TERRAIN'
      mapTypeId: 'ROADMAP' // Default
    }
  );

  // Map sample 2
  map_sample_2 = new GMapz.map(
    $('#map-sample-2'),
    { // Google Maps options
      center: [43.2486, -5.7767],
      zoom: 9,
      styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
    }
  );

  // Map sample 3
  var map_3_options = {
      center: [43.2486, -5.7767]
  };

  map_sample_3 = new GMapz.map(
    $('#map-sample-3'),
    map_3_options,
    france_cities // demo_locations.js
  );

  map_sample_3.onReady = function(){
    // this = google.maps instance
    this.fitBounds();
  }

});
