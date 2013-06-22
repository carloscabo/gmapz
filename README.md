gmapz
=====

GMapz is yet another Google Maps JS library. I know there are other out there but I wanted to dig a little in how Google Maps works, and recopile in one only JS lib several features I've needed in past porjects including GMs.

You can view the working sample included in the following URL

<h3><a href="http://htmlpreview.github.io/?https://github.com/carloscabo/gmapz/blob/master/index.htm" target="_blank">GMapz working sample</a></h3>

Features
========

- Ease to add the map markers in a JSON way
- Posibility to define different pin designs for the markers
- Functionality to Show / hide "groups" of markers
- Functionality to find the nearest marker to user geolocalization or to an address provided in "text mode"

Setup and config
================

The best way to see how **GMpaz** its to take a look to the files included in the sample you can find in the repository. Will be very useful if you take a look to the `ready.js` while you read this section.

### HTML

You only need to define a DIV container with and unique ID

    <div id="map-container">
      <!-- Map will be drawn here -->
    </div>
    

### Defining the pins

Its useful to understand the way that GMpaz goes when triying to initialize your markers.

1. If you dont define this section default Google Maps' "Pins" will be used to identify all the markers in the map.
2. If you define a `default` pin this will be the one assigned by default to **all the markers that don't have any other pin asigned**. So it's allways recommended to define a "default pin".
3. If a marker don't have a `shadow` parameter, GMapz will asign it the shadow of the `default` pin, so if all the pins share the same shadow you don't need to define it again and again.
4. The markers are identifyed by its `key`, in the sample you can find in `ready.js` the **keys** are `default`, `orange`, `blue` ...

Take care of the path property that defines where are stored your "custom pin" images.

    GMapz.path = 'img/gmapz/';
    
You must define your customized pins this way

    GMapz.path = 'img/gmapz/'; // Path to the images
    GMapz.pins = {
      default: { // This is the "key" or "name" of the pin
        pin: {
          img: GMapz.path + 'pin.png',
          size: [48.0, 48.0],  // Size of the img in pixels
          anchor: [24.0, 48.0] // Point used as anchor
        },
        shadow: {
          img: GMapz.path + 'pin-shadow.png',
          size: [73.0, 48.0]
        }
      },
      ...

### Defining the markers

You define the markers inside an object this way:

    var locations = [
      {
        idx: 1, // MUST BE UNIQUE AND NUMERIC
        pin: 'orange', // The key / name we asigned before
        lat: 40.372,
        lng: -3.915,
        iw: 'Picos de Europa<br>Asturias<br><a href="http://es.wikipedia.org/wiki/Picos_de_Europa">Wikipedia</a>'
      }
      ...

- The `idx` (index) parameter helps to identify the marker inside the map, must be unique, but it's not necessary that the idxs are consecutive / sequential.

- The `iw` parameter defines the info that the marker will show when clicked, a.k.a. `infowindow`.

- `pin` must be in the ones we defined in the previous step ( _Defining the pins_ ), if you omit this parameter GMpaz will asign the pin named `default`, if that is also undefined will asign a default Google Maps pin.

### Initializing the map

    GMapz.init('map-container'); // You pass the map-container ID
    
### Draw all the markers and start

    GMapz.draw(locations);
    
This sentence pass our marker object `locations` to draw them in our map.

Buttons and interactivity
=========================

When you call:

    GMapz.buttonInit();
    
GMapz automatically look for all the elements in the page with the attribute `data-gmapz-function` and will asign them an JQuery `click` event.
    
You can pass several additional `data-attributes` to identify the parameters for the function asigned to the button.

For instance:

    <a href="#" data-gmapz-function="show-group" data-group="289,38">Show group B</a>
    
This button hides all markers BUT the ones defined in `data-group` (with `idx` `298` and `38` ).

### Available button functions

    data-gmapz-function="show-group" data-group="2,4,11,12" data-hide-rest="true"
Show group of markers. `data-hide-rest` optional attribute defines if rest of the markers will be visible or not.

    data-gmapz-function="show-all"
Show all the markers

    data-gmapz-function="zoom" data-lat="43.361736" data-lng="-5.85029" data-zoom="16"
Zoom to location coordinates

    data-gmapz-function="zoom" data-idx="38"
Zoom to a single marker idx

    data-gmapz-function="find-near"
Try to find nearest marker to your postion (using Geolocation)

    data-gmapz-function="find-near-address"
Try to find nearest marker to an address entered by the user

Helpers
=======

    GMapz.convertDMStoDec('13°44′00″S');
    // Returns -13.733333333333333
    
Converts coordinates in DMS (Degree/Minutes/Seconds) to Decimal notation, the ones used by GoogleMaps.

TO-DO
=====

- Add custom color palette to the map
- Have several maps in the same page
- Automatically convert coordinates in DMS (29°00′40″N) to Dec


