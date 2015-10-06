//
// Creates instances of GMapz maps
//
GMapz.map = (function() {

  function Constructor($map, user_settings, locs) {

    // Elementos de JQuery contenedor del mapa
    this.$map = $map;

    // ID único del mapa
    var map_id = '';
    if (this.$map.attr('data-gmapz')) {
      map_id = this.$map.attr('data-gmapz');
    } else {
      map_id = GMapz.getUniqueId(8,'gz-');
      this.$map.attr('data-gmapz', map_id);
    }
    this.map_id = map_id;

    // Localizaciones
    if (typeof locs !== 'undefined') {
      this.locs = locs;
    }

    // Extend settings
    $.extend(this.map_settings, user_settings);

    // Request GM Api, instanceReady() will be called when done
    GMapz.requestAPI();

    $($map)[0].gmapz = this;
  }

  Constructor.prototype = {

    // map
    map: null,

    // Locations
    locs: {},

    gz_settings: {
      is_initialized: false
    },

    // Google maps settings on initialization
    map_settings: {
      scrollwheel: true,
      scaleControl: true,
      zoom: 9,
      center: [0,0],
      bounds: null,
      mapTypeId: 'ROADMAP' // 'ROADMAP' / 'SATELLITE' / 'HYBRID' / 'TERRAIN'
      /*
        styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
      */
    },

    // Pins for markers
    pins: {},
    img_path: 'img/gmapz/',

    //
    // Methods
    //

    instanceReady: function(e) {

      console.log('instance is ready!');

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
        bounds.extend( new t.GM.LatLng(
          this.map_settings.bounds[0],this.map_settings.bounds[1])
        );
        bounds.extend( new t.GM.LatLng(
          this.map_settings.bounds[2],this.map_settings.bounds[3])
        );
        this.map_settings.bounds = bounds;
        this.map.fitBounds(bounds);
      }

      // Calling the constructor, initializing the map
      this.map = new google.maps.Map($("[data-gmapz='"+this.map_id+"']")[0], this.map_settings);
    },

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
