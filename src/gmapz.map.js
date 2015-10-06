//
// Creates instances of GMapz maps
//
GMapz.gz_map = (function() {

  function Constructor(map_id, user_settings, locs) {
    this.map_id = map_id;
    this.locs = locs;
    $.extend(this.map_settings, user_settings);

    // Request GM Api, instanceReady() will be called when done
    GMapz.requestAPI();
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
      mapTypeId: 'ROADMAP'
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

      console.log(this.map_settings);

      //function code
      this.gz_settings.is_initialized = true;

      // Fix spacial settings
      this.map_settings.mapTypeId = google.maps.MapTypeId[this.map_settings.mapTypeId];
      this.maps_settings.center = new google.maps.LatLng(
        this.maps_settings.center[0],
        this.maps_settings.center[1]
      );

      // Calling the constructor, initializing the map
      this.map = new google.maps.Map($("[data-gmapz='"+this.map_id+"']")[0], this.map_settings);
    },

  };

  return Constructor;

})();

//
// JQuery hook
//
$.fn.gmapz = function ( options, markers ) {
  return this.each(function () {
    if (!$.data(this, "plugin_gmapz")) {
      var map_id = GMapz.getUniqueId(8,'gz-');
      $(this).attr('data-gmapz', map_id).data("plugin_gmapz", new GMapz.gz_map(map_id, options));
    }
  });
};
