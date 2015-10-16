//
// Creates instances of GMapz autocomplete
//
GMapz.autocomplete = (function() {

  function Constructor($input, user_settings) {

    if($input.length === 0) {
      if (GMapz.debug) console.warn("<input> '"+$input.selector+"' not found!");
      return false;
    }

    // Autocomplete
    this.$input = $input;   // JQuery selector
    this.input_id = null; // string ID
    this.instance = null;
    this.listener = null;

    // User settings
    if(typeof user_setting === 'undefined') {
      user_settings = {};
    }

    // Data and internal config
    this.config = {
      is_initialized: false,
    };

    // ID único del mapa
    if (this.$input.attr('data-gmapz-autocomplete')) {
      this.input_id = this.$input.attr('data-gmapz-autocomplete');
    } else {
      this.input_id = GMapz.getUniqueId(8,'ac-');
      this.$input.attr('data-gmapz-autocomplete', this.input_id);
    }

    // Autocomplete settings on initialization
    this.autocomplete_settings = {
      types: ['geocode'],
      offset: 3 //,
      // componentRestrictions: { 'country': 'es' }
    };

    // Extend settings
    $.extend(this.autocomplete_settings, user_settings);

    // Attach objecto DOM element
    $input[0].gmapz = this;

    // Request GM Api, instanceReady() will be called when done
    GMapz.requestAPI();
  }

  Constructor.prototype = {

    //
    // Methods
    //

    instanceReady: function(e) {
      if (GMapz.debug) console.info("'"+this.input_id+"' instance initialized");

      var that = this;

      this.config.is_initialized = true;

      this.instance = new google.maps.places.Autocomplete(
        this.$input[0],
        this.autocomplete_settings
      );

      this.listener = google.maps.event.addListener(this.instance, 'place_changed', function(){
        that.onChange(this);
      });

      this.onReady();
    },

    //
    // Eventos
    //

    // Override from outside
    onReady: function() {
      if (GMapz.debug) console.info("'"+this.input_id+"' autocomplete instance is ready");
    },

    // Override from outside
    onChange: function () {
      /*
      map_5.deleteAllMarkers();
      var locs = {};
      var place = this.instance.getPlace();
      locs['autocomplete'] = {
        lat: place.geometry.location.A,
        lng: place.geometry.location.F,
        draggable:true,
        title:"Drag me!"
      };
      map_5.fitToPlace(place);
      */
    },

    afterChange: function() {

    }

  };

  return Constructor;

})();

