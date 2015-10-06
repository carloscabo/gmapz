//
// Creates instances of GMapz maps
//
GMapz.map = (function() {

  function Constructor($map, user_settings, locs) {

    // map
    this.map = null;    // gm object
    this.$map = $map;   // JQuery selector
    this.map_id = null; // string ID

    // Settings of object
    this.gz_settings = {
      is_initialized: false,
      test_str: 'unitialized'
    };

    // Google maps settings on initialization
    this.map_settings = {
      scrollwheel: true,
      scaleControl: true,
      zoom: 9,
      center: [0,0],
      bounds: null,
      mapTypeId: 'ROADMAP' // 'ROADMAP' / 'SATELLITE' / 'HYBRID' / 'TERRAIN'
      /*
        styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
      */
    };

    // ID único del mapa
    if (this.$map.attr('data-gmapz')) {
      this.map_id = this.$map.attr('data-gmapz');
    } else {
      this.map_id = GMapz.getUniqueId(8,'gz-');
      this.$map.attr('data-gmapz', this.map_id);
    }

    // Localizaciones
    if (typeof locs !== 'undefined') {
      this.locs = locs;
    } else {
      this.locs = {};
    }

    // Marcadores (objectos de google)
    this.markers = {};

    // Info windows (objectos de google)
    this.iws = {};

    // Eventos
    onMarkerDragEnd = function(marker) {
      console.log(marker);
    }

    // Extend settings
    $.extend(this.map_settings, user_settings);

    // Attach objecto DOM element
    $map[0].gmapz = this;

    // Request GM Api, instanceReady() will be called when done
    GMapz.requestAPI();
  }

  Constructor.prototype = {

    //
    // Methods
    //

    instanceReady: function(e) {

      console.log('GMpaz instance is ready!');

      //function code
      this.gz_settings.is_initialized = true;

      // Fix spacial settings
      this.map_settings.mapTypeId = google.maps.MapTypeId[this.map_settings.mapTypeId];
      this.map_settings.center = new google.maps.LatLng(
        this.map_settings.center[0],
        this.map_settings.center[1]
      );

      // Bounds
      if (this.map_settings.bounds) {
        var bounds = new google.maps.LatLngBounds();
        bounds.extend( new google.maps.LatLng(
          this.map_settings.bounds[0],this.map_settings.bounds[1])
        );
        bounds.extend( new google.maps.LatLng(
          this.map_settings.bounds[2],this.map_settings.bounds[3])
        );
        this.map_settings.bounds = bounds;
        this.map.fitBounds(bounds);
      }

      // Calling the constructor, initializing the map
      this.map = new google.maps.Map($("[data-gmapz='"+this.map_id+"']")[0], this.map_settings);

      // Si hubiese algúna location la pintamos
      if (!jQuery.isEmptyObject(this.locs)) {
        console.log('Add locations');
        this.addLocations(this.locs);
      }
    },

    addLocations: function (locs) {

      // Get default pin
      if (GMapz.pins['default']) {
        default_pin = GMapz.pins['default'].pin;
      }

      for (var idx in locs) {
        current_pin = default_pin;
        // Customized for this point
        if (locs[idx].pin && GMapz.pins[locs[idx].pin]) {
          current_pin = GMapz.pins[locs[idx].pin].pin;
        }
        // Markers array
        var marker_options = {
          idx: idx,
          position: new google.maps.LatLng(locs[idx].lat,locs[idx].lng),
          map: this.map,
          icon: current_pin
        };
        // Draggable marker?
        if (locs[idx].draggable) { marker_options.draggable = true; }
        // Create marker
        this.markers[idx] = new google.maps.Marker(marker_options);
        // Draggable marker event
        if (locs[idx].draggable) {
          google.maps.event.addListener(
            this.markers[idx], 'dragend', function() {
              this.onMarkerDragEnd(this);
          });
        }

      }

    },

    testMethod: function(msg) {
      console.log(msg);
    }

  };

  return Constructor;

})();

//
// JQuery hook
//
/*(function($){

  var methods = {
    init: function(options) {
      var gz_id = $(this).attr('data-gmapz');
      if (typeof gz_id !== typeof undefined && gz_id !== false) {
        gz_id = GMapz.getUniqueId(8,'gz-');
        $(this).attr('data-gmapz', gz_id);
      }
      $(this).data('plugin_gmapz', new GMapz.gz_map(gz_id, options));
    },
    show: function( ) { },
    hide: function( ) { },
    addMarkers: function(locs) {  }
  };

  $.fn.gmapz = function ( methodOrOptions ) {

    if ( methods[methodOrOptions] ) {
      // Its a method
      return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else {
      // Its creation?
      if (!$.data(this, "plugin_gmapz")) {
        return methods.init.apply( this, arguments );
      }
    }
return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));


    return this.each(function () {
      // Avoid multiple instances
      if (!$.data(this, "plugin_gmapz")) {
        // If there is a data-gmapz use it, in other case generate and guid

      }
    });
  };

})( jQuery );
*/
