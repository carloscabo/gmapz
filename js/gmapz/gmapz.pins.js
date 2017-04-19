// Pins must be defined BEFORE map initialization

var base_path = 'img/gmapz/';
GMapz.pins = {
  'default': { // IE8 Reserved word, allways mus be QUOTED!
    pin: {
      img: base_path + 'pin.png',
      size: [48.0, 48.0],
      anchor: [24.0, 48.0]
    }
  },
  user_location: { // Used for geolocation
    pin: {
      img: base_path + 'pin-user-location.png',
      size: [48.0, 48.0],
      anchor: [24.0, 48.0]
    }
  },
  orange: {
    pin: {
      img: base_path + 'pin-orange.png',
      size: [48.0, 48.0],
      anchor: [24.0, 48.0]
    }
  },
  blue: {
    pin: {
      img: base_path + 'pin-blue.png',
      size: [48.0, 48.0],
      anchor: [24.0, 48.0]
    }
  },
  green: {
    pin: {
      img: base_path + 'pin-green.png',
      size: [48.0, 48.0],
      anchor: [24.0, 48.0]
    }
  }
};
