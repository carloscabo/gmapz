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

The best way to see how **GMapz** its to take a look to the files included in the sample you can find in the repository. Will be very useful if you take a look to the `ready.js` while you read this section.

### HTML

You only need to define a DIV container with and unique ID

    <div id="map-1">
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
      289: { // LOCATION IDX MUST BE UNIQUE AND NUMERIC
        pin: 'orange', // RELATED TO THE ONES DEFINED BEFORE
        lat: 42.5868,
        lng: 0.9745,
        iw: 'Infowindow text'
      },
      ...

- The `idx` (index) key helps to identify the marker inside the map, must be unique, but it's not necessary that the idxs are consecutive / sequential.

- The `iw` parameter defines the info that the marker will show when clicked, a.k.a. `infowindow`.

- `pin` must be in the ones we defined in the previous step ( _Defining the pins_ ), if you omit this parameter GMpaz will asign the pin named `default`, if that is also undefined will asign a default Google Maps pin.

### Initializing the map

    GMapz.init('map-1'); // You pass the map-container ID
    
### Draw all the markers and start

    GMapz.addMarkers(locations);
    
This sentence pass our marker object `locations` to draw them in our map.

Buttons and interactivity
=========================

When you call:

    GMapz.buttonInit();

GMapz automatically look for all the elements in the page with the attribute `data-gmapz="__ID_OF_YOUR_MAP___"` and will asign them an JQuery `click` event.

You can pass several additional `data-attributes` to identify the parameters for the function asigned to the button.

For instance:

    <a href="#" data-gmapz="map-1" data-function="show-group" data-group="5,8">

This button hides all markers BUT the ones defined in `data-group` (with `idx` `5` and `8` ).

### Available button functions

    data-function="show-group" data-group="2,4,11,12" data-hide-rest="true"
Show group of markers. `data-hide-rest` optional attribute defines if rest of the markers will be visible or not.

    data-function="show-all"
Show all the markers

    data-function="zoom" data-lat="43.361736" data-lng="-5.85029" data-zoom="16"
Zoom to location coordinates

    data-function="zoom" data-idx="38"
Zoom to a single marker idx

    data-function="find-near"
Try to find nearest marker to your postion (using Geolocation)

    data-function="find-near-address"
Try to find nearest marker to an address entered by the user

Methods
=======

There are several methods you can call from your own JS to interact with the map:

    GMapz.addMarkers(locations_object);

You can add new markers to the map when you need it, remember that markers are idenfied by its keys, so if you pass new markers with the same keys that the existing ones you will replace them.

    GMapz.deleteMarkers([289,12,666]); // Expects Array of IDX

Delete array of markers that will be removed from the map.

    GMapz.calculateBounds();

Force maps bounds recalculation and zooms to all visible markers in that moment.

    GMapz.closeAllInfoWindows();
    // SELF-EXPLANATORY ;)
    
    GMapz.setMarkersVisibility(BOOLEAN); 
    // Shows / hides all markers
    // Closes al infowindows
    // Zooms to the markers available
    
    GMapz.showMarkerGroup(ARRAY_OF_IDX, BOOLEAN); 
    // Shows and zooms to the markers passed
    // Second parameter if true hides all the rest
    
    GMapz.oomTo(LAT, LNG, ZOOM);

    GMapz.stopAllAnimations();
    // SELF-EXPLANATORY ;)
    
    GMapz.findNearestMarkerTo(LAT, LNG);
    // Returns the marker IDX nearest to the LAT, LNG coordinates
    
    GMapz.findNearestMarkerToAddress(STRING);
    // Returns the marker IDX nearest to an address coordinates

Helpers
=======

    GMapz.convertDMStoDec('13°44′00″S');
    // Returns -13.733333333333333

Converts coordinates in DMS (Degree/Minutes/Seconds) to Decimal notation, the ones used by GoogleMaps.

TO-DO
=====

- Easy way to add new markers once the map is initialized
- Add markers with AJAX
- Add custom color palette to the map
- Have several maps in the same page
- Create maps on-the-fly
- Automatically convert coordinates in DMS (29°00′40″N) to Dec


