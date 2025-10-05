module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [
      function ({ context, request }, callback) {
        // Externalize all node_modules
        if (/^[a-z@][a-z0-9.\-_/]*$/i.test(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      },
    ],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    resolve: {
      ...options.resolve,
      extensions: ['.ts', '.js', '.json'],
    },
    node: {
      __dirname: false,
      __filename: false,
    },
  };
};
