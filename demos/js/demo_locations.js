// You can include this data wherever you want

// Data
locs = {
  1: { // LOCATION IDX MUST BE UNIQUE
    lat: 42.5868,
    lng: 0.9745,
    iw: 'idx:1 <br>Aigüestortes i Estany de Sant Maurici.<br>Lérida, Cataluña<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Aig%C3%BCestortes_y_Lago_de_San_Mauricio">Wikipedia</a>'
  },
  289: {
    lat: 39.158333,
    lng: 2.966667,
    iw: 'idx: 289<br>Archipiélago de Cabrera<br>Islas Baleares<a href="http://es.wikipedia.org/wiki/Parque_nacional_mar%C3%ADtimo-terrestre_del_Archipi%C3%A9lago_de_Cabrera">Wikipedia</a>'
  },
  38: {
    lat: 39.4261,
    lng: -4.52528,
    iw: 'idx: 38<br>Parque nacional de Cabañeros<br>Toledo, Ciudad Real<br><a href="http://www.parquenacionalcabaneros.com/">Página web oficial</a>'
  },
  2: {
    pin: 'blue',
    lat: 28.7166,
    lng: -17.8833,
    iw: 'idx: 2<br>Caldera de Taburiente<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_la_Caldera_de_Taburiente">Wikipedia</a>'
  },
  3: {
    lat: 37.0003,
    lng: -6.4166,
    iw: 'idx: 3<br>Doñana<br>Huelva<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_y_natural_de_Do%C3%B1ana">Wikipedia</a>'
  },
  'garajonay': {
    pin: 'blue',
    lat: 28.1262,
    lng: -17.2372,
    iw: 'idx: 4<br>Garajonay<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Garajonay">Wikipedia</a>'
  },
  5: {
    pin: 'orange',
    lat: 42.3805,
    lng: -8.9333,
    iw: 'idx: 5<br>Parque nacional de las Islas Atlánticas de Galicia<br>Galicia<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_las_Islas_Atl%C3%A1nticas_de_Galicia">Wikipedia</a>'
  },
  6: {
    lat: 39.8408,
    lng: -6.03,
    iw: 'idx: 6<br>Parque nacional de Monfragüe<br>Extremadura<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Monfrag%C3%BCe">Wikipedia</a>'
  },
  7: {
    lat: 42.6716,
    lng: 0.0555,
    iw: 'idx: 7<br>Ordesa y Monte Perdido<br>Huesca<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Ordesa_y_Monte_Perdido">Wikipedia</a>'
  },
  'picos_de_europa': {
    pin: 'orange',
    lat: 43.1833,
    lng: -4.8333,
    iw: 'Picos de Europa<br>Asturias<br><a href="http://es.wikipedia.org/wiki/Picos_de_Europa">Wikipedia</a>'
  },
  9: {
    lat: 37.2,
    lng: -3.25,
    iw: 'idx: 9<br>Sierra Nevada<br>Granada<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Sierra_Nevada_(Espa%C3%B1a)">Wikipedia</a>'
  },
  10: {
    lat: 39.1297,
    lng: -3.7202,
    iw: 'idx: 10<br>Tablas de Daimiel<br>Ciudad Real<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_las_Tablas_de_Daimiel">Wikipedia</a>'
  },
  'teide': {
    pin: 'blue',
    lat: 28.2713,
    lng: -16.6436,
    iw: 'idx: 11<br>Parque nacional del Teide<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_del_Teide">Wikipedia</a>',
    hidden: true
  },
  12: {
    pin: 'blue',
    lat: 29.0111,
    lng: -13.7333,
    iw: 'idx: 12<br>Parque nacional de Timanfaya<br>Islas Canarias<br><a href="http://es.wikipedia.org/wiki/Parque_nacional_de_Timanfaya">Wikipedia</a>'
  }
};

// Data
var morocco = {
  'FEZ' : { // ITEM IDX MUST BE UNIQUE
    pin: 'green',
    lat: 34.033884,
    lng: -5.000206,
    iw: 'idx: 667<br>Fez en Marruecos',
    draggable: true
  },
  'ORAN' : {
    pin: 'green',
    lat: 35.698013,
    lng: -0.632942,
    iw: 'idx: 668<br>Orán',
    draggable: true
  },
  12: { // Updated location on pourposse
    pin: 'green',
    lat: 43.257206,
    lng: -2.923763,
    draggable: true
  },
};

// Update
update = {
  289: {
    lat: 42.1541,
    lng: 9.0884,
    iw: 'idx: 289<br><b>Ahora está en Córcega ;)</b>'
  }
};

// France main cities
france_cities = {
  paris: {
    lat: 48.860,
    lng: 2.340,
    iw: 'Paris 2107700'
  },
  marseille: {
    lat: 43.310,
    lng: 5.370,
    iw: 'Marseille 826300'
  },
  lyon: {
    lat: 45.760,
    lng: 4.830,
    iw: 'Lyon  443600'
  },
  toulouse: {
    lat: 43.620,
    lng: 1.450,
    iw: 'Toulouse  417400'
  },
  Nice: {
    lat: 43.700,
    lng: 7.270,
    iw: 'Nice  329800'
  },
  Nantes: {
    lat: 47.230,
    lng: -1.570,
    iw: 'Nantes  285700'
  },
  Strasbourg: {
    lat: 48.580,
    lng: 7.760,
    iw: 'Strasbourg  274700'
  },
  Montpellier: {
    lat: 43.610,
    lng: 3.870,
    iw: 'Montpellier 231900'
  },
  Bordeaux: {
    lat: 44.840,
    lng: -0.580,
    iw: 'Bordeaux  217400'
  },
  rennes: {
    lat: 48.110,
    lng: -1.680,
    iw: 'Rennes  214200'
  },
  le_havre: {
    lat: 49.500,
    lng: 0.120,
    iw: 'Le havre  189000'
  },
  reims: {
    lat: 49.250,
    lng: 4.030,
    iw: 'Reims 183900'
  },
  lille: {
    lat: 50.640,
    lng: 3.070,
    iw: 'Lille 180100'
  },
  saint_etienne: {
    lat: 45.430,
    lng: 4.390,
    iw: 'Saint-etienne 168600'
  },
  toulon: {
    lat: 43.130,
    lng: 5.920,
    iw: 'Toulon 161600'
  },
  grenoble: {
    lat: 45.190,
    lng: 5.720,
    iw: 'Grenoble 156200'
  },
  angers: {
    lat: 47.480,
    lng: -0.540,
    iw: 'Angers 153800'
  },
  brest: {
    lat: 48.390,
    lng: -4.500,
    iw: 'Brest 152000'
  },
  le_mans: {
    lat: 48.000,
    lng: 0.200,
    iw: 'Le mans 149300'
  },
  dijon: {
    lat: 47.330,
    lng: 5.030,
    iw: 'Dijon 146400'
  },
  aix_en_provence: {
    lat: 43.530,
    lng: 5.440,
    iw: 'Aix-en-provence 139000'
  },
  clermont_ferrand: {
    lat: 45.780,
    lng: 3.080,
    iw: 'Clermont-ferrand 137300'
  },
  nimes: {
    lat: 43.840,
    lng: 4.350,
    iw: 'Nimes 137200'
  },
  amiens: {
    lat: 49.900,
    lng: 2.300,
    iw: 'Amiens 135800'
  },
  tours: {
    lat: 47.380,
    lng: 0.690,
    iw: 'Tours 133700'
  },
  limoges: {
    lat: 45.830,
    lng: 1.250,
    iw: 'Limoges 131900'
  },
  metz: {
    lat: 49.120,
    lng: 6.180,
    iw: 'Metz 125300'
  },
  villeurbanne: {
    lat: 45.770,
    lng: 4.880,
    iw: 'Villeurbanne 121800'
  },
  besancon: {
    lat: 47.240,
    lng: 6.020,
    iw: 'Besancon 118300'
  },
  caen: {
    lat: 49.190,
    lng: -0.360,
    iw: 'Caen 116800'
  },
  orleans: {
    lat: 47.900,
    lng: 1.900,
    iw: 'Orleans 112200'
  },
  mulhouse: {
    lat: 47.760,
    lng: 7.340,
    iw: 'Mulhouse 111500'
  },
  perpignan: {
    lat: 42.700,
    lng: 2.890,
    iw: 'Perpignan 111400'
  },
  boulogne_billancourt: {
    lat: 48.830,
    lng: 2.240,
    iw: 'Boulogne-billancourt 108500'
  },
  rouen: {
    lat: 49.440,
    lng: 1.080,
    iw: 'Rouen 105100'
  },
  nancy: {
    lat: 48.690,
    lng: 6.170,
    iw: 'Nancy 103100'
  },
  roubaix: {
    lat: 50.690,
    lng: 3.170,
    iw: 'Roubaix 95800'
  },
  tourcoing: {
    lat: 50.720,
    lng: 3.160,
    iw: 'Tourcoing 92400'
  },
  argenteuil: {
    lat: 48.940,
    lng: 2.240,
    iw: 'Argenteuil 90300'
  },
  avignon: {
    lat: 43.960,
    lng: 4.810,
    iw: 'Avignon 87100'
  },
  montreuil: {
    lat: 48.860,
    lng: 2.430,
    iw: 'Montreuil 86600'
  },
  nanterre: {
    lat: 48.900,
    lng: 2.200,
    iw: 'Nanterre 86100'
  },
  poitiers: {
    lat: 46.580,
    lng: 0.340,
    iw: 'Poitiers 85900'
  },
  saint_denis: {
    lat: 48.940,
    lng: 2.360,
    iw: 'Saint-denis 82000'
  },
  versailles: {
    lat: 48.810,
    lng: 2.140,
    iw: 'Versailles 81200'
  },
  creteil: {
    lat: 48.790,
    lng: 2.450,
    iw: 'Creteil 79700'
  },
  pau: {
    lat: 43.300,
    lng: -0.390,
    iw: 'Pau 79600'
  },
  la_rochelle: {
    lat: 46.170,
    lng: -1.180,
    iw: 'La rochelle 79400'
  },
  colombes: {
    lat: 48.930,
    lng: 2.250,
    iw: 'Colombes 78400'
  },
  asnieres_sur_seine: {
    lat: 48.910,
    lng: 2.290,
    iw: 'Asnieres-sur-seine 77400'
  },
  calais: {
    lat: 50.950,
    lng: 1.860,
    iw: 'Calais 77200'
  },
  aulnay_sous_bois: {
    lat: 48.960,
    lng: 2.490,
    iw: 'Aulnay-sous-bois 76500'
  },
  vitry_sur_seine: {
    lat: 48.790,
    lng: 2.390,
    iw: 'Vitry-sur-seine 76300'
  },
  rueil_malmaison: {
    lat: 48.890,
    lng: 2.170,
    iw: 'Rueil-malmaison 75000'
  },
  champigny_sur_marne: {
    lat: 48.820,
    lng: 2.510,
    iw: 'Champigny-sur-marne 72000'
  },
  beziers: {
    lat: 43.350,
    lng: 3.210,
    iw: 'Beziers 71200'
  },
  saint_maur_des_fosses: {
    lat: 48.800,
    lng: 2.490,
    iw: 'Saint-maur-des-fosses 70900'
  },
  dunkerque: {
    lat: 51.040,
    lng: 2.340,
    iw: 'Dunkerque 70400'
  },
  antibes: {
    lat: 43.600,
    lng: 7.120,
    iw: 'Antibes 70100'
  },
  saint_nazaire: {
    lat: 47.28,
    lng: -2.220,
    iw: 'Saint-nazaire 70000'
  }
};
