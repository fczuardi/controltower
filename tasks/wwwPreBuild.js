const shelljs = require('shelljs');
const { mkdir, cp } = shelljs;

const webDistroPath = 'docs/';
const libsPath = `${webDistroPath}js/`;

mkdir('-p', libsPath);
cp('src/index_prod.html', `${webDistroPath}index.html`);
