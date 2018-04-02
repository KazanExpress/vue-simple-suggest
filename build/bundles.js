module.exports = exports = {
  cjs: {
    polyfills: {
      arrows: true,
      assign: true,
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

    }
  },
  iife: {
    // compress: true,
    polyfills: {
      arrows: true,
      assign: true,
      async: true,
      promise: true
    }
  },
  umd: {
    // compress: true,
    polyfills: {}
  }
};
