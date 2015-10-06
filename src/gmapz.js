/*
 ====================================
 GMapz. Yet another gmaps manager
 by carlos Cabo 2015. V.2.0 beta
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
    data = {
      map_api_requested: false,
      map_api_ready: false
    },
    pins = null;

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

  // Reques api
  function requestAPI () {
    if (!data.map_api_requested) {
      data.map_api_requested = true;
      loadScript('GMapz.onApiReady');
    }
  }

  // Inject GM Api
  function loadScript (callback_fn) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&signed_in=true&libraries=places&language=en&callback='+callback_fn;
    document.body.appendChild(script);
  }

  function onApiReady() {
    data.map_api_ready = true;
    console.log('api is ready');

    // Prepare custom if any pins (we need google.maps)
    if(GMapz.pins) {
      GMapz.createCustomPins();
    }

    // Alert each instance
    /*$('[data-gmapz]').each(function(idx, el) {
      var gz_obj = $(el).data('plugin_gmapz');
      gz_obj.instanceReady();
    });*/
  }

  function createCustomPins() {
    var _p = $.extend(true, {}, this.pins); // Clone
    this.pins = {}; // Erase

    // Create pins
    for (var key in _p) {
      // Pins
      if (_p[key].pin.img) {
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

  //
  // Public methods / properties
  //
  window.GMapz = {
    createCustomPins: createCustomPins,
    onApiReady: onApiReady,
    requestAPI: requestAPI,
    getUniqueId: getUniqueId,
    data: data,
    pins: pins // Custom pins
  };

}(jQuery));
