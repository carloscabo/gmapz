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
           // width / height
          new google.maps.Size(t.pins[key]['pin']['size'][0], t.pins[key]['pin']['size'][1]),
          // origin
          new google.maps.Point(0,0),
          // anchor point
          new google.maps.Point(t.pins[key]['pin']['anchor'][0], t.pins[key]['pin']['anchor'][1])
        );
        // Shadows
        if (t.pins[key]['shadow']) {
          t.g_pins[key].shadow = new google.maps.MarkerImage(t.pins[key]['shadow']['img'],
             // width / height
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

  rad: function (x) {
    return x*Math.PI/180;
  },

  findNearestMarkerTo: function (lat, lon) {
    var
      t = this,
      R = 6371, // radius of earth in km
      distances = [],
      nearidx = -1;

    for (var key in t.g_markers) {
      var mlat = t.g_markers[key].position.lat();
      var mlng = t.g_markers[key].position.lng();
      var dLat  = t.rad(mlat - lat);
      var dLong = t.rad(mlng - lon);
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(t.rad(lat)) * Math.cos(t.rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      distances[key] = d;
      if ( nearidx == -1 || d < distances[nearidx] ) {
        nearidx = key;
      }
    }
    return(nearidx);
  },

  findNearestMarkerToAddress: function (addr) {
    var
      t = this,
      geocoder = new google.maps.Geocoder();

    //convert location into longitude and latitude
    geocoder.geocode({
      address: addr
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        /*t.g_map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: t.g_map,
          position: results[0].geometry.location
        });*/
        //console.log(results[0].geometry.location);
        t.geoShowPosition(results[0].geometry.location);
      }
    });
  },

  geoShowPosition: function (pos){
    var
      t   = this,
      lat = null,
      lon = null,
      idx = null;

    // Navigator.geolocation
    if (pos.coords) {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } else {
      lat = pos.jb;
      lon = pos.kb;
    }

    idx = t.findNearestMarkerTo(lat, lon);
    var mlat = t.g_markers[idx].position.lat();
    var mlon = t.g_markers[idx].position.lng();

    t.closeAllInfoWindows();
    t.g_markers[idx].setVisible(true);
    t.iw_visible = t.g_infowindows[idx];
    t.g_infowindows[idx].open(t.g_map, t.g_markers[idx]);
    t.zoomTo(mlat, mlon, 16);
  },

  geoShowError: function (error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        console.log('An unknown error occurred.');
        break;
    }
  },

  buttonsFunctionality: function (f, $t) {
    var
      t = this;

    switch (f) {
    case 'show-group':
      var d = $t.data('group') + '';
      if(d.indexOf(',') === -1) {
        t.showMarkerGroup([d]);
      } else {
        // Trim and split
        t.showMarkerGroup($.map(d.split(","),$.trim));
      }
      break;
    case 'show-all':
      t.allMarkersVisible(true);
      break;
    case 'zoom':
      var idx = $t.data('idx');
      if (idx) {
        var
          lat = t.g_markers[idx].position.lat(),
          lon = t.g_markers[idx].position.lng();

        t.g_markers[idx].setVisible(true);
        t.zoomTo(lat, lon, $t.data('zoom'));
      } else {
        t.zoomTo($t.data('lat'), $t.data('lon'), $t.data('zoom'));
      }
      break;
    case 'find-near':
      var
        n = navigator.geolocation;
      if(n) {
        n.getCurrentPosition(t.geoShowPosition.bind(t), t.geoShowError.bind(t));
      } else {
        alert('Su navegador no soporta Geolocalización.');
      }
      break;
    case 'find-near-address':
      var
        a = $t.siblings('input[type=text]').val();
        if (a) {
          t.findNearestMarkerToAddress(a);
        }
      break;
    default:
      return false;
    }
  },

  // Button to control the map from outside
  buttonInit: function(button_class) {
    var
      t = this;

    // Generic buttons / <A>
    $('*[data-gmapz-function]').click(function (e) {
      e.preventDefault();
      var
        $t = $(this),
        f  = $t.data('gmapz-function') + '';
      t.buttonsFunctionality(f, $t);
    });

    // Selects
    $('select[data-gmapz-select]').change(function (e) {
      e.preventDefault();
      var
        $t = $(this).find(':selected'),
        f = $t.data('gmapz-function') + '';
      t.buttonsFunctionality(f, $t);
    });

  }
};




