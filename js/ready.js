$(document).ready(function() {
  // La magia aquí

  // Pins
  // Mus be defined BEFORE map init
  GMapz.path = 'img/gmapz/';
  GMapz.pins = {
    default: {
      pin: {
        img: GMapz.path + 'pin.png',
        size: [48.0, 48.0],
        anchor: [24.0, 48.0]
      },
      shadow: {
        img: GMapz.path + 'pin-shadow.png',
        size: [73.0, 48.0]
      }
    },
    orange: {
      pin: {
        img: GMapz.path + 'pin-orange.png',
        size: [48.0, 48.0],
        anchor: [24.0, 48.0]
      },
      shadow: {
        img: GMapz.path + 'pin-shadow.png',
        size: [73.0, 48.0]
      }
    },
    blue: {
      pin: {
        img: GMapz.path + 'pin-blue.png',
        size: [48.0, 48.0],
        anchor: [24.0, 48.0]
      }
    },
    green: {
      pin: {
        img: GMapz.path + 'pin-green.png',
        size: [48.0, 48.0],
        anchor: [24.0, 48.0]
      }
    }
  };

  // Data
  var locations = {
    1: { // LOCATION IDX MUST BE UNIQUE AND NUMERIC
      lat: 42.5868,
      lng: 0.9745,
      iw: 'Aigüestortes i Estany de Sant Maurici.<br>Lérida, Cataluña<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Aig%C3%BCestortes_y_Lago_de_San_Mauricio">Wikipedia</a>'
    },
    289: {
      lat: 39.158333,
      lng: 2.966667,
      iw: 'Archipiélago de Cabrera<br>Islas Baleares<a href="http://es.wikipedia.org/wiki/Parque_nacional_mar%C3%ADtimo-terrestre_del_Archipi%C3%A9lago_de_Cabrera">Wikipedia</a>'
    },
    38: {
      lat: 39.4261,
      lng: -4.52528,
      iw: 'Parque nacional de Cabañeros<br>Toledo, Ciudad Real<br><a href="http://www.parquenacionalcabaneros.com/">Página web oficial</a>'
    },
    2: {
      pin: 'blue',
      lat: 28.7166,
      lng: -17.8833,
      iw: 'Caldera de Taburiente<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_la_Caldera_de_Taburiente">Wikipedia</a>'
    },
    3: {
      lat: 37.0003,
      lng: -6.4166,
      iw: 'Doñana<br>Huelva<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_y_natural_de_Do%C3%B1ana">Wikipedia</a>'
    },
    4: {
      pin: 'blue',
      lat: 28.1262,
      lng: -17.2372,
      iw: 'Garajonay<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Garajonay">Wikipedia</a>'
    },
    5: {
      pin: 'orange',
      lat: 42.3805,
      lng: -8.9333,
      iw: 'Parque nacional de las Islas Atlánticas de Galicia<br>Galicia<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_las_Islas_Atl%C3%A1nticas_de_Galicia">Wikipedia</a>'
    },
    6: {
      lat: 39.8408,
      lng: -6.03,
      iw: 'Parque nacional de Monfragüe<br>Extremadura<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Monfrag%C3%BCe">Wikipedia</a>'
    },
    7: {
      lat: 42.6716,
      lng: 0.0555,
      iw: 'Ordesa y Monte Perdido<br>Huesca<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Ordesa_y_Monte_Perdido">Wikipedia</a>'
    },
    8: {
      pin: 'orange',
      lat: 43.1833,
      lng: -4.8333,
      iw: 'Picos de Europa<br>Asturias<br><a href="http://es.wikipedia.org/wiki/Picos_de_Europa">Wikipedia</a>'
    },
    9: {
      lat: 37.2,
      lng: -3.25,
      iw: 'Sierra Nevada<br>Granada<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Sierra_Nevada_(Espa%C3%B1a)">Wikipedia</a>'
    },
    10: {
      lat: 39.1297,
      lng: -3.7202,
      iw: 'Tablas de Daimiel<br>Ciudad Real<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_las_Tablas_de_Daimiel">Wikipedia</a>'
    },
    11: {
      pin: 'blue',
      lat: 28.2713,
      lng: -16.6436,
      iw: 'Parque nacional del Teide<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_del_Teide">Wikipedia</a>'
    },
    12: {
      pin: 'blue',
      lat: 29.0111,
      lng: -13.7333,
      iw: 'Parque nacional de Timanfaya<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Timanfaya">Wikipedia</a>'
    }
  };

  // Data
  var morocco = {
    667 : { // ITEM IDX MUST BE UNIQUE AND NUMERIC
      pin: 'green',
      lat: 34.033884,
      lng: -5.000206,
      iw: 'Fez en Marruecos'
    },
    668 : {
      pin: 'green',
      lat: 35.698013,
      lng: -0.632942,
      iw: 'Orán'
    },
    8: { // Changed location on pourposse
      pin: 'green',
      lat: 43.257206,
      lng: -2.923763
      //iw: 'Picos de Europa<br>Asturias<br><a href="http://es.wikipedia.org/wiki/Picos_de_Europa">Wikipedia</a>'
    },
  };

  //console.log(morocco);

  GMapz.init('map-container');
  GMapz.addMarkers(locations);
  GMapz.buttonInit();

  // Button behaviors
  $('#js-new-locations').click(function (e) {
    e.preventDefault();
    GMapz.addMarkers(morocco);
  });

  $('#js-delete-markers').click(function (e) {
    e.preventDefault();
    GMapz.deleteMarkers([289,12,666]);
  });

});
