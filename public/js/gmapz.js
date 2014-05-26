/*
 ====================================
 GMapz. Yet another gmaps manager
 by carlos Cabo 2013
 https://github.com/carloscabo/gmapz
 ====================================
*/

GMapz = {

  // Abbreviatures
  // GM: google.maps,
  GM: null,

  // Related to GoogleMaps objects
  // All properties begin with "g"
  g: {
    map: null,
    pins: {},  // Pins
    shds: {},  // Shadows
    mrks: {},  // Markers
    nfws: {},  // Info-windows
    bnds: null // Bounds
  },

  // Custom objects / properties
  // are inside "z" object
  z: {
    locs: {}, // Locations
    iw_v: false,
    // infowindow template
    iw_t: '<div class="gmapz-infowindow">{{REPLACE}}</a></div>',
    map_id: null,
    // If you have a single marker you'll get a high zoom
    // This value determines what zoom level determines that
    // its necesary to adjust it.
    smzl: 20,
    // Automatic zomm will be set to this value
    smzt: 17
  },

  // Custom error messages for internacionalization
  m: {
    not_found: 'Lo sentimos, no se ha encontrado la dirección.'
  },

  pins: {},
  path: 'img/gmapz/',

  // Begin the party!
  init: function (map_id) {
    var
      t = this;
    // Store map_id container
    t.z.map_id = map_id;
    // Load Google Maps API
    t.loadScript();
  },

  // This is suppossed to be called ONCE maps API is ready
  postinit: function() {
    var
      t = this;

    // Google maps instance
    t.GM = google.maps;

    // Map options
    var options = {
      scrollwheel: false,
      zoom: 20, // zoom level of the map
      center: new t.GM.LatLng(0,0),
      mapTypeId: t.GM.MapTypeId.ROADMAP // map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    };

    // Calling the constructor, initializing the map
    t.g.map = new t.GM.Map(document.getElementById(t.z.map_id), options);

    // this.map.scrollWheelZoom.disable();

    // Create pins & shadows
    for (var key in t.pins) {

      // Pins
      if (t.pins[key]['pin']['img']) {

        // First define
        t.g.pins[key] = {};

        t.g.pins[key].pin = new t.GM.MarkerImage(t.pins[key]['pin']['img'],
           // width / height
          new t.GM.Size(t.pins[key]['pin']['size'][0], t.pins[key]['pin']['size'][1]),
          // origin
          new t.GM.Point(0,0),
          // anchor point
          new t.GM.Point(t.pins[key]['pin']['anchor'][0], t.pins[key]['pin']['anchor'][1])
        );
        // Shadows
        if (t.pins[key]['shadow']) {
          t.g.pins[key].shadow = new t.GM.MarkerImage(t.pins[key]['shadow']['img'],
             // width / height
            new t.GM.Size(t.pins[key]['shadow']['size'][0], t.pins[key]['shadow']['size'][1]),
            // origin
            new t.GM.Point(0,0),
            // anchor point same as pin
            new t.GM.Point(t.pins[key]['pin']['anchor'][0], t.pins[key]['pin']['anchor'][1])
          );
        } else {
          t.g.pins[key].shadow = null;
        }
      } else {
        t.g.pins[key].pin = null;
        t.g.pins[key].shadow = null;
      }
    }
  },

  addMarkers: function(locs) {

    var
      t = this;

    // Array de coordenadas
    for (var idx in locs) {
      // If exists delete
      t.deleteMarkers([idx]);

      // Add new
      t.z.locs[idx] = locs[idx];

      var
        t_pin = null,
        t_sha = null;

      // Setting pin & shadow
      // Default
      if (t.g.pins['default']) {
        t_pin = t.g.pins['default'].pin;
        t_sha = t.g.pins['default'].shadow;
      }

      // Customized for this point
      if (locs[idx]['pin'] && t.g.pins[locs[idx]['pin']]) {
        t_pin = t.g.pins[locs[idx]['pin']].pin;
        if (t.g.pins[locs[idx]['pin']].shadow) {
          t_sha = t.g.pins[locs[idx]['pin']].shadow;
        }
      }

      // Markers array
      t.g.mrks[idx] = new t.GM.Marker({
        idx: idx,
        position: new t.GM.LatLng(locs[idx]['lat'],locs[idx]['lng']),
        map: t.g.map,
        icon: t_pin,
        shadow: t_sha
      });

      // Only if iw exists
      if (locs[idx]['iw']) {
        // Infowindows array
        t.g.nfws[idx] = new t.GM.InfoWindow({
          content: t.z.iw_t.replace('{{REPLACE}}',locs[idx]['iw'])
        });

        // Click on marker event
        t.GM.event.addListener(t.g.mrks[idx], 'click', function() {
          t.closeAllInfoWindows();
          t.z.iw_v = t.g.nfws[this.idx];
          t.g.nfws[this.idx].open(t.g.map, t.g.mrks[this.idx]);
        });
      }
    }

    // Calculate bounds and zoom
    t.calculateBounds();

  },

  deleteMarkers: function (idxArray) {
    var t = this;
    for (var i in idxArray) {
      if (t.g.mrks && t.g.mrks[idxArray[i]]) {
        t.g.mrks[idxArray[i]].setMap(null);
        delete t.g.mrks[idxArray[i]];
      }
      if (t.g.locs && t.g.locs[idxArray[i]]) {
        delete t.g.locs[idxArray[i]];
      }
      if (t.g.nfws && t.g.nfws[idxArray[i]]) {
        delete t.g.nfws[idxArray[i]];
      }
    }
  },

  // Recalculate bounds depending on markers
  calculateBounds: function (idxArray) {
    var
      t = this;

    // Reset bounds
    t.g.bnds = new t.GM.LatLngBounds();

    if (!idxArray) {
      // Calculate all visible
      for (var idx in t.g.mrks) {
        if (t.g.mrks[idx].getVisible()) {
          t.g.bnds.extend(t.g.mrks[idx].getPosition());
        }
      }
      // Bounds with several markers
      t.g.map.fitBounds(t.g.bnds);

      if (t.g.mrks.length < 2) {
        t.singleMarkerZoomAdjust(t.z.smzl, t.z.smzt);
      }

    } else {
      // Fit to idxs group
      for (var i in idxArray) {
        if (t.g.mrks && t.g.mrks[idxArray[i]]) {
          t.g.bnds.extend(t.g.mrks[idxArray[i]].getPosition());
        }
      }
      // Bounds with several markers
      t.g.map.fitBounds(t.g.bnds);

      if (idxArray.length < 2) {
        t.singleMarkerZoomAdjust(t.z.smzl, t.z.smzt);
      }
    }
  },

  addPegmanMarker: function (lat, lng) {
    var
      t = this;

    if (t.g_pegman) {
      // Allready have pegman move it!
      t.g_pegman.setPosition(new t.GM.LatLng(lat,lng));
      t.g_pegman.setVisible(true);
    } else {
      // Create pegman marker
      t.pegman_pin = new t.GM.MarkerImage(
        t.path + 'pegman_48.png',
        new t.GM.Size(48, 48),
        new t.GM.Point(0,0),
        new t.GM.Point(24, 48)
      );
      t.pegman_shadow = new t.GM.MarkerImage(
        t.path + 'pegman_48-shadow.png',
        new t.GM.Size(73, 48),
        new t.GM.Point(0,0),
        new t.GM.Point(24, 48)
      );
      t.g_pegman = new t.GM.Marker({
        position: new t.GM.LatLng(lat, lng),
        map: t.g.map,
        icon: t.pegman_pin,
        shadow: t.pegman_shadow
      });
    }
  },

  singleMarkerZoomAdjust: function (max, target) {
    // Single mark zoom adjust
    // When you have an only marker focused adjust the
    // map's zoom to a better adjustment
    var
      t = this;

    if (!max) max = 18; //
    if (!target) target = 16;

    //_log(t.g.map.getZoom());

    var listener = t.GM.event.addListener(t.g.map, 'idle', function() {
      if (t.g.map.getZoom() > max) t.g.map.setZoom(target);
      t.GM.event.removeListener(listener);
    });
  },

  closeAllInfoWindows: function () {
    var t = this;
    if(t.z.iw_v) {
      t.z.iw_v.close();
    }
  },

  setMarkersVisibility: function (visible) {
    var t = this;
    t.closeAllInfoWindows();
    for (var key in t.g.mrks) {
      t.g.mrks[key].setVisible(visible);
    }
    t.calculateBounds();
  },

  // Expects array
  showMarkerGroup: function (group, hide_rest) {
    var
      t = this;

    t.closeAllInfoWindows();
    if (hide_rest) {
      t.setMarkersVisibility(false);
    }
    for (var i in group) {
      if (t.g.mrks && t.g.mrks[group[i]]) {
        t.g.mrks[group[i]].setVisible(true);
      }
    }
    t.calculateBounds(group);
  },

  zoomTo: function (lat, lng, zoom) {
    var t = this;
    t.g.map.setCenter(new t.GM.LatLng(lat, lng));
    t.g.map.setZoom(zoom);
  },

  stopAllAnimations: function (idx) {
    var t = this;
    for (var key in t.g.mrks) {
      t.g.mrks[key].setAnimation(null);
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

    for (var key in t.g.mrks) {
      var mlat = t.g.mrks[key].position.lat();
      var mlng = t.g.mrks[key].position.lng();
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
      geocoder = new t.GM.Geocoder();

    //convert location into longitude and latitude
    geocoder.geocode({
      address: addr
    }, function(results, status) {
      if (status == t.GM.GeocoderStatus.OK) {
        t.geoShowPosition(results[0].geometry.location);
      } else {
        alert(t.m.not_found);
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
    near_lat = t.g.mrks[idx].position.lat();
    near_lng = t.g.mrks[idx].position.lng();

    // Add pegman / you are here
    t.addPegmanMarker(lat, lng);
    // t.g.map.setCenter(new t.GM.LatLng(lat, lng));

    t.closeAllInfoWindows();
    t.g.mrks[idx].setVisible(true);
    t.g.mrks[idx].setAnimation(t.GM.Animation.BOUNCE);

    t.g.bnds = t.g.bnds = new t.GM.LatLngBounds();
    t.g.bnds.extend(t.g.mrks[idx].getPosition());
    t.g.bnds.extend(t.getOppositeCorner(lat, lng, near_lat, near_lng));
    t.g.map.fitBounds(t.g.bnds);
    // t.z.iw_v = t.g.nfws[idx];
    // t.g.nfws[idx].open(t.g.map, t.g.mrks[idx]);
    // t.zoomTo(near_lat, near_lng, 16);
  },

  // Converts coordinate in degree/minute/second
  // into decimal notation.
  convertDMStoDec: function (str) {
    var
      val = null;
      coo = str.replace(/\D/g,' ').replace(/\s{2,}/g, ' ').trim().split(' ');

      val = parseFloat(coo[0],10) + (parseFloat(coo[1],10) / 60) + (parseFloat(coo[2],10) / 3600);

      // Sout / west / oeste
      if (str.match(/[swo]/i)) {
        val = val * -1;
      }
      return val;
  },

  // Given a center (cx, cy) and a corner (rx, ry)
  // Returns the opposite corner of rectangle
  getOppositeCorner: function (cx, cy, rx, ry) {
    var
      t = this,
      x = cx + (cx - rx),
      y = cy + (cy - ry);
    return new t.GM.LatLng(x,y);
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

    t.stopAllAnimations();

    switch (f) {
    case 'show-group':
      var
        d = $t.data('group') + '';
        hr = $t.data('hide-rest');
      if(d.indexOf(',') === -1) {
        t.showMarkerGroup([d], hr);
      } else {
        // Trim and split
        t.showMarkerGroup($.map(d.split(","),$.trim), hr);
      }
      break;
    case 'show-all':
      t.setMarkersVisibility(true);
      break;
    case 'zoom':
      var idx = $t.data('idx');
      if (idx) {
        var
          lat = t.g.mrks[idx].position.lat(),
          lng = t.g.mrks[idx].position.lng();

        t.g.mrks[idx].setVisible(true);
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
  buttonInit: function() {
    var
      t = this;

    // Generic buttons / <A>
    $('*[data-gmapz='+t.z.map_id+']').click(function (e) {
      e.preventDefault();
      var
        $t = $(this),
        f  = $t.data('function') + '';
      t.buttonsFunctionality(f, $t);
    });

    // Selects
    $('select[data-gmapz-select='+t.z.map_id+']').change(function (e) {
      e.preventDefault();
      var
        $t = $(this).find(':selected'),
        f = $t.data('function') + '';
      t.buttonsFunctionality(f, $t);
    });
  },

  loadScript: function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&'+'callback=GMapz.postinit';
    document.body.appendChild(script);
  }
};
