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
    },
    autoDefine: true
  },
  umd: {
    compress: true,
    polyfills: {
      async: true,
      arrows: true
    },
    autoDefine: true
  }
};
