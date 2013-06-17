GMapz = {

  // Related to GoogleMaps objects
  g_map: null,
  g_pins: {},
  g_markers: [],
  g_infowindows: [],

  // Custom objects / properties
  markers: [],
  prev_infowindow: false,
  pin_base: null,
  pins: {},

  init: function(map_id) {

    var t = this;

    // Properties we want to pass to the map
    var g_map_options = {
      scrollwheel: false,
      zoom: 20, // zoom level of the map
      center: new google.maps.LatLng(0,0),
      mapTypeId: google.maps.MapTypeId.ROADMAP // map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    };

    // Calling the constructor, initializing the map
    t.g_map = new google.maps.Map(document.getElementById(map_id), g_map_options);

    // this.map.scrollWheelZoom.disable();

    // Create pins
    for (var i in t.pins) {
      t.g_pins[i] = new google.maps.MarkerImage(t.pins[i]['pin']['img'],
         //width / height
        new google.maps.Size(t.pins[i]['pin']['size'][0], t.pins[i]['pin']['size'][1]),
        // origin
        new google.maps.Point(0,0),
        // anchor point
        new google.maps.Point(t.pins[i]['pin']['anchor'][0], t.pins[i]['pin']['anchor'][1])
      );
    }
  },

  initButtons: function(button_class) {

    var that = this;
    $(button_class).click(function(e) {
      e.preventDefault();
      var lat = $(this).data('lat');
      var lon = $(this).data('lon');
      var zoo = $(this).data('zoom');

      $(this).parents('ul').find('li').removeClass('active');
      $(this).parent('li').addClass('active');
      that.gmap.setCenter(new google.maps.LatLng($(this).data('lat'), $(this).data('lon')));
      that.gmap.setZoom(parseInt(zoo, 10));
    });

    // Click the first one
    //$(button_class).first().click();
  },

  draw: function(markers) {

    // Add Markers
    var g_markers = [];
    var g_infowindows = [];

    // Array de coordenadas
    this.markers = markers;

    // Coordinates of map at start
    var latlng = new google.maps.LatLng(this.markers['lat'],this.markers['lon']);

    // Custom pin/marker properties
    var g_map_image = new google.maps.MarkerImage('/js/gmapz/pin.png',
      new google.maps.Size(62, 100), //width / height
      new google.maps.Point(0,0), // origin
      new google.maps.Point(31, 100) // anchor point
    );

    var bounds = new google.maps.LatLngBounds();

    for (var i = this.markers.length - 1; i >= 0; i--) {
      // Markers array
      g_markers[i] = new google.maps.Marker({
          indice: i,
          position: new google.maps.LatLng(this.markers[i][0],this.markers[i][1]),
          map: this.gmap,
          icon: g_map_image // Custom pin
      });

      bounds.extend(g_markers[i].getPosition());

      // Inforwindows array
      g_infowindows[i] = new google.maps.InfoWindow({
        content:  '<div class="infowindow"><strong>' + this.markers[i][2] + '</strong><br/>' + this.markers[i][3] + '</br><a href="' + this.markers[i][5] + '">' + this.markers[i][4] + '</a></div>'
      });

      // Click on marker event
      var that = this;
      google.maps.event.addListener(g_markers[i], 'click', function() {

        if(that.prev_infowindow) {
          that.prev_infowindow.close();
        }
        that.prev_infowindow = g_infowindows[this.indice];
        g_infowindows[this.indice].open(that.gmap, g_markers[this.indice]);
      });


    } //for

    // Bounds with several markers
    this.gmap.fitBounds(bounds);

    // Single mark zoom adjust
    var tgm = this.gmap;
    var listener = google.maps.event.addListener(this.gmap, "idle", function() {
      if (tgm.getZoom() > 16) tgm.setZoom(14);
      google.maps.event.removeListener(listener);
    });
  }
};
