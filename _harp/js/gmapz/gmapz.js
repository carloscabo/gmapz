/*
 ====================================
 GMapz. Yet another gmaps manager
 by carlos Cabo 2015. V.2.07
 https://github.com/carloscabo/gmapz
 ====================================
*/

/**
 * Core and general tools
 */
(function($, undefined) {
  'use strict';

  // Singleton
  if (typeof window.GMapz !== 'undefined') {
    return;
  }

  //
  // Module general vars
  //
  var
    v = '2.06',
    debug = false,
    data = {
      map_api_requested: false,
      map_api_ready: false
    },
    pins = null,
    lang = '',
    APIKEY = '';

  //
  // Methods
  //

  // Return uniqueID string.
  function getUniqueId (len, prefix) {
    var
      chars = 'abcdefghiklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ'.split(''),
      uniqid = '';
    if (!len) { len = Math.floor(Math.random() * chars.length); }
    for (var i = 0; i < len; i++) {
      uniqid += chars[Math.floor(Math.random() * chars.length)];
    }
    if (prefix) {
      uniqid = prefix + uniqid;
    }
    // one last step is to check if this ID is already taken by an element before
    return uniqid;
  }

  // Request API
  function requestAPI (callback_fn) {
    if (!data.map_api_requested) {
      if (typeof callback_fn === 'undefined') {
        callback_fn = 'GMapz.onApiReady';
      }
      data.map_api_requested = true;
      loadScript( callback_fn );
    }
  }

  // Inject GM Api
  function loadScript (callback_fn) {
    if (lang === '') {
      lang = $('html').attr('lang') || $('html').attr('xml:lang') || 'en';
    }
    var
      script = document.createElement('script'),
      url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places&language='+lang+'&callback='+callback_fn;
    if (APIKEY !== '') {
      url += '&key='+APIKEY;
    }
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
  }

  // Override from outside
  function onGoogleMapsReady() {
    // Do nothing
  }

  function onApiReady() {
    data.map_api_ready = true;

    if (this.debug) console.info('google.maps api loaded -> call gmapz.maps / autocomplete instances');

    GMapz.onGoogleMapsReady();

    // Prepare custom if any pins (we need google.maps)
    if(GMapz.pins) {
      GMapz.createCustomPins();
    }

    // Alert each map instance
    $('[data-gmapz], [data-gmapz-autocomplete]').each(function(idx, el) {
      $(el)[0].gmapz.instanceReady();
    });
  }

  // Pin creation
  function createCustomPins() {
    var _p = $.extend(true, {}, this.pins); // Clone
    this.pins = {}; // Erase

    // Create pins
    for (var key in _p) {
      // Pins
      if (_p.hasOwnProperty(key) && _p[key].pin.img) {
        this.pins[key] = {};
        this.pins[key].pin = new google.maps.MarkerImage(_p[key].pin.img,
          // width / height
          new google.maps.Size(_p[key].pin.size[0], _p[key].pin.size[1]),
          // origin
          new google.maps.Point(0,0),
          // anchor point
          new google.maps.Point(_p[key].pin.anchor[0], _p[key].pin.anchor[1])
        );
      }
    }
  }

  // Given a center (cx, cy) and a corner (rx, ry)
  // Returns the opposite corner of rectangle
  function getOppositeCorner(cx, cy, rx, ry) {
    var
      x = cx + (cx - rx),
      y = cy + (cy - ry);
    return new google.maps.LatLng(x,y);
  }

  // Converts google.maps bounds object into "NW_lat, NW_lng, SE_lat, SE_lng" sting
  function serializeBounds (bounds) {
    var
      sw = bounds.getSouthWest(),
      ne = bounds.getNorthEast();
    return [sw.lat(), sw.lng(), ne.lat(), ne.lng()].join(',');
  }

  // Initialize buttons to control the map(s)
  // Buttons may have data-gmapz-target attribute, read the doc
  // For functionallity
  function attachActionButtons () {
    // Generic elements but select / <a>
    $(document).on('click', '*[data-gmapz-target]:not(select)', function (e) {
      e.preventDefault();
      var
        target  = $(this).attr('data-gmapz-target');
      // Get all data attributes ans send them to gmapz handler and the element
      $('[data-gmapz="'+target+'"]')[0].gmapz.btnAction($(this).data(), $(this));
    }).on('change', 'select[data-gmapz-target]', function (e) {
      // <select>
      var
        target  = $(this).attr('data-gmapz-target');
      $('[data-gmapz="'+target+'"]')[0].gmapz.btnAction($(this).find('option:selected').data());
    });

  }

  //
  // Public methods / properties
  //
  window.GMapz = {
    onGoogleMapsReady: onGoogleMapsReady,
    attachActionButtons: attachActionButtons,
    getOppositeCorner: getOppositeCorner,
    createCustomPins: createCustomPins,
    onApiReady: onApiReady,
    requestAPI: requestAPI,
    getUniqueId: getUniqueId,
    debug: debug,
    data: data,
    pins: pins // Custom pins
  };

}(jQuery));
