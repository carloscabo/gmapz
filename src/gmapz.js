/*
 ====================================
 GMapz. Yet another gmaps manager
 by carlos Cabo 2015. V.2.0 beta
 https://github.com/carloscabo/gmapz
 ====================================
*/

/**
 * Core and general tools
 * @type {Object}
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
    };

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
    if (!this.data.map_api_requested) {
      this.data.map_api_requested = true;
      this.loadScript('GMapz.apiReady');
    }
  }

  // Inject GM Api
  function loadScript (callback_fn) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&signed_in=true&libraries=places&language=en&callback='+callback_fn;
    document.body.appendChild(script);
  }

  function apiReady() {
    this.data.map_api_ready = true;
    console.log('api is ready');
  }

  //
  // Public methods / properties
  //
  window.GMapz = {
    requestAPI: requestAPI,
    getUniqueId: getUniqueId,
    data: data
  };

}(jQuery));
