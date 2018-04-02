module.exports = exports = {
  cjs: {
    polyfills: {
      arrows: true,
      async: true
    }
  },
  es6: {
    polyfills: {
      async: true
    }
  },
  es7: {
    polyfills: {
      // None
    }
  },
  iife: {
    compress: true,
    polyfills: {
      arrows: true,
      assign: true,
      async: true,
      promise: true
    }
  },
  umd: {
    compress: true,
    polyfills: {
      arrows: true
    }
  }
};
