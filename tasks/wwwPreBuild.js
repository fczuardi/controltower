const shelljs = require('shelljs');
const { mkdir, cp, sed } = shelljs;
const pkg = require('../package.json');
const { version } = pkg;

const webDistroPath = 'docs/';
const libsPath = `${webDistroPath}js/`;

mkdir('-p', libsPath);
cp('src/index_prod.html', `${webDistroPath}index.html`);
sed('-i', '.js"', `.js?cachebuster=${version}"`, `${webDistroPath}index.html`);
