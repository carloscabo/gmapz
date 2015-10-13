//
// Creates instances of GMapz autocomplete
//
GMapz.autocomplete = (function() {

  function Constructor($input, user_settings) {

    // map
    this.map = null;    // gm object
    this.$input = $input;   // JQuery selector
    this.input_id = null; // string ID

    // Data and internal config
    this.config = {
      is_initialized: false,
    };

    // Autocomplete event listener
    this.listener = null;

    // Autocomplete settings on initialization
    this.autocomplete_settings = {

    };

    // ID único del mapa
    if (this.$input.attr('data-gmapz-autocomplete')) {
      this.input_id = this.$map.attr('data-gmapz-autocomplete');
    } else {
      this.input_id = GMapz.getUniqueId(8,'ac-');
      this.$map.attr('data-gmapz-autocomplete', this.input_id);
    }

    // Extend settings
    $.extend(this.autocomplete_settings, user_settings);

    // Attach objecto DOM element
    $input[0].autocompletez = this;

    // Request GM Api, instanceReady() will be called when done
    GMapz.requestAPI();
  }

  Constructor.prototype = {

    //
    // Methods
    //

    instanceReady: function(e) {
      console.log(this.input_id+' instance is initialized');

      //function code
      this.config.is_initialized = true;

      // Calling the constructor, initializing the map
      // this.map = new google.maps.Map($("[data-gmapz='"+this.map_id+"']")[0], this.map_settings);

      this.onReady();
    },

    // Override from outside
    onReady: function() {
      console.log(this.input_id+' autocomplete instance is ready');
    },


    //
    // Eventos
    //
    onMarkerDragEnd: function(marker) {
      console.log(marker);
    },
    afterAddingMarkers: function() {},
    errorAddressNotFound: function(addr) {},

  };

  return Constructor;

})();

