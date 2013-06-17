GMapz = {

  // Related to GoogleMaps objects
  g_map: null,
  g_pins: {},
  g_shadows: {},
  g_markers: [],
  g_infowindows: [],
  g_bounds: null,

  // Custom objects / properties
  locations: [],
  iw_visible: false,
  iw_template: '<div class="gmapz-infowindow">{REPLACE}</a></div>',
  pin_base: null,
  pins: {},

  init: function(map_id) {

    var t = this;

    // Properties we want to pass to the map
    var g_map_options = {
      scrollwheel: false,
      zoom: 20, // zoom level of the map
      center: new google.maps.LatLng(0,0),
      mapTypeId: google.maps.MapTypeId.ROADMAP // map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    };

    // Calling the constructor, initializing the map
    t.g_map = new google.maps.Map(document.getElementById(map_id), g_map_options);

    // this.map.scrollWheelZoom.disable();

    // Create pins & shadows
    for (var key in t.pins) {

      // Pins
      if (t.pins[key]['pin']['img']) {

        // First define
        t.g_pins[key] = {};

        t.g_pins[key].pin = new google.maps.MarkerImage(t.pins[key]['pin']['img'],
           //width / height
          new google.maps.Size(t.pins[key]['pin']['size'][0], t.pins[key]['pin']['size'][1]),
          // origin
          new google.maps.Point(0,0),
          // anchor point
          new google.maps.Point(t.pins[key]['pin']['anchor'][0], t.pins[key]['pin']['anchor'][1])
        );
        // Shadows
        if (t.pins[key]['shadow']) {
          t.g_pins[key].shadow = new google.maps.MarkerImage(t.pins[key]['shadow']['img'],
             //width / height
            new google.maps.Size(t.pins[key]['shadow']['size'][0], t.pins[key]['shadow']['size'][1]),
            // origin
            new google.maps.Point(0,0),
            // anchor point same as pin
            new google.maps.Point(t.pins[key]['pin']['anchor'][0], t.pins[key]['pin']['anchor'][1])
          );
        } else {
          t.g_pins[key].shadow = null;
        }
      } else {
        t.g_pins[key].pin = null;
        t.g_pins[key].shadow = null;
      }
    }
  },

  draw: function(locations) {

    var
      t = this;

    // Array de coordenadas
    t.locations = locations;
    t.g_bounds = new google.maps.LatLngBounds();

    for (var i = t.locations.length - 1; i >= 0; i--) {

      var
        t_pin = null,
        t_sha = null,
        idx = t.locations[i]['idx'];

      // Setting pin & shadow
      // Default
      if (t.g_pins['default']) {
        t_pin = t.g_pins['default'].pin;
        t_sha = t.g_pins['default'].shadow;
      }

      // Customized for this point
      if (t.locations[i]['pin'] && t.g_pins[t.locations[i]['pin']]) {
        t_pin = t.g_pins[t.locations[i]['pin']].pin;
        if (t.g_pins[t.locations[i]['pin']].shadow) {
          t_sha = t.g_pins[t.locations[i]['pin']].shadow;
        }
      }

      // Markers array
      t.g_markers[idx] = new google.maps.Marker({
        idx: t.locations[i]['idx'],
        position: new google.maps.LatLng(t.locations[i]['lat'],t.locations[i]['lon']),
        map: t.g_map,
        icon: t_pin,
        shadow: t_sha
      });

      t.g_bounds.extend(t.g_markers[idx].getPosition());

      // Infowindows array
      t.g_infowindows[idx] = new google.maps.InfoWindow({
        content: t.iw_template.replace('{REPLACE}',t.locations[i]['iw'])
      });

      // Click on marker event
      var that = this;
      google.maps.event.addListener(t.g_markers[idx], 'click', function() {
        t.hideAllInfoWindows();
        t.iw_visible = t.g_infowindows[this.idx];
        t.g_infowindows[this.idx].open(t.g_map, t.g_markers[this.idx]);
      });
    } //for

    // Bounds with several markers
    t.g_map.fitBounds(t.g_bounds);

    // Single mark zoom adjust
    var listener = google.maps.event.addListener(t.g_map, 'idle', function() {
      if (t.g_map.getZoom() > 16) t.g_map.setZoom(14);
      google.maps.event.removeListener(listener);
    });
  },

  hideAllInfoWindows: function () {
    var t = this;
    if(t.iw_visible) {
      t.iw_visible.close();
    }
  },

  hideAllPins: function () {
    var t = this;
    t.hideAllInfoWindows();
    for (var key in t.g_markers) {
      t.g_markers[key].setVisible(false);
    }
  },

  initButtons: function(button_class) {

    var that = this;
    $(button_class).click(function(e) {
      e.preventDefault();
      var lat = $(this).data('lat');
      var lon = $(this).data('lon');
      var zoo = $(this).data('zoom');

      $(this).parents('ul').find('li').removeClass('active');
      $(this).parent('li').addClass('active');
      that.gmap.setCenter(new google.maps.LatLng($(this).data('lat'), $(this).data('lon')));
      that.gmap.setZoom(parseInt(zoo, 10));
    });

    // Click the first one
    //$(button_class).first().click();
  },
};
