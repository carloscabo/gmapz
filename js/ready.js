var
  map_sample_1A,
  map_sample_1B,
  map_sample_1C,
  map_sample_1D,
  map_sample_1E,
  map_sample_2,
  map_sample_3,
  map_sample_4,
  map_sample_5,
  map_sample_6,
  map_sample_7,
  map_sample_8,
  map_sample_9,
  autocomplete_1,
  autocomplete_2,
  map_sample_10,
  map_sample_11;

$(document).ready(function() {
  // La magia aquí

  // Activate console log messages
  GMapz.debug = true;

  // Map sample 1A *************************************************************

  map_sample_1A = new GMapz.map(
    $('#map-sample-1A'),
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

  // Map sample 1B *************************************************************

  map_sample_1B = new GMapz.map(
    $('#map-sample-1B'),
    { // Google Maps options
      center: [43.2486, -5.7767],
      zoom: 9,
      styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
    }
  );

  // Map sample 1C *************************************************************

  map_sample_1C = new GMapz.map(
    $('#map-sample-1C'),
    {
      // Empty Google Maps options
    },
    // One single marker / location
    {
      bolera_de_mieres: {
        lat: 43.239175,
        lng: -5.779116,
        iw: 'Puede que los mejores callos del mundo ;)'
      }
    }
  );

  map_sample_1C.onReady = function(){
    // this = google.maps instance
    // this.setSingleMarkerZoom(false); // Disable singleMarkerZoom
    this.setSingleMarkerZoom(16); // Set custom value
    this.fitBounds();
  };

  // Map sample 1E *************************************************************

  var map_sample_1E_options = {
      center: [43.2486, -5.7767]
  };

  map_sample_1E = new GMapz.map(
    $('#map-sample-1E'),
    map_sample_1E_options,
    france_cities // gmapz.locations.js
  );

  map_sample_1E.onReady = function(){
    // this = google.maps instance
    this.fitBounds();
  };

  // Map sample 1F *************************************************************

  var map_sample_1F_options = {
    // Options here
    mapTypeId: 'ROADMAP', // 'ROADMAP' / 'SATELLITE' / 'HYBRID' / 'TERRAIN'... caps
    center: [48, 2],
    zoom: 5
  };

  map_sample_1F = new GMapz.map(
    $('#map-sample-1F'),
    map_sample_1F_options,
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

  map_sample_1F.onReady = function() {
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

  map_sample_7 = new GMapz.map(
    $('[data-gmapz="gz-sample-7"]')
  );

  map_sample_7.onReady = function() {
    this.addLocations(spain_locs).fitBounds();
  };

  map_sample_7.errorAddressNotFound = function(addr) {
    console.log('Was unable to find: '+addr);
  };

  // Map sample 8 *************************************************************

  map_sample_8 = new GMapz.map(
    $('#map-sample-8'), {
      center: [41.8919, 12.5113],
      zoom: 12
    }
  );

  autocomplete_1 = new GMapz.autocomplete($('#my-autocomplete-1'));

  autocomplete_1.onChange = function () {
    // this = autocomplete
    var
      place = this.instance.getPlace(),
      pos = {};

    if(typeof place.geometry === 'undefined') {
      // No se ha encontrado el lugar
      alert('No encontrado');
      return;
    }
    // Creamos un nuevo marcador
    pos['autocomplete'] = {
      pin: 'autocomplete',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      draggable: true,
      iw : 'My infowindow 1'
    };
    // Chainning methods
    map_sample_8.setAllMarkersVisibility(false).addLocations(pos).fitToPlace(place,18).openInfoWindow('autocomplete');
  };

  // Map sample 9 *************************************************************

  map_sample_9 = new GMapz.map($('#map-sample-9'));

  map_sample_9.onReady = function() {
    this.addLocations(italy_cities).fitBounds();
  };

  autocomplete_2 = new GMapz.autocomplete($('#my-autocomplete-2'));

  autocomplete_2.onChange = function () {
    // this = autocomplete obj
    var place = this.instance.getPlace();
    if(typeof place.geometry === 'undefined') {
      // Place not found
      alert('Dirección no encontrada');
      return;
    }
    // We show place and closest marker
    map_sample_9.geoShowPosition(place);
  };

  // Map sample 10 *************************************************************

  map_sample_10 = new GMapz.map($('#map-sample-10'));

  map_sample_10.onReady = function() {
    // Enables responsive control
    this.addScrollControl();
    // Load Italy cities
    this.addLocations(italy_cities).fitBounds();
    // Responsive events
    MQBE.on('enter', 'mobile', function() {
      map_sample_10.lockScroll();
    }).on('leave', 'mobile', function() {
      map_sample_10.resumeScroll();
    });
  };

  map_sample_10.onDraw = function() {
    console.log(this.convertLatLngToPixels(
      new google.maps.LatLng(41.890, 12.500)
    ));
  };

  $(document).on('click touchstart', '#js-btn-scroll-lock', function(e) {
    e.preventDefault();
    $('body').addClass('force-show-scroll-control');
    map_sample_10.lockScroll();
  });

  $(document).on('click touchstart', '#js-btn-scroll-resume', function(e) {
    e.preventDefault();
    $('body').removeClass('force-show-scroll-control');
    map_sample_10.resumeScroll();
  });

  // Map sample 11 *************************************************************

  GMapz.onGoogleMapsReady = function () {
    // Enable infobox library
    infoBoxLoader(true);
  };

  // Start map with default options
  map_sample_11 = new GMapz.map($('#map-sample-11'));

  map_sample_11.onReady = function() {

    // Define custom infobox style
    var
      ib_options = {
        content: '<div class="gmapz-ibx"><div class="gmapz-ibx-close"></div><div class="gmapz-ibx-content">{{__REPLACE__}}</div></div>',
        pixelOffset: new google.maps.Size(-130, -96), // x, y
        closeBoxURL: '',
        enableEventPropagation: true
        /* disableAutoPan: false,
        maxWidth: 0,
        zIndex: null,
        boxStyle: {
          background: "url('tipbox.gif') no-repeat",
          opacity: 0.75,
          width: "280px"
        },
        closeBoxMargin: "10px 2px 2px 2px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false*/
      };

    // Add custom infobox to the map
    this.defineInfoBox( ib_options );

    // Load Italy cities AFTER define infobox
    this.addLocations(italy_cities).fitBounds();
  };

  map_sample_11.onDraw = function() {
    // Open Rome marker / infobox
    this.markers['roma'].click();
  };

  // Attachear botones ********************************************************

  // Attach button with data-gmapz attribute
  GMapz.attachActionButtons();

});

