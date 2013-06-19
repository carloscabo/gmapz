$(document).ready(function() {
  // La magia aquí

  // Pins
  // Mus be defined BEFORE map init
  GMapz.pin_base = 'img/gmapz/';
  GMapz.pins = {
    default: {
      pin: {
        img: GMapz.pin_base + 'pin.png',
        size: [48.0, 48.0],
        anchor: [24.0, 48.0]
      },
      shadow: {
        img: GMapz.pin_base + 'pin-shadow.png',
        size: [73.0, 48.0]
      }
    },
    orange: {
      pin: {
        img: GMapz.pin_base + 'pin-orange.png',
        size: [48.0, 48.0],
        anchor: [24.0, 48.0]
      },
      shadow: {
        img: GMapz.pin_base + 'pin-shadow.png',
        size: [73.0, 48.0]
      }
    },
    blue: {
      pin: {
        img: GMapz.pin_base + 'pin-blue.png',
        size: [48.0, 48.0],
        anchor: [24.0, 48.0]
      }
    }
  };

  // Data
  var locations = [
    {
      idx: 1, // MUST BE UNIQUE AND NUMERIC
      lat: 40.372,
      lng: -3.915,
      z:   9,
      iw: 'Universidad Europea de Madrid.<br>Campus de Villaviciosa de Odón<br>C/ Tajo s/n. Villaciosa de Odón<br>28670 Madrid.<br><a href="http://www.uem.es/">Visita la web</a>'
    },{
      idx: 289,
      pin: 'orange',
      lat: 39.479,
      lng: -0.366,
      z:   9,
      iw: 'Universidad Europea de Valencia<br>C/ General Elio, 2-8-10 46010 Valencia (Frente a los Jardines de Viveros)<br><a href="http://valencia.uem.es" >Visita la web</a>'
    },{
      idx: 38,
      pin: 'blue',
      lat: 28.39,
      lng: -16.524,
      z:   9,
      iw: 'Universidad Europea de Canarias<br>Calle de Inocencio garcía 1. La Orotava. Tenerife.<br><a href="http://universidadeuropeadecanarias.es">visita la web</a>'
    }
  ];

  GMapz.init('map-container');
  //console.log(GMapz.pins);
  GMapz.draw(locations);
  GMapz.buttonInit();

});
