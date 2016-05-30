var
  map_sample_1A,
  map_sample_1B,
  map_sample_1C,
  map_sample_1D,
  map_sample_1E,
  map_sample_2A,
  map_sample_4A,
  map_sample_4B,
  map_sample_4C,
  map_sample_4D,
  map_sample_4E,
  map_sample_6A,
  map_sample_6B,
  map_sample_7A;

$(document).ready(function() {
  // La magia aquí

  // Activate console log messages
  GMapz.debug = true;
  // This key is valid only for the samples in this page!
  GMapz.APIKEY ='AIzaSyCyL4U5ihhLdpTxsfR6A7FMtj1j5bOui9o';

  // Map sample 1A *************************************************************

  map_sample_1A = new GMapz.map(
    $('#map-sample-1A'),
    { // Google Maps options
      scrollwheel: true, // Default
      scaleControl: true, // Default
      center: [48.860, 2.340],
      bounds: [49.7198, 4.1335, 47.9851, 0.5464],
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

  // Map sample 2A *************************************************************

  var map_sample_2A = new GMapz.map(
    $('[data-gmapz="gz-sample-2A"]')
  );

  map_sample_2A.onReady = function() {
    this.addLocations(spain_locs).fitBounds();
  };

  $('#js-add-markers-2A').on('click', function(e) {
    e.preventDefault();
    map_sample_2A.addLocations(morocco);
  });
  $('#js-delete-markers-2A').on('click', function(e) {
    e.preventDefault();
    map_sample_2A.deleteMarkers(['FEZ','ORAN',12]);
  });
  $('#js-update-marker-2A').on('click', function(e) {
    e.preventDefault();
    map_sample_2A.addLocations(update);
  });

  // Map sample 4A *************************************************************

  map_sample_4A = new GMapz.map($('#map-sample-4A'));

  map_sample_4A.onReady = function() {
    this.addLocations(italy_cities).fitBounds();
  };

  autocomplete_4A = new GMapz.autocomplete($('#my-autocomplete-4A'));

  autocomplete_4A.onChange = function () {
    // this = autocomplete obj
    var place = this.instance.getPlace();
    if(typeof place.geometry === 'undefined') {
      // Place not found
      alert('Dirección no encontrada');
      return;
    }
    // We show place and closest marker
    map_sample_4A.geoShowPosition(place);
  };

  // Map sample 4B *************************************************************

  map_sample_4B = new GMapz.map(
    $('#map-sample-4B'), {
      center: [41.8919, 12.5113],
      zoom: 12
    }
  );

  autocomplete_4B = new GMapz.autocomplete($('#my-autocomplete-4B'));

  autocomplete_4B.onChange = function () {
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
    map_sample_4B.setAllMarkersVisibility(false).addLocations(pos).fitToPlace(place,18).openInfoWindow('autocomplete');
  };

  // Map sample 4C *************************************************************

  // Start gmapz with default options
  var map_sample_4C = new GMapz.map(
    $('[data-gmapz="gz-sample-4C"]')
  );

  // onReady add locations and fit bounds
  map_sample_4C.onReady = function() {
    this.addLocations(spain_locs).fitBounds();
  };

  // attachActionButtons is at the end of this file
  // GMapz.attachActionButtons();

  // Map sample 4D *************************************************************

  map_sample_4D = new GMapz.map(
    $('[data-gmapz="gz-sample-4D"]')
  );

  map_sample_4D.onReady = function() {
    this.addLocations(spain_locs).fitBounds();
  };

  map_sample_4D.errorAddressNotFound = function(addr) {
    console.log('Was unable to find: '+addr);
  };

  // Map sample 5A, responsive *************************************************************

  map_sample_5A = new GMapz.map($('#map-sample-5A'));

  map_sample_5A.onReady = function() {
    // Enables responsive control
    this.addScrollControl();
    // Load Italy cities
    this.addLocations(italy_cities).fitBounds();
    // Responsive events
    MQBE.on('enter', 'mobile', function() {
      map_sample_5A.lockScroll();
    }).on('leave', 'mobile', function() {
      map_sample_5A.resumeScroll();
    });
  };

  map_sample_5A.onDraw = function() {
    console.log(this.convertLatLngToPixels(
      new google.maps.LatLng(41.890, 12.500)
    ));
  };

  $(document).on('click touchstart', '#js-btn-scroll-lock-5A', function(e) {
    e.preventDefault();
    $('body').addClass('force-show-scroll-control');
    map_sample_5A.lockScroll();
  });

  $(document).on('click touchstart', '#js-btn-scroll-resume-5A', function(e) {
    e.preventDefault();
    $('body').removeClass('force-show-scroll-control');
    map_sample_5A.resumeScroll();
  });

  // Map sample 6A *************************************************************

  map_sample_6A = new GMapz.map(
    $('#map-sample-6A'), {
      center: [36.08, -6.82],
      zoom: 5,
      pixelOffset: [158, 100] // Offset of infowindow
    }
  );

  map_sample_6A.onReady = function() {
    this.addLocations(spain_locs).fitBounds();
  };

  // Map sample 6B *************************************************************

  GMapz.onGoogleMapsReady = function () {
    // Enable infobox library
    infoBoxLoader(true);
  };

  // Start map with default options
  map_sample_6B = new GMapz.map($('#map-sample-6B'));

  map_sample_6B.onReady = function() {

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

  map_sample_6B.onDraw = function() {
    // Open Rome marker / infobox
    this.markers['roma'].click();
  };

  // Map sample 7A *************************************************************

  $('.js-open-lightbox-7A.fancybox').on('click', function(e) {
    e.preventDefault();
    $.fancybox.open('<div id="fancy-map" style="width:100%;height:100%;"></div>', {
      autoSize: false,
      width: 800,
      height: 600,
      afterShow: function() {
        // WARNING!
        // For some reason the afterShow event of fancybox seems
        // to be executed BEFORE the container is drawn.
        // This causes issues with Google Maps, to be sure that the
        // fancybox is drawn we call GMpaz inside a setTimeout, 0ms
        // http://stackoverflow.com/a/779785/748321
        setTimeout(function(){
          map_sample_7A = new GMapz.map(
            $('#fancy-map'),
            {
              center: [48.860, 2.340],
              zoom: 12
            },
            {
              map_point: {
                lat: 48.860,
                lng: 2.340
              }
            }
          );
        } ,0);
      }
    });
  });


  // Attach button with data-gmapz attribute ********************************************************

  GMapz.attachActionButtons();

}); // Domready
