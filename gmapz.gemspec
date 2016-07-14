# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'gmapz/version'

Gem::Specification.new do |spec|
  spec.name          = "gmapz"
  spec.version       = GMapz::VERSION
  spec.authors       = ["carloscabo"]
  spec.email         = ["carlos.cabo@gmail.com"]
  spec.summary       = "GMapz is yet another Google Maps JS library."
  spec.description   = "It eases the creation of Google Maps, it's responsive, supports the creation of multiple instances in the same page (each one with its own settings), the creation of custom styled infowindows, and other useful helpers."
  spec.homepage      = "https://github.com/carloscabo/gmapz"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.0"
end
