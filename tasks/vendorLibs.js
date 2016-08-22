const buildExternalHelpers = require('babel-core').buildExternalHelpers;
const browserify = require('browserify');
const fs = require('fs');
const { writeFileSync, createWriteStream } = fs;

const webDistroPath = 'docs/';
const libsPath = `${webDistroPath}js/`;

// list of babel helpers to include
const babelHelpers = [
    'extends'
];
writeFileSync(
    `${libsPath}babel_external-helpers.js`,
    buildExternalHelpers(babelHelpers)
);
console.log(`buildExternalHelpers > ${libsPath}babel_external-helpers.js`);

// list of 3rd party libraries to browserify
const externalLibs = [
    'choo',
    'choo/html'
];
externalLibs.forEach(libName => {
    const outFilename = `${libsPath}${libName.replace('/', '-')}.js`;
    const b = browserify({ require: libName });
    console.log(`${libName} > ${outFilename}`);
    b.bundle().pipe(createWriteStream(outFilename, 'utf8'));
});
