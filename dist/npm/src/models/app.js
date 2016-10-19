'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _package = require('../../package.json');

const appModel = {
    namespace: 'app',
    state: {
        version: _package.version,
        homepage: _package.homepage
    }
};
exports.default = appModel;
module.exports = exports['default'];