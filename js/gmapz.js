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
        t.closeAllInfoWindows();
        t.iw_visible = t.g_infowindows[this.idx];
        t.g_infowindows[this.idx].open(t.g_map, t.g_markers[this.idx]);
      });
    } //for

    // Bounds with several markers
    t.g_map.fitBounds(t.g_bounds);

    // Single mark zoom adjust
    t.singleMarkerZoomAdjust();
  },

  singleMarkerZoomAdjust: function (max, target) {
    // Single mark zoom adjust
    var
      t = this;

    if (!max) max = 16;
    if (!target) target = 14;

    var listener = google.maps.event.addListener(t.g_map, 'idle', function() {
      if (t.g_map.getZoom() > max) t.g_map.setZoom(target);
      google.maps.event.removeListener(listener);
    });
  },

  closeAllInfoWindows: function () {
    var t = this;
    if(t.iw_visible) {
      t.iw_visible.close();
    }
  },

  allMarkersVisible: function (visible) {
    var t = this;
    t.closeAllInfoWindows();
    t.g_bounds = new google.maps.LatLngBounds();
    for (var key in t.g_markers) {
      t.g_markers[key].setVisible(visible);
      t.g_bounds.extend(t.g_markers[key].getPosition());
    }
    if (visible) {
      t.g_map.fitBounds(t.g_bounds);
    }
  },

  // Expects array
  showMarkerGroup: function (group) {
    var t = this;
    t.closeAllInfoWindows();
    t.allMarkersVisible(false);

    t.g_bounds = new google.maps.LatLngBounds();
    for (var i in group) {
      t.g_markers[group[i]].setVisible(true);
      t.g_bounds.extend(t.g_markers[group[i]].getPosition());
    }
    t.g_map.fitBounds(t.g_bounds);

    if (group.length == 1) {
      t.singleMarkerZoomAdjust();
    }
  },

  zoomTo: function (lat, lon, zoom) {
    var t = this;
    t.g_map.setCenter(new google.maps.LatLng(lat, lon));
    t.g_map.setZoom(zoom);
  },

  initButtons: function(button_class) {

    var
      t = this;

    // Show group of markers by idx
    $('*[data-gmapz-showgroup]').click(function (e) {
      e.preventDefault();
      var d = $(this).data('gmapz-showgroup') + '';
      if(d.indexOf(',') === -1) {
        t.showMarkerGroup([d]);
      } else {
        // Trim and split
        t.showMarkerGroup($.map(d.split(","),$.trim));
      }
    });

    // zoom
    $('*[data-gmapz-zoom]').click(function (e) {
      e.preventDefault();
      var d = $(this).data('gmapz-showgroup') + '';
      if(d.indexOf(',') === -1) {
        t.showMarkerGroup([d]);
      } else {
        // Trim and split
        t.showMarkerGroup($.map(d.split(","),$.trim));
      }
    });

    // Functions
    $('*[data-gmapz-function]').click(function (e) {
      e.preventDefault();
      var
        f = $(this).data('gmapz-function') + '',
        $t = $(this);

      switch (f) {
      case 'show-all':
        t.allMarkersVisible(true);
        break;
      case 'zoom':
        t.zoomTo($t.data('lat'), $t.data('lon'), $t.data('zoom'));
        break;
      default:
        return false;
      }
    });



  }
};
