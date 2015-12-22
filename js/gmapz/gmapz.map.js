//
// Creates instances of GMapz maps
//
GMapz.map = (function() {

  function Constructor($map, user_settings, initial_locs) {

    if($map.length === 0) {
      if (GMapz.debug) console.warn("'"+$map.selector+"' not found!");
      return false;
    }

    // map
    this.map = null;    // gm object
    this.$map = $map;   // JQuery selector
    this.map_id = null; // string ID

    // Settings of object
    this.gz_settings = {
      is_initialized: false,
      is_drawn: false,
      test_str: 'unitialized',
      zoom: {
        // If you have a single marker you'll get a high zoom
        // This value is the threshold that will trigger the
        // automatic zoom level
        threshold: 20,
        target: 7 // Set to false to disable
      }
    };

    // Google Maps event listener
    this.listeners = {
      'idle': null,
      'zoom_on_scroll_lock': null,
      'tilesloaded_responsive': null,
      'on_draw': null
    };

    // Google maps settings on initialization
    this.map_settings = {
      scrollwheel: true,
      scaleControl: true,
      pixelOffset: false,
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

    // Infobox / infowindows personlizados
    this.ibx = null;

    // Extend settings
    $.extend(this.map_settings, user_settings);

    // Attach objecto DOM element
    $map[0].gmapz = this;

    if (GMapz.data.map_api_ready) {
      // GM Api is already available
      this.instanceReady();
    } else {
      // Request GM Api, instanceReady() will be called when done
      GMapz.requestAPI();
    }
  }

  Constructor.prototype = {

    //
    // Methods
    //

    instanceReady: function(e) {

      var that = this;

      if (GMapz.debug) console.info(this.map_id+' instanceReady();');

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

      // If locations passed in start add them
      if(!jQuery.isEmptyObject(this.initial_locs)) {
        this.addLocations(this.initial_locs);
      }

      // Call ready handler
      this.onReady();

      // Will draw event when map is painted
      this.listeners.on_draw = google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){
        that.gz_settings.is_drawn = true;
        google.maps.event.removeListener(that.listeners.on_draw);
        that.onDraw();
      });
    },

    // Override from outside
    onReady: function() {
      if (GMapz.debug) console.info(this.map_id+' instance onReady();');
    },

    // Override from outside
    onDraw: function() {
      if (GMapz.debug) console.info(this.map_id+' onDraw();');
    },

    // Map
    setZoom: function (zoom) {
      this.map.setZoom(zoom);
      return this;
    },

    // Map
    setSingleMarkerZoom: function (target, threshold) {
      this.gz_settings.zoom.target = target;
      if (threshold) {
        this.gz_settings.zoom.threshold = threshold;
      }
      return this;
    },

    getZoom: function () {
      return this.map.getZoom();
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
        this.setMarkerVisibility(idx, true);
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
        if (group.hasOwnProperty(i) && this.markers && this.markers[group[i]]) {
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
          // ,optimized: false
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
        // Add custom click
        this.markers[idx].click = function() {
          google.maps.event.trigger(this, 'click');
        };
        // If set 'hidden'
        if (locs[idx].visible === false) {
          this.markers[idx].setVisible(false);
        }
        // Create standard infowindows
        // TO-DO create custom infowindows GMapz.infowindow?
        if (locs[idx].iw) {
          // We store the infowindow content in the marker also
          this.markers[idx].iw = locs[idx].iw;
          // Infowindows / Infoboxes array
          if (!this.ibx) {
            // There is NOT an infoBox defined
            // We create standard infowindow
            var iw_options = {
              content: this.iw_template.replace('{{__REPLACE__}}',locs[idx].iw),
            };
            // Is there any pixelOffset?
            if (this.map_settings.pixelOffset !== false) {
              iw_options.pixelOffset = new google.maps.Size(
                this.map_settings.pixelOffset[0],
                this.map_settings.pixelOffset[1]
              );
            }
            this.iws[idx] = new google.maps.InfoWindow(iw_options);
            // Click on marker event open Infowindow
            google.maps.event.addListener(this.markers[idx], 'click', function() {
              that.onMarkerClick(this); // this -> markerObj
            });
          } else {
            // We create infobox!
            google.maps.event.addListener(this.markers[idx], 'click', function() {
              // this -> marker
              that.ibx.close();
              var content = that.ibx.gmapz_template.replace('{{__REPLACE__}}',this.iw);
              that.ibx.setContent(content);
              that.ibx.open(that.map, this);
            });
          }
        }

      }

      return this; // Chaining
    }, // addLocations

    onMarkerClick: function(marker_obj) {
      // console.log(marker_obj);
      this.closeAllInfoWindows();
      this.iw_current_idx = marker_obj.idx;
      this.iws[marker_obj.idx].open(this.map, this.markers[marker_obj.idx]);
      // Add class to infowindow container
      if (this.$map.find('.gm-style-iw-container').length === 0) {
        this.$map.find('.gm-style-iw').parent().addClass('gm-style-iw-container');
      }
    },

    // Info windows

    closeInfoWindow: function(idx) {
      if (this.iws[idx]) {
        this.iws[idx].close();
      }
      return this;
    },

    closeAllInfoWindows: function() {
      if (this.ibx) {
        this.ibx.close();
      }
      for (var idx in this.iws) {
        if (this.iws.hasOwnProperty(idx)) {
          this.closeInfoWindow(idx);
        }
      }
      this.iw_current_idx = false;
      return this;
    },

    // Clicks on marker to show its infowindow
    openInfoWindow: function(idx) {
      if (this.iws[idx] && this.markers[idx]) {
        this.markers[idx].click();
      }
      return this;
    },

    // Recalculate bounds and fit view depending on markers
    fitBounds: function (idxArray) {
      var
        visible_count = 0,
        bounds = new google.maps.LatLngBounds();

      // Calculate all visible
      if (!idxArray) {
        for (var idx in this.markers) {
          if (this.markers.hasOwnProperty(idx) && this.markers[idx].getVisible()) {
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
      if (this.gz_settings.zoom.target !== false && visible_count == 1) {
        this.singleMarkerZoomAdjust(this.gz_settings.zoom.threshold, this.gz_settings.zoom.target);
      }

      // More than one marker fit Bounds
      // if (visible_count > 1) {
        this.map.fitBounds(bounds);
      // }

      // If NO marker set, do nothing ;)
      // Will use the default cenrter and zoom

      return this; // Chainning
    },

    // Used when passing place object from gmapz.autocomplete!
    fitToPlace: function (place, zoom) {
      place = ($.isArray(place)) ? place[0] : place;

      if (typeof place.geometry.viewport !== 'undefined') {
        this.map.fitBounds(place.geometry.viewport);
      }
      this.map.setCenter(place.geometry.location);
      if (typeof zoom !== 'undefined') {
        this.map.setZoom(zoom);
      }
      return this;
    },

    singleMarkerZoomAdjust: function (max, target) {
      // Single mark zoom adjust
      // When you have an only marker focused adjust the
      // map's zoom to a better adjustment
      if (GMapz.debug) console.info('Automatic zoom for single marker attached.');
      if (!max) max = 18; //
      if (!target) target = 9;
      var
        that = this;
      google.maps.event.addListenerOnce(this.map, 'idle', function() {
        if (that.map.getZoom() > max) {
          that.map.setZoom(target);
        }
      });
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
      return this;
    },

    // Removes ALL markers in current map
    deleteAllMarkers: function () {
      if (this.markers) {
        for (var idx in this.markers) {
          if (this.markers.hasOwnProperty(idx) && this.markers[idx]) {
            delete this.markers[idx];
          }
          if (this.iws[idx]) {
            delete this.iws[idx];
          }
        }
      }
      return this;
    },

    setMarkerVisibility: function (idx, visible) {
      if (!visible) {
        this.closeInfoWindow(idx);
      }
      this.markers[idx].setVisible(visible);
      return this;
    },

    setAllMarkersVisibility: function (visible) {
      for (var idx in this.markers) {
        this.setMarkerVisibility(idx, visible);
      }
      if (visible) {
        this.fitBounds();
      }
      return this;
    },

    //
    // Geolocation
    //

    findNearestMarkerToPos: function (lat, lng) {
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

    findNearestMarkerToAddress: function (addr) {
      var
        that = this,
        geocoder = new google.maps.Geocoder();

      // Convert location into longitude and latitude
      geocoder.geocode(
        {
          address: addr
        },
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var result = results[0].geometry.location;
            that.geoShowPosition(result);
          } else {
            that.errorAddressNotFound(addr);
          }
        }
      );
    },

    geoShowPosition: function (pos_or_place){
      var
        lat = null,
        lng = null,
        idx = null,
        near_lat = null,
        near_lng = null;

      // Delete userl_location marker if exists
      this.deleteUserLocationMarker();

      // Coords from autocomplete (place)
      if (pos_or_place.geometry) {
        lat = pos_or_place.geometry.location.lat();
        lng = pos_or_place.geometry.location.lng();
      } else if (pos_or_place.coords) {
        // Coords from Navigator.geolocation
        lat = pos_or_place.coords.latitude;
        lng = pos_or_place.coords.longitude;
      } else {
        // Coords from address geocode
        lat = pos_or_place.lat();
        lng = pos_or_place.lng();
      }

      // Find nearest marker
      idx = this.findNearestMarkerToPos(lat, lng);

      near_lat = this.markers[idx].position.lat();
      near_lng = this.markers[idx].position.lng();

      // Add user location
      this.addUserLocationMarker(lat, lng);
      this.map.setCenter(new google.maps.LatLng(lat, lng));

      this.closeAllInfoWindows();
      this.markers[idx].setVisible(true);
      this.markers[idx].setAnimation(google.maps.Animation.DROP);

      var bounds = new google.maps.LatLngBounds();
      bounds.extend(this.markers[idx].getPosition());
      bounds.extend(GMapz.getOppositeCorner(lat, lng, near_lat, near_lng));
      this.map.fitBounds(bounds);
    },

    addUserLocationMarker: function (lat, lng) {
      var
        pos = new google.maps.LatLng(lat,lng);
      if (!this.markers.user_location) {
        this.markers.user_location = new google.maps.Marker({
          position: pos,
          map: this.map,
          icon: GMapz.pins.user_location.pin
        });
      } else {
        this.markers.user_location.setPosition(pos);
      }
    },

    deleteUserLocationMarker: function () {
      if (this.markers.user_location) {
        this.markers.user_location.setMap(null);
        delete this.markers.user_location;
      }
    },

    geoShowError: function (error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          if (GMapz.debug) console.error('User denied the request for Geolocation.');
          break;
        case error.POSITION_UNAVAILABLE:
          if (GMapz.debug) console.error('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          if (GMapz.debug) console.error('The request to get user location timed out.');
          break;
        case error.UNKNOWN_ERROR:
          if (GMapz.debug) console.error('An unknown error occurred.');
          break;
      }
    },

    //
    // Custom scroll control
    //
    addScrollControl: function() {
      var
        that = this,
        $control = $('<div class="gmapz-scroll-control disabled" title="Click to toggle map scroll"><div class="content"><span></span></div></div>');

      // Attach custom control
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push($control[0]);

      $(document).on('click touchstart', '[data-gmapz="'+this.map_id+'"] .gmapz-scroll-control', function(e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) {
          that.resumeScroll();
        } else {
          that.lockScroll();
        }
      });
      return this;
    },

    lockScroll: function() {
      var that = this;
      // Hack for execute only first time!
      // Its first time map is drawn, we need to wait until tiles are drawn or
      // the map.setOption(...) will not work
      if (!this.gz_settings.is_drawn) {
        this.listeners.tilesloaded_responsive = google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){
          that.gz_settings.is_drawn = true;
          google.maps.event.removeListener(that.listeners.tilesloaded_responsive);
          that.lockScrollAction();
        });
      } else {
        // Not first time, nothing to wait for
        this.lockScrollAction();
      }
      $('[data-gmapz="'+this.map_id+'"] .gmapz-scroll-control').addClass('disabled');
    },

    lockScrollAction: function() {
      var that = this;
      this.map.setOptions({
        draggable: false,
        scrollwheel: false
      });
      this.listeners.zoom_on_scroll_lock = google.maps.event.addListener(this.map, 'zoom_changed', function() {
        if (GMapz.debug) console.info('Zoom changed');
        that.resumeScroll();
      });
    },

    resumeScroll: function() {
      this.map.setOptions({
        draggable: true,
        scrollwheel: true
      });
      $('[data-gmapz="'+this.map_id+'"] .gmapz-scroll-control').removeClass('disabled');
      google.maps.event.removeListener(this.listeners.zoom_on_scroll_lock);
    },

    //
    // Custom InfoBox infobox.js
    //
    defineInfoBox: function(ib_options) {
      var that = this;
      this.ibx = new InfoBox(ib_options);
      this.ibx.gmapz_template = ib_options.content;
      // Clean replace
      this.ibx.setContent(this.ibx.gmapz_template.replace('{{__REPLACE__}}',''));

      // Add close event for infobox
      $(document).on('click touchstart', '.gmapz-ibx-close', function(e) {
        e.preventDefault();
        that.ibx.close();
      });
    },

    //
    // Buttons and interaction
    //

    btnAction: function (data, $el) {
      // console.log(data);
      // console.log($el);

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
      if (typeof data.gmapzFindNear !== 'undefined') {
        var
          n = navigator.geolocation;
        if(n) {
          n.getCurrentPosition(this.geoShowPosition.bind(this), this.geoShowError.bind(this));
        } else {
          if (GMapz.debug) console.error('Your web browser doesn\'t support geolocation.');
          return false;
        }
      }

      // Find near address
      if (typeof data.gmapzFindNearAddress !== 'undefined') {
        var
          $input = $($el.data('gmapzInput'));
        if ($input.length) {
          var addr = $input.val();
          // console.log(addr);
          this.findNearestMarkerToAddress(addr);
        } else {
          if (GMapz.debug) console.warn("<input> element '"+$el.data('gmapzInput')+"' not found!");
        }
      }

    }, // btnAction

    //
    // Extra / helpers
    //

    // Converts latitude longitude to pixels on map
    convertLatLngToPixels: function (lat_lng) {
      var
        scale  = Math.pow(2, this.map.getZoom()),
        proj   = this.map.getProjection(),
        bounds = this.map.getBounds(),
        nw = proj.fromLatLngToPoint(
          new google.maps.LatLng(
            bounds.getNorthEast().lat(),
            bounds.getSouthWest().lng()
          )
        ),
        point = proj.fromLatLngToPoint(lat_lng);

      return new google.maps.Point(
        Math.floor((point.x - nw.x) * scale),
        Math.floor((point.y - nw.y) * scale)
      );
    },

    //
    // Eventos
    //
    onMarkerDragEnd: function(marker) {
      if (GMapz.debug) console.log(marker);
    },
    errorAddressNotFound: function(addr) {
      if (GMapz.debug) console.warn("'"+addr+"' address not found!");
    }

  };

  return Constructor;

})();
