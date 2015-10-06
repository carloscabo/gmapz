/*
 ====================================
 GMapz. Yet another gmaps manager
 by carlos Cabo 2015. V.2.0 beta
 https://github.com/carloscabo/gmapz
 ====================================
*/

GMapz || = {}

GMapz = {

  // Abbreviatures
  // GM: google.maps,
  GM: null,

  // Related to GoogleMaps objects
  // All properties begin with "g"
  g: {
    map: null,
    pins: {},
    markers: {},
    infowindows: {},
    bounds: null,   // Bounds
    options: {    // Custom options
      zoom: 20,
      center: [0,0]
    },
    autocomplete: null
  },

  // Custom objects / properties
  // are inside "z" object
  z: {

    // Locations
    locs: {},

    // infowindow
    infowindow_current_idx: false,
    infowindow_template: '<div class="gmapz-infowindow">{{__REPLACE__}}</div>',
    map_id: null,

    // Autocomplete features
    $autocomplete_input: null,

    // If you have a single marker you'll get a high zoom
    // This value is the threshold that will trigger the
    // automatic zoom level
    zoom_level_threshold: 20,
    // Automatic zoom will be set to this value
    zoom_level_auto: 7,
    // markers_initially_hidden: false
  },

  // Custom error messages for internacionalization
  m: {
    not_found: 'Lo sentimos, no se ha encontrado la dirección.'
  },

  // Map settings
  settings: {
    scrollwheel: true,
    scaleControl: true
    /*styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]*/
  },

  // Pins for markers
  pins: {},
  img_path: 'img/gmapz/',
  api_requested: false,

  // Begin the party!
  init: function (map_id, options) {
    var
      t = this;

    // Store map_id container
    t.z.map_id = map_id;

    // Custom options
    if (typeof options !== 'undefined') {
      var ops = ['zoom','center','bounds','markers_initially_hidden'];
      for (var i in ops) {
        if (typeof options[ops[i]] !== 'undefined') {
          t.g.options[ops[i]] = options[ops[i]];
        }
      }
    }

    // Load Google Maps API once loaded will callback postInit();
    t.loadScript('GMapz.postInit');
  },

  // This is suppossed to be called ONCE maps API is ready
  postInit: function() {
    var
      t = this;

    // Google maps instance
    t.GM = google.maps;

    // Settings
    t.settings.zoom = this.g.options.zoom; // zoom level of the map
    // map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    t.settings.mapTypeId = this.GM.MapTypeId.ROADMAP;

    // Map center
    t.settings.center = new t.GM.LatLng(
      t.g.options.center[0],
      t.g.options.center[1]
    );

    // Calling the constructor, initializing the map
    t.g.map = new t.GM.Map(document.getElementById(t.z.map_id), t.settings);

    // Has bounds
    if (t.g.options.bounds) {
      var bounds = new t.GM.LatLngBounds();
      bounds.extend( new t.GM.LatLng(
        t.g.options.bounds[0],t.g.options.bounds[1])
      );
      bounds.extend( new t.GM.LatLng(
        t.g.options.bounds[2],t.g.options.bounds[3])
      );
      t.g.options.bounds = bounds;
      t.g.map.fitBounds(bounds);
    }

    // Create pins
    for (var key in t.pins) {
      // Pins
      if (t.pins[key].pin.img) {
        t.g.pins[key] = {};
        t.g.pins[key].pin = new t.GM.MarkerImage(t.pins[key].pin.img,
          // width / height
          new t.GM.Size(t.pins[key].pin.size[0], t.pins[key].pin.size[1]),
          // origin
          new t.GM.Point(0,0),
          // anchor point
          new t.GM.Point(t.pins[key].pin.anchor[0], t.pins[key].pin.anchor[1])
        );
      } else {
        t.g.pins[key].pin = null;
      }
    }

    // Si hubiese algúna location la pintamos
    if (!jQuery.isEmptyObject(t.z.locs)) {
      t.processMarkers();
    }

    // Si hay un elemento de autocomplete lo ponemos
    if(t.z.$autocomplete_input !== null) {
      t.addAutocomplete();
    }

    if(typeof GMapz.onMapReady !== 'undefined') {
      GMapz.onMapReady();
    }
  },

  addMarkers: function(locs) {
    var
      t = this;

    t.beforeAddMarkers();

    // Array de coordenadas
    for (var idx in locs) {
      // If exists delete
      t.deleteMarkers(idx);
      // Add new
      t.z.locs[idx] = locs[idx];
    }

    if (t.GM !== null) {
      t.processMarkers();
    }

  },

  // Takes the markers list and process them
  processMarkers: function () {
    var
      t = this;

    // Array de coordenadas
    for (var idx in t.z.locs) {
      var
        t_pin = null;

      // Setting pin
      // Default
      if (t.g.pins['default']) {
        t_pin = t.g.pins['default'].pin;
      }

      // Customized for this point
      if (t.z.locs[idx].pin && t.g.pins[t.z.locs[idx].pin]) {
        t_pin = t.g.pins[t.z.locs[idx].pin].pin;
      }

      // Markers array
      var marker_options = {
        idx: idx,
        position: new t.GM.LatLng(t.z.locs[idx].lat,t.z.locs[idx].lng),
        map: t.g.map,
        icon: t_pin
      };

      // Draggable marker?
      if (t.z.locs[idx].draggable) { marker_options.draggable = true; }

      // Create marker
      t.g.markers[idx] = new t.GM.Marker(marker_options);

      // Draggable marker event
      if (t.z.locs[idx].draggable) {
        t.GM.event.addListener(
          t.g.markers[idx], 'dragend', function() {
            // console.log(this);
            GMapz.onMarkerDragEnd(this);
        });
      }

      // Only if iw exists
      if (t.z.locs[idx].iw) {
        // Infowindows array
        t.g.infowindows[idx] = new t.GM.InfoWindow({
          content: t.z.infowindow_template.replace('{{__REPLACE__}}',t.z.locs[idx].iw)
        });

        // Click on marker event
        t.GM.event.addListener(t.g.markers[idx], 'click', function() {
          t.closeAllInfoWindows();
          t.z.infowindow_current_idx = this.idx;
          t.g.infowindows[this.idx].open(t.g.map, t.g.markers[this.idx]);
        });
      }

      // If set 'hidden'
      if (t.z.locs[idx].hidden) {
        t.g.markers[idx].setVisible(false);
      }
    }

    t.afterAddMarkers();

  },

  deleteMarkers: function (idxArray) {
    var t = this;
    for (var i in idxArray) {
      if (t.g.markers && t.g.markers[idxArray[i]]) {
        t.g.markers[idxArray[i]].setMap(null);
        delete t.g.markers[idxArray[i]];
      }
      if (t.z.locs && t.z.locs[idxArray[i]]) {
        delete t.z.locs[idxArray[i]];
      }
      if (t.g.infowindows && t.g.infowindows[idxArray[i]]) {
        delete t.g.infowindows[idxArray[i]];
      }
    }
  },

  deleteAllMarkers: function () {
    var t = this;
    if (t.z.locs) {
      for (var idx in t.z.locs) {
        t.g.markers[idx].setMap(null);
        if (t.g.markers[idx]) delete t.g.markers[idx];
        if (t.g.infowindows[idx]) delete t.g.infowindows[idx];
        delete t.z.locs[idx];
      }
    }
  },

  // Recalculate bounds depending on markers
  calculateBounds: function (idxArray) {
    var
      t = this,
      visibleCount = 0;

    // Reset bounds
    t.g.bounds = new t.GM.LatLngBounds();

    if (!idxArray) {
      // Calculate all visible
      for (var idx in t.g.markers) {
        if (t.g.markers[idx].getVisible()) {
          t.g.bounds.extend(t.g.markers[idx].getPosition());
          visibleCount++;
        }
      }
    } else {
      // Fit to idxs group
      for (var i in idxArray) {
        if (t.g.markers && t.g.markers[idxArray[i]]) {
          t.g.bounds.extend(t.g.markers[idxArray[i]].getPosition());
          visibleCount++;
        }
      }
    }

    // Only one marker auto zoom
    if (visibleCount == 1) {
      t.singleMarkerZoomAdjust(t.z.zoom_level_threshold, t.z.zoom_level_auto);
    }
    // More than one marker fir Bounds
    if (visibleCount > 1) {
      t.g.map.fitBounds(t.g.bounds);
    }
    // NO marker, do nothing.
    // Will use the default cenrter and zoom

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
        t.img_path + 'pegman_48.png',
        new t.GM.Size(48, 48),
        new t.GM.Point(0,0),
        new t.GM.Point(24, 48)
      );
      t.pegman_shadow = new t.GM.MarkerImage(
        t.img_path + 'pegman_48-shadow.png',
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
    if (!target) target = 9;

    //_log(t.g.map.getZoom());

    var listener = t.GM.event.addListener(t.g.map, 'idle', function() {
      if (t.g.map.getZoom() > max) t.g.map.setZoom(target);
      t.GM.event.removeListener(listener);
    });
  },

  closeAllInfoWindows: function () {
    var t = this;
    if (t.z.infowindow_current_idx !== false) {
      for (var i in t.g.infowindows) {
        t.g.infowindows[i].close();
      }
      t.z.infowindow_current_idx = false;
    }
  },

  setMarkersVisibility: function (visible) {
    var t = this;
    t.closeAllInfoWindows();
    for (var key in t.g.markers) {
      t.g.markers[key].setVisible(visible);
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
      if (t.g.markers && t.g.markers[group[i]]) {
        t.g.markers[group[i]].setVisible(true);
      }
    }
    t.calculateBounds(group);
  },

  zoomTo: function (lat, lng, zoom) {
    var t = this;
    if (typeof zoom === 'undefined') {
      zoom = t.z.zoom_level_auto;
    }
    t.g.map.setCenter(new t.GM.LatLng(lat, lng));
    t.g.map.setZoom(zoom);
  },

  stopAllAnimations: function (idx) {
    var t = this;
    for (var key in t.g.markers) {
      t.g.markers[key].setAnimation(null);
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

    for (var key in t.g.markers) {
      var mlat = t.g.markers[key].position.lat();
      var mlng = t.g.markers[key].position.lng();
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
    near_lat = t.g.markers[idx].position.lat();
    near_lng = t.g.markers[idx].position.lng();

    // Add pegman / you are here
    t.addPegmanMarker(lat, lng);
    // t.g.map.setCenter(new t.GM.LatLng(lat, lng));

    t.closeAllInfoWindows();
    t.g.markers[idx].setVisible(true);
    t.g.markers[idx].setAnimation(t.GM.Animation.BOUNCE);

    t.g.bounds = t.g.bounds = new t.GM.LatLngBounds();
    t.g.bounds.extend(t.g.markers[idx].getPosition());
    t.g.bounds.extend(t.getOppositeCorner(lat, lng, near_lat, near_lng));
    t.g.map.fitBounds(t.g.bounds);
    // t.z.infowindow_current_idx = t.g.infowindows[idx];
    // t.g.infowindows[idx].open(t.g.map, t.g.markers[idx]);
    // t.zoomTo(near_lat, near_lng, 16);
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
      t.closeAllInfoWindows();
      if (idx) {
        var
          lat = t.g.markers[idx].position.lat(),
          lng = t.g.markers[idx].position.lng(),
          siw = $t.data('show-infowindow');

        t.g.markers[idx].setVisible(true);
        t.zoomTo(lat, lng, $t.data('zoom'));
        t.z.infowindow_current_idx = idx;
        t.g.infowindows[idx].open(t.g.map, t.g.markers[idx]);
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

  // Initialize buttons to control the map
  // Buttons may have data-gmapz attribute, read the doc
  // For functionallity
  buttonInit: function() {
    var
      t = this;

    // Generic buttons / <a>
    $('*[data-gmapz='+t.z.map_id+']').on('click', function (e) {
      var
        $t = $(this),
        f  = $t.data('function') + '';
      t.buttonsFunctionality(f, $t);
    });

    // Selects
    $('select[data-gmapz-select='+t.z.map_id+']').on('change', function (e) {
      e.preventDefault();
      var
        $t = $(this).find(':selected'),
        f = $t.data('function') + '';
      t.buttonsFunctionality(f, $t);
    });
  },

  loadScript: function(callback_fn) {
    // Avoid double loading

    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
      // Ya está cargado
      GMapz.postInit();
    } else if (!GMapz.api_requested) {
      GMapz.api_requested = true;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&signed_in=true&libraries=places&language=en&'+'callback='+callback_fn;
      document.body.appendChild(script);
    }
  },

  objectLength: function ( object ) {
    var length = 0;
    for( var key in object ) {
      if( object.hasOwnProperty(key) ) {
        ++length;
      }
    }
    return length;
  },

  //
  // Autocomplete places feature
  //
  autocompleteInit: function($input_element) {
    var
      t = this;

    GMapz.z.$autocomplete_input = $input_element;
    if (GMapz.GM !== null) {
      GMapz.addAutocomplete();
    } else {
      // Autocomplete withput map
      GMapz.loadScript('GMapz.addAutocomplete');
    }
  },

  addAutocomplete: function () {

    // Google maps instance
    if (GMapz.GM === null) {
      GMapz.GM = google.maps;
    }

    GMapz.g.autocomplete = new google.maps.places.Autocomplete((GMapz.z.$autocomplete_input[0]), {
      types: ['geocode'],
      offset: 3 //,
      // componentRestrictions: { 'country': 'es' }
    });
    GMapz.GM.event.addListener(GMapz.g.autocomplete, 'place_changed', GMapz.onAutocompleteChanged);
  },

  serializeBounds: function(bounds) {
    var sw = bounds.getSouthWest(),
        ne = bounds.getNorthEast();
    return [sw.lat(), sw.lng(), ne.lat(), ne.lng()].join(',');
  },

  fitToPlace: function (place, locs) {
    place = ($.isArray(place)) ? place[0] : place;
    /*google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
      searchOnMapBounds();
    });*/
    GMapz.addMarkers(locs);

    if (typeof place.geometry.viewport !== 'undefined') {
      GMapz.g.map.fitBounds(place.geometry.viewport);
    } else {
      GMapz.g.map.setCenter(place.geometry.location);
      GMapz.g.map.setZoom(18);
    }

    GMapz.afterAutocompleteChanged(locs)
  },

  // Handlers for before an after addMarkers
  // Can be overriden from outside for custom functionallity
  beforeAddMarkers: function() {

  },
  afterAddMarkers: function() {
    this.calculateBounds();
  },
  onMapReady: function() {
    // Maps is ready
  },
  onAutocompleteChanged: function () {
    /*
    GMapz.deleteAllMarkers();
    var locs = {};
    var place = GMapz.g.autocomplete.getPlace();
    locs['autocomplete'] = {
      pin: 'coo',
      lat: place.geometry.location.A,
      lng: place.geometry.location.F,
      draggable:true,
      title:"Drag me!"
    };
    GMapz.fitToPlace(place);
    */
  },
  afterAutocompleteChanged: function () {

  },
  onMarkerDragEnd: function (marker) {
    // console.log(marker.getPosition());
    // geocodePosition(marker.getPosition());
  }

};

