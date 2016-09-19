import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import browserifyPlugin from 'rollup-plugin-browserify-transform';
import sheetify from 'sheetify/transform';

const filesWithSheetify = [
    'src/views/main.js',
    'src/views/login.js',
    'src/views/dashboard.js'
];

export default {
    // to make the 3rd party libs import be converted to CommonJS format (require...)
    format: 'cjs',
    // 3rd party libs to skip
    external: [
        'choo',
        'choo/html',
        'choo/http',
        'ramda',
        'insert-css',
        'querystring'
    ],
    plugins: [
        // to be able to import json files such as package.json
        json(),
        // css-in-js powered by sheetify
        browserifyPlugin(sheetify, { include: filesWithSheetify }),
        // babel config is different for the browser bundle,
        // rollup dont need transform-es2015-modules-commonjs
        // and we use babel-plugin-external-helpers to whitelist
        // individual babel helpers into a separated file
        babel({
            babelrc: false,
            compact: false,
            plugins: [
                'external-helpers',
                'transform-object-rest-spread'
            ]
        })
    ]
};
