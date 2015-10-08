//
// Creates instances of GMapz maps
//
GMapz.map = (function() {

  function Constructor($map, user_settings, initial_locs) {

    // map
    this.map = null;    // gm object
    this.$map = $map;   // JQuery selector
    this.map_id = null; // string ID

    // Settings of object
    this.gz_settings = {
      is_initialized: false,
      test_str: 'unitialized',
      zoom: {
        // If you have a single marker you'll get a high zoom
        // This value is the threshold that will trigger the
        // automatic zoom level
        threshold: 20,
        auto: 7
      }
    };

    // Google Maps event listener
    this.listener = null;

    // Google maps settings on initialization
    this.map_settings = {
      scrollwheel: true,
      scaleControl: true,
      zoom: 9,
      center: [0,0],
      bounds: null,
      mapTypeId: 'ROADMAP' // 'ROADMAP' / 'SATELLITE' / 'HYBRID' / 'TERRAIN'
      /*
        styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
      */
    };

    // ID único del mapa
    if (this.$map.attr('data-gmapz')) {
      this.map_id = this.$map.attr('data-gmapz');
    } else {
      this.map_id = GMapz.getUniqueId(8,'gz-');
      this.$map.attr('data-gmapz', this.map_id);
    }

    // Localizaciones
    if (typeof initial_locs !== 'undefined' && !jQuery.isEmptyObject(initial_locs)) {
      this.initial_locs = initial_locs;
    } else {
      this.initial_locs = {};
    }

    // Marcadores (objectos de google)
    this.markers = {};

    // Info windows (objectos de google)
    this.iws = {};
    this.iw_current_idx = false;
    this.iw_template = '<div class="gmapz-infowindow">{{__REPLACE__}}</div>';

    // Eventos
    eOnBeforeAddLocations = function() {

    };

    // Extend settings
    $.extend(this.map_settings, user_settings);

    // Attach objecto DOM element
    $map[0].gmapz = this;

    // Request GM Api, instanceReady() will be called when done
    GMapz.requestAPI();
  }

  Constructor.prototype = {

    //
    // Methods
    //

    instanceReady: function(e) {

      console.log(this.map_id+' instance is initialized');

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
        bounds.extend( new google.maps.LatLng(
          this.map_settings.bounds[0],this.map_settings.bounds[1])
        );
        bounds.extend( new google.maps.LatLng(
          this.map_settings.bounds[2],this.map_settings.bounds[3])
        );
        this.map_settings.bounds = bounds;
        this.map.fitBounds(bounds);
      }

      // Calling the constructor, initializing the map
      this.map = new google.maps.Map($("[data-gmapz='"+this.map_id+"']")[0], this.map_settings);

      // Si hubiese algúna location la pintamos
      // if (!jQuery.isEmptyObject(this.initial_locs)) {
      //   console.log('Add locations');
      //   this.addLocations(this.initial_locs);
      // }

      if(!jQuery.isEmptyObject(this.initial_locs)) {
        this.addLocations(this.initial_locs);
      }

      this.onReady();
    },

    // Override from outside
    onReady: function() {
      console.log(this.map_id+' instance is ready');
    },

    // Map
    setZoom: function (zoom) {
      this.map.setZoom(zoom);
      return this;
    },

    centerTo: function (lat, lng, zoom) {
      var t = this;
      this.map.setCenter(new google.maps.LatLng(lat, lng));
      if (typeof zoom !== 'undefined' && zoom !== false) {
        this.map.setZoom(zoom);
      }
      return this;
    },

    centerToMarker: function(idx, zoom) {
      if (typeof zoom === 'undefined') {
        zoom = false;
      }
      if (this.markers[idx]) {
        this.setMarkerVisibility(true, idx);
        this.centerTo(
          this.markers[idx].position.lat(),
          this.markers[idx].position.lng(),
          zoom
        );
      }
      return this;
    },

    // Expects array
    showMarkerGroup: function (group, hide_rest) {
      this.closeAllInfoWindows();
      if (hide_rest) {
        this.setAllMarkersVisibility(false);
      }
      for (var i in group) {
        if (this.markers && this.markers[group[i]]) {
          this.markers[group[i]].setVisible(true);
        }
      }
      this.fitBounds(group);
    },

    // Locations & markers
    addLocations: function (locs) {

      var that = this;

      // Get default pin
      if (GMapz.pins['default']) {
        default_pin = GMapz.pins['default'].pin;
      }

      for (var idx in locs) {

        // Delete marker if exists
        if (this.markers && this.markers[idx]) {
          this.deleteMarkers([idx]);
        }

        current_pin = default_pin;
        // Customized for this point
        if (locs[idx].pin && GMapz.pins[locs[idx].pin]) {
          current_pin = GMapz.pins[locs[idx].pin].pin;
        }
        // Markers array
        var marker_options = {
          idx: idx,
          position: new google.maps.LatLng(locs[idx].lat,locs[idx].lng),
          map: this.map,
          icon: current_pin
        };
        // Draggable marker?
        if (locs[idx].draggable) { marker_options.draggable = true; }
        // Create marker
        this.markers[idx] = new google.maps.Marker(marker_options);
        // Draggable marker event
        if (locs[idx].draggable) {
          google.maps.event.addListener(
            this.markers[idx], 'dragend', function() {
              that.onMarkerDragEnd(this);
          });
        }
        // If set 'hidden'
        if (locs[idx].hidden) {
          this.markers[idx].setVisible(false);
        }
        // Create standard infowindows
        // TO-DO create custom infowindows GMapz.infowindow?
        if (locs[idx].iw) {
          // Infowindows array
          this.iws[idx] = new google.maps.InfoWindow({
            content: this.iw_template.replace('{{__REPLACE__}}',locs[idx].iw)
          });
          // Click on marker event open Infowindow
          google.maps.event.addListener(this.markers[idx], 'click', function() {
            that.closeAllInfoWindows();
            that.iw_current_idx = this.idx;
            that.iws[this.idx].open(that.map, that.markers[this.idx]);
          });
        }

      }

      return this; // Chainning
    }, // addLocations

    // Info windows

    closeInfoWindow: function(idx) {
      if (this.iws[idx]) {
        this.iws[idx].close();
      }
    },

    closeAllInfoWindows: function() {
      for (var idx in this.iws) {
        this.closeInfoWindow(idx);
      }
      this.iw_current_idx = false;
    },

    // Recalculate bounds and fit view depending on markers
    fitBounds: function (idxArray) {
      var
        visible_count = 0,
        bounds = new google.maps.LatLngBounds();

      // Calculate all visible
      if (!idxArray) {
        for (var idx in this.markers) {
          if (this.markers[idx].getVisible()) {
            bounds.extend(this.markers[idx].getPosition());
            visible_count++;
          }
        }
      } else {
        // Fit to idxs group
        for (var i in idxArray) {
          if (this.markers && this.markers[idxArray[i]]) {
            bounds.extend(this.markers[idxArray[i]].getPosition());
            visible_count++;
          }
        }
      }

      // Only one marker auto zoom
      if (visible_count == 1) {
        this.singleMarkerZoomAdjust(this.gz_settings.zoom.threshold, this.gz_settings.zoom.auto);
      }

      // More than one marker fit Bounds
      // if (visible_count > 1) {
        this.map.fitBounds(bounds);
      // }

      // If NO marker set, do nothing ;)
      // Will use the default cenrter and zoom

      return this; // Chainning
    },



    singleMarkerZoomAdjust: function (max, target) {
      // Single mark zoom adjust
      // When you have an only marker focused adjust the
      // map's zoom to a better adjustment
      console.log('Attach single marker');
      if (!max) max = 18; //
      if (!target) target = 9;
      var
        that = this;
      this.listener = google.maps.event.addListener(this.map, 'idle', function() {
        if (that.map.getZoom() > max) {
          that.map.setZoom(target);
        };
        google.maps.event.removeListener(this.listener);
      });
    },

    stopAllAnimations: function (idx) {
      for (var key in this.markers) {
        this.markers[key].setAnimation(null);
      }
    },

    // Deletes a group os markers idxs (array)
    deleteMarkers: function (idxArray) {
      for (var i in idxArray) {
        if (this.markers[idxArray[i]]) {
          this.markers[idxArray[i]].setMap(null);
          delete this.markers[idxArray[i]];
        }
        if (this.iws[idxArray[i]]) {
          delete this.iws[idxArray[i]];
        }
      }
    },

    // Removes ALL markers in current map
    deleteAllMarkers: function () {
      if (this.markers) {
        for (var idx in this.markers) {
          if (this.markers[idx]) delete this.markers[idx];
          if (this.iws[idx]) delete this.iw[idx];
        }
      }
    },

    setMarkerVisibility: function (visible, idx) {
      if (!visible) {
        this.closeInfoWindow(idx);
      }
      this.markers[idx].setVisible(visible);
    },

    setAllMarkersVisibility: function (visible) {
      for (var idx in this.markers) {
        this.setMarkerVisibility(visible, idx);
      }
      if (visible) {
        this.fitBounds();
      }
    },

    //
    // Geolocation
    //

    findNearestMarkerTo: function (lat, lng) {
      var
        R = 6371, // radius of earth in km
        distances = [],
        nearidx = -1,
        to_rad = Math.PI/180;

      for (var key in this.markers) {
        var
          mlat = this.markers[key].position.lat(),
          mlng = this.markers[key].position.lng(),
          dLat = (mlat - lat)*to_rad,
          dLng = (mlng - lng)*to_rad,
          a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat*to_rad) * Math.cos(lat*to_rad) * Math.sin(dLng/2) * Math.sin(dLng/2),
          c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
          d = R * c;

        distances[key] = d;
        if ( nearidx == -1 || d < distances[nearidx] ) {
          nearidx = key;
        }
      }
      return nearidx;
    },

    geoShowPosition: function (pos){
      var
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

    //
    // Buttons and interaction
    //

    btnAction: function (data) {
      // t.stopAllAnimations();

      console.log(data);
      // console.log(data['gmapzShowGroup']);

      var zoom = false;
      if (typeof data.gmapzZoom !== 'undefined') {
        zoom = parseInt(data.gmapzZoom, 10);
      }

      // Show all markers and fit map
      if (typeof data.gmapzShowAll !== 'undefined') {
        this.setAllMarkersVisibility(true);
      }

      // Show group of markers
      if (typeof data.gmapzShowGroup !== 'undefined') {
        var
          group = data.gmapzShowGroup,
          hide_rest = false;
        if (typeof data.gmapzHideRest !== 'undefined' && data.gmapzHideRest === true) {
          hide_rest = true;
        }
        if (data === parseInt(data, 10) || typeof group === 'string') {
          group = [group];
        }
        this.showMarkerGroup(group, hide_rest);
      }

      // Center on marker
      if (typeof data.gmapzCenterIdx !== 'undefined') {
        this.centerToMarker(data.gmapzCenterIdx, zoom);
      }

      // Find near geolocation
      if (typeof data.gmapzFindNearGeolocation !== 'undefined') {
        var
          n = navigator.geolocation;
        if(n) {
          n.getCurrentPosition(this.geoShowPosition.bind(this), this.geoShowError.bind(this));
        } else {
          alert('Su navegador no soporta Geolocalización.');
        }
      }

      // Find near address
      if (typeof data.gmapzFindNear !== 'undefined') {
        this.centerToMarker(data.gmapzCenterIdx, zoom);
      }


      /*switch (f) {
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
      }*/
    },

    //
    // Eventos
    //
    onMarkerDragEnd: function(marker) {
      console.log(marker);
    },
    afterAddingMarkers: function() {},

    //
    // Test / debug
    //
    testMethod: function(msg) {
      console.log(msg);
    }

    //

  };

  return Constructor;

})();

