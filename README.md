GMapz v2.15
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
- 2.15
  * Now maps are initialized inmediatly if Google Maps API is ready
  * Changed inforwindows parameters object
  * Added offsetPosition to the infowindow
  * Added custom class inside map to style side infowindows
  * New sample of infowindows on the side of the MarkerImage

- 2.02
  * Removed deprecated sensor param in Google Maps API initialization
  * Fixed bug when using "Nearest location", more than once

- 2.01
  + Fixed small bug with on 'idle' event
  + Now SingleMarkerZoom event applies once
  + Added setSingleMarkerZoom method
  + Changed names of the samples
