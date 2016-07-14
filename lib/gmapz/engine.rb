module GMapz
  module Rails
    class Engine < ::Rails::Engine
      initializer 'gmapz' do | app |
        gmapz_path = File.expand_path("../../../src/js/gmapz", __FILE__)
        app.config.assets.paths << gmapz_path
        gmapz_dependencies_path = File.expand_path("../../../src/js/gmapz-dependencies", __FILE__)
        app.config.assets.paths << gmapz_dependencies_path
        app.middleware.use ::ActionDispatch::Static, "#{root}/dist"
      end
    end
  end
end
