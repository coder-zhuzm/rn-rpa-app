module.exports = {
  dependencies: {
    'react-native-http-bridge': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-http-bridge/android/',
          packageImportPath: 'import me.alwx.HttpServer.HttpServerReactPackage;',
        },
      },
    },
  },
};
