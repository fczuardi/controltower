import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    // to make the 3rd party libs import be converted to CommonJS format (require...)
    format: 'cjs',
    // 3rd party libs to skip
    external: [
        'choo',
        'choo/html',
        'ramda'
    ],
    plugins: [
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
