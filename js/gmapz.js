GMapz = {

  // Abbreviatures
  gm: google.maps,

  // Related to GoogleMaps objects
  g_map: null,
  g_pins: {},   // Pins
  g_shds: {},   // Shadows
  g_mrks: [],   // Markers
  g_nfws: [],   // Info-windows
  g_bnds: null, // Bounds

  // Custom objects / properties
  locs: [], // Locations
  iw_visible: false,
  iw_template: '<div class="gmapz-infowindow">{REPLACE}</a></div>',
  pins: {},
  path: 'img/gmapz/',

  init: function(map_id) {
    var
      t = this;

    // Properties we want to pass to the map
    var g_map_options = {
      scrollwheel: false,
      zoom: 20, // zoom level of the map
      center: new t.gm.LatLng(0,0),
      mapTypeId: t.gm.MapTypeId.ROADMAP // map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    };

    // Calling the constructor, initializing the map
    t.g_map = new t.gm.Map(document.getElementById(map_id), g_map_options);

    // this.map.scrollWheelZoom.disable();

    // Create pins & shadows
    for (var key in t.pins) {

      // Pins
      if (t.pins[key]['pin']['img']) {

        // First define
        t.g_pins[key] = {};

        t.g_pins[key].pin = new t.gm.MarkerImage(t.pins[key]['pin']['img'],
           // width / height
          new t.gm.Size(t.pins[key]['pin']['size'][0], t.pins[key]['pin']['size'][1]),
          // origin
          new t.gm.Point(0,0),
          // anchor point
          new t.gm.Point(t.pins[key]['pin']['anchor'][0], t.pins[key]['pin']['anchor'][1])
        );
        // Shadows
        if (t.pins[key]['shadow']) {
          t.g_pins[key].shadow = new t.gm.MarkerImage(t.pins[key]['shadow']['img'],
             // width / height
            new t.gm.Size(t.pins[key]['shadow']['size'][0], t.pins[key]['shadow']['size'][1]),
            // origin
            new t.gm.Point(0,0),
            // anchor point same as pin
            new t.gm.Point(t.pins[key]['pin']['anchor'][0], t.pins[key]['pin']['anchor'][1])
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

  draw: function(locs) {

    var
      t = this;

    // Array de coordenadas
    t.locs = locs;
    t.g_bnds = new t.gm.LatLngBounds();

    for (var i = t.locs.length - 1; i >= 0; i--) {

      var
        t_pin = null,
        t_sha = null,
        idx = t.locs[i]['idx'];

      // Setting pin & shadow
      // Default
      if (t.g_pins['default']) {
        t_pin = t.g_pins['default'].pin;
        t_sha = t.g_pins['default'].shadow;
      }

      // Customized for this point
      if (t.locs[i]['pin'] && t.g_pins[t.locs[i]['pin']]) {
        t_pin = t.g_pins[t.locs[i]['pin']].pin;
        if (t.g_pins[t.locs[i]['pin']].shadow) {
          t_sha = t.g_pins[t.locs[i]['pin']].shadow;
        }
      }

      // Markers array
      t.g_mrks[idx] = new t.gm.Marker({
        idx: t.locs[i]['idx'],
        position: new t.gm.LatLng(t.locs[i]['lat'],t.locs[i]['lng']),
        map: t.g_map,
        icon: t_pin,
        shadow: t_sha
      });

      t.g_bnds.extend(t.g_mrks[idx].getPosition());

      // Infowindows array
      t.g_nfws[idx] = new t.gm.InfoWindow({
        content: t.iw_template.replace('{REPLACE}',t.locs[i]['iw'])
      });

      // Click on marker event
      t.gm.event.addListener(t.g_mrks[idx], 'click', function() {
        t.closeAllInfoWindows();
        t.iw_visible = t.g_nfws[this.idx];
        t.g_nfws[this.idx].open(t.g_map, t.g_mrks[this.idx]);
      });
    } //for

    // Bounds with several markers
    t.g_map.fitBounds(t.g_bnds);

    // Single mark zoom adjust
    t.singleMarkerZoomAdjust();
  },

  addPegmanMarker: function (lat, lng) {
    var
      t = this;

    if (t.g_pegman) {
      // Allready have pegman move it!
      t.g_pegman.setPosition(new t.gm.LatLng(lat,lng));
      t.g_pegman.setVisible(true);
    } else {
      // Create pegman marker
      t.pegman_pin = new t.gm.MarkerImage(
        t.path + 'pegman_48.png',
        new t.gm.Size(48, 48),
        new t.gm.Point(0,0),
        new t.gm.Point(24, 48)
      );
      t.pegman_shadow = new t.gm.MarkerImage(
        t.path + 'pegman_48-shadow.png',
        new t.gm.Size(73, 48),
        new t.gm.Point(0,0),
        new t.gm.Point(24, 48)
      );
      t.g_pegman = new t.gm.Marker({
        position: new t.gm.LatLng(lat, lng),
        map: t.g_map,
        icon: t.pegman_pin,
        shadow: t.pegman_shadow
      });
    }
  },

  singleMarkerZoomAdjust: function (max, target) {
    // Single mark zoom adjust
    var
      t = this;

    if (!max) max = 16;
    if (!target) target = 14;

    var listener = t.gm.event.addListener(t.g_map, 'idle', function() {
      if (t.g_map.getZoom() > max) t.g_map.setZoom(target);
      t.gm.event.removeListener(listener);
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
    t.g_bnds = new t.gm.LatLngBounds();
    for (var key in t.g_mrks) {
      t.g_mrks[key].setVisible(visible);
      t.g_bnds.extend(t.g_mrks[key].getPosition());
    }
    if (visible) {
      t.g_map.fitBounds(t.g_bnds);
    }
  },

  // Expects array
  showMarkerGroup: function (group) {
    var t = this;
    t.closeAllInfoWindows();
    t.allMarkersVisible(false);

    t.g_bnds = new t.gm.LatLngBounds();
    for (var i in group) {
      t.g_mrks[group[i]].setVisible(true);
      t.g_bnds.extend(t.g_mrks[group[i]].getPosition());
    }
    t.g_map.fitBounds(t.g_bnds);

    if (group.length == 1) {
      t.singleMarkerZoomAdjust();
    }
  },

  zoomTo: function (lat, lng, zoom) {
    var t = this;
    t.g_map.setCenter(new t.gm.LatLng(lat, lng));
    t.g_map.setZoom(zoom);
  },

  stopAllAnimations: function (idx) {
    var t = this;
    for (var key in t.g_mrks) {
      t.g_mrks[key].setAnimation(null);
    }
  },

  rad: function (x) {
    return x*Math.PI/180;
  },

  findNearestMarkerTo: function (lat, lng) {
    var
      t = this,
      R = 6371, // radius of earth in km
      distances = [],
      nearidx = -1;

    for (var key in t.g_mrks) {
      var mlat = t.g_mrks[key].position.lat();
      var mlng = t.g_mrks[key].position.lng();
      var dLat  = t.rad(mlat - lat);
      var dLong = t.rad(mlng - lng);
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
      geocoder = new t.gm.Geocoder();

    //convert location into longitude and latitude
    geocoder.geocode({
      address: addr
    }, function(results, status) {
      if (status == t.gm.GeocoderStatus.OK) {
        t.geoShowPosition(results[0].geometry.location);
      } else {
        alert('No se ha encontrado la dirección.');
      }
    });
  },

  geoShowPosition: function (pos){
    var
      t   = this,
      lat = null,
      lng = null,
      idx = null,
      near_lat = null,
      near_lng = null;

    if (pos.coords) {
      // Coords from Navigator.geolocation
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } else {
      // Coords from address
      lat = pos.jb;
      lng = pos.kb;
    }

    // Find nearest marker
    idx = t.findNearestMarkerTo(lat, lng);
    near_lat = t.g_mrks[idx].position.lat();
    near_lng = t.g_mrks[idx].position.lng();

    // Add pegman / you are here
    t.addPegmanMarker(lat, lng);
    t.g_map.setCenter(new t.gm.LatLng(lat, lng));

    t.closeAllInfoWindows();
    t.g_mrks[idx].setVisible(true);
    t.g_mrks[idx].setAnimation(t.gm.Animation.BOUNCE);
    t.iw_visible = t.g_nfws[idx];
    t.g_nfws[idx].open(t.g_map, t.g_mrks[idx]);
    t.zoomTo(near_lat, near_lng, 16);
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
      t.stopAllAnimations();
      break;
    case 'zoom':
      var idx = $t.data('idx');
      if (idx) {
        var
          lat = t.g_mrks[idx].position.lat(),
          lng = t.g_mrks[idx].position.lng();

        t.g_mrks[idx].setVisible(true);
        t.zoomTo(lat, lng, $t.data('zoom'));
      } else {
        t.zoomTo($t.data('lat'), $t.data('lng'), $t.data('zoom'));
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




