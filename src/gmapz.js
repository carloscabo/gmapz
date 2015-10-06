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

  if (typeof window.GMapz !== 'undefined') {
    return;
  }

  //
  // Module general vars
  //
  var
    data = {};

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
    if(jQuery("#"+uniqid).length) {
      return uniqid;
    } else {
      return GMapz.getUniqueId(20);
    }
  }

  //
  // Public methods / properties
  //
  window.GMapz = {
    getUniqueId: getUniqueId,
    data: data
  };

}(jQuery));
