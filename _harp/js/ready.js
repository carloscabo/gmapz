var
  map_sample_1,
  map_sample_2;

$(document).ready(function() {
  // La magia aquí

  // Map sample 1 *************************************************************

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

  // Map sample 2 *************************************************************

  map_sample_2 = new GMapz.map(
    $('#map-sample-2'),
    { // Google Maps options
      center: [43.2486, -5.7767],
      zoom: 9,
      styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
    }
  );

  // Map sample 3 *************************************************************

  var map_sample_3_options = {
      center: [43.2486, -5.7767]
  };

  map_sample_3 = new GMapz.map(
    $('#map-sample-3'),
    map_sample_3_options,
    france_cities // demo_locations.js
  );

  map_sample_3.onReady = function(){
    // this = google.maps instance
    this.fitBounds();
  }

  // Map sample 4 *************************************************************

  var map_sample_4_options = {
    // Options here
    mapTypeId: 'ROADMAP', // 'ROADMAP' / 'SATELLITE' / 'HYBRID' / 'TERRAIN'... caps
    center: [48, 2],
    zoom: 5
  };

  map_sample_4 = new GMapz.map(
    $('#map-sample-4'),
    map_sample_4_options,
    france_cities
  );

  var marker_cluster_style = [{
    textColor: 'white',
    url: 'img/gmapz/pin-cluster.png',
    height: 48,
    width: 48,
    textSize: '17',
    backgroundPosition: '0 0'
    // anchorIcon: [-24.0, -48.0] // This propoerty its not supported actually
  }];

  map_sample_4.onReady = function() {
    // Convert markers object, into array
    markers_array = $.map(this.markers, function(val, idx){
      return [val];
    });
    this.marker_cluster = new MarkerClusterer(
      this.map,
      markers_array, {
        gridSize: 100,
        maxZoom: 15,
        styles: marker_cluster_style
      }
    );
  };

  // Map sample 5 *************************************************************

  var map_sample_5 = new GMapz.map(
    $('[data-gmapz="gz-sample-5"]')
  );

  map_sample_5.onReady = function() {
    this.addLocations(spain_locs).fitBounds();
  };

  $('#js-add-markers-5').on('click', function(e) {
    e.preventDefault();
    map_sample_5.addLocations(morocco);
  });
  $('#js-delete-markers-5').on('click', function(e) {
    e.preventDefault();
    map_sample_5.deleteMarkers(['FEZ','ORAN',12]);
  });
  $('#js-update-marker-5').on('click', function(e) {
    e.preventDefault();
    map_sample_5.addLocations(update);
  });

  // Map sample 6 *************************************************************

  var map_sample_6 = new GMapz.map(
    $('[data-gmapz="gz-sample-6"]')
  );

  map_sample_6.onReady = function() {
    this.addLocations(spain_locs).fitBounds();
  };

  // Map sample 7 *************************************************************

  var map_sample_7 = new GMapz.map(
    $('[data-gmapz="gz-sample-7"]'),
    {}, // default options
    spain_locs
  );

  map_sample_7.onReady = function() {
    this.fitBounds();
  };

  map_sample_7.errorAddressNotFound = function(addr) {
    console.log('Was unable to find: '+addr);
  };

  // Map sample 8 *************************************************************

  var map_sample_8 = new GMapz.map(
    $('#map-sample-8'),
    {
      center: [41.8919, 12.5113],
      zoom: 12
    }
  );

  map_sample_8.onReady = function() {
    // this.fitBounds();
  };

  // Attachear botones ********************************************************

  // Attach button with data-gmapz attribute
  GMapz.attachActionButtons();

});
