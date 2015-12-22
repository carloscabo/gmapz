GMapz v2.05
===========

GMapz is yet another Google Maps JS library. It eases the creation of Google Maps, it's **responsive**, supports the creation of **multiple instances in the same page** (each one with it's own settings), the creation of **custom styled infowindows**, and other useful helpers.
<br><br>
You can view the full documentation (WIP) and working samples at:<br>
**[http://carloscabo.github.io/gmapz](http://carloscabo.github.io/gmapz)**
<br><br>
There is Rails Gem version available ( thx! [@dreamingechoes](https://github.com/dreamingechoes) ):
**[https://rubygems.org/gems/gmapz_rails](https://rubygems.org/gems/gmapz_rails)**

TO-DO
=====
1. Add sample with default Google Maps pins
2. Add static maps support

Changelog
=========
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
