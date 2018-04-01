const rollup = require('rollup').rollup;
const bundles = require('./bundles');
const config = require('./rollup.config');
const fs = require('fs-extra');

const roll = (format, name, conf) => {
  rollup(
    config(conf.compress, conf.polyfills)
  ).then(bundle => bundle
    .write({
      format,
      name: 'vueSimpleSuggest',
      file: 'dist/' + name + '.js'
    })
  );
}

if (fs.pathExistsSync('dist')) {
  fs.removeSync('dist')
}

for (const format in bundles) {
  roll(format.replace(/\d+/g, ''), format, bundles[format]);
}
