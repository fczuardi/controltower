const shelljs = require('shelljs');
const { mkdir, cp } = shelljs;

mkdir('-p', 'dist/www/js');
cp('src/index.html', 'dist/www/.');
