const vue = require('rollup-plugin-vue2');
const css = require('rollup-plugin-css-only');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const regenerator = require('rollup-plugin-regenerator');

module.exports = exports = function(
  compress = false,
  polyfills = {
    assign: true,
    async: true,
    promise: true
  }
) {
  const babelPlugins = [];

  if (polyfills.assign) {
    babelPlugins.push('transform-object-assign')
  }

  if (polyfills.async) {
    babelPlugins.push('transform-async-to-generator', 'transform-regenerator')
  }

  if (polyfills.promise) {
    babelPlugins.push('es6-promise')
  }

  const plugins = [
    vue(),
    css({ output: 'dist/styles.css' }),
    babel({
      // runtimeHelpers: true,
      presets: polyfills.arrows ? ['stage-3', 'es2015-rollup'] : [],
      plugins: babelPlugins
    }),
    nodeResolve({ browser: true, jsnext: true, main: true }),
    commonjs()
  ];

  if (compress) {
    plugins.push(uglify());
  }

  if (polyfills.async) {
    plugins.push(regenerator({ includeRuntime: true }))
  }

  return {
    input: 'lib/index.js',
    plugins
  };
}
