import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import browserifyPlugin from 'rollup-plugin-browserify-transform';
import sheetify from 'sheetify/transform';

export default {
    // to make the 3rd party libs import be converted to CommonJS format (require...)
    format: 'cjs',
    // 3rd party libs to skip
    external: [
        'choo',
        'choo/html',
        'ramda',
        'insert-css'
    ],
    plugins: [
        // css-in-js powered by sheetify
        browserifyPlugin(sheetify, {
            include: 'src/style/*.js'
        }),
        // to be able to import json files such as package.json
        json(),
        // to be able to use module.exports in our config files
        commonjs(),
        // babel config is different for the browser bundle,
        // rollup dont need transform-es2015-modules-commonjs
        // and we use babel-plugin-external-helpers to whitelist
        // individual babel helpers in a separated file
        babel({
            babelrc: false,
            plugins: [
                'external-helpers',
                'transform-object-rest-spread'
            ]
        })
    ]
};
