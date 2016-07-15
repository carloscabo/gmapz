# GMapz v2.08

GMapz is yet another Google Maps JS library. It eases the creation of Google Maps, it's **responsive**, supports the creation of **multiple instances in the same page** (each one with its own settings), the creation of **custom styled infowindows**, and other useful helpers.
<br><br>
You can view the full documentation (WIP) and working samples at:<br>
**[http://carloscabo.github.io/gmapz](http://carloscabo.github.io/gmapz)**
<br><br>
There is Rails Gem version available ( thx! [@dreamingechoes](https://github.com/dreamingechoes) ):
**[https://rubygems.org/gems/gmapz_rails](https://rubygems.org/gems/gmapz_rails)**

# Installation

## 1a. Use as Rails gem

Simply include in your `gemfile`:
```
gem 'gmapz'
```

and run `bundle install`

Then add in your `application.js`
```
//= require gmapz
//= require gmapz.map
//= require gmapz.autocomplete
```

## 1b. Use _standalone_

If you want to add it to your project by hand, copy `src/js/gmapz/gmapz.js`, `src/js/gmapz/gmapz.map.js` and `src/js/gmapz/gmapz.autocomplete.js` (only if you need to add an autocomple input) in your project and be sure that its included in the pages **after JQuery**.

It's recommended that you give a look at: <http://carloscabo.github.io/gmapz/> for a more in deep explanation of the `pins`, and the `locations`. In this repository you have two sample files for both of them: `src/js/gmapz/gmapz.pins.js` and `src/js/gmapz/gmapz.locations.js`.

## 2. Include CSS

For the responsive features take a look to `src/css/gmapz-responsive.css` that is used in conjuction with [MQBE](https://github.com/carloscabo/MQBE).

If you want to customize the map **infobox windows** you can use `src/css/gmapz-sample-infobox.scss` as base for your own styles.

# TO-DO

1. Add sample with default Google Maps pins
2. Add static maps support

# Projects using GMapz

- http://latitude.to

# Changelog

- 2.08 (2016/07/06)
  * Fixed small bug when adding APIKey
- 2.07 (2016/05/31)
  * Added Google Maps JS APIKEY support
  * Set map language based on <html lang="XX">
  * Improved scroll lock / unlock behavior
  * Updated Lock / unlock control styles
  * Added sample with map initially blocked
  * Fixed prettify.js CDN url in demos
  * Several documentation improvements
- 2.06
  * Small fix on deleteAllMarkers(); method
  * Fix maps initialization with 'bounds' parameter
- 2.05
  * Now maps are initialized immediately if Google Maps API is ready
  * Changed infowindows parameters object
  * Added offsetPosition to the standard infowindow
  * Added custom class inside map to style infowindows
  * New sample of standard infowindows on the side of the markers
  * GMapz inside lightbox sample

- 2.02
  * Removed deprecated sensor param in Google Maps API initialization
  * Fixed bug when using "Nearest location", more than once

- 2.01
  + Fixed small bug with on 'idle' event
  + Now SingleMarkerZoom event applies once
  + Added setSingleMarkerZoom method
  + Changed names of the samples
