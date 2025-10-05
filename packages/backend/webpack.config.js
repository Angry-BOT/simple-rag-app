module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [
      // Externalize native Node modules
      '@xenova/transformers',
      'onnxruntime-node',
      'sharp',
      'chromadb',
    ],
  };
};
