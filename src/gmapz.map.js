//
// Creates instances of GMapz maps
//
GMapz.gz_map = (function() {

  function Constructor(map_id, options, markers) {
    // initialSettings.apply(this);
  }

  function initialSettings() {
    console.log('add settings');
    console.log(this);
  }

  Constructor.prototype = {

    settings: {
      scrollwheel: true,
      scaleControl: true
      /*styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]*/
    },

    methodName1: function(e) {
      //function code
      return 'ploki';
    },

    methodName2: function(parameter) {
      //function code
      return parameter;
    }
  };

  return Constructor;

})();

//
// JQuery hook
//
$.fn.gmapz = function ( options, markers ) {
  return this.each(function () {
    if (!$.data(this, "plugin_gmapz")) {
      var map_id = GMapz.getUniqueId(8,'gz-');
      $(this).attr('data-gmapz', map_id).data("plugin_gmapz", new GMapz.gz_map(map_id, options));
    }
  });
};
