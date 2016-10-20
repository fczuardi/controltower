'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _signInToggle = require('./signInToggle');

var _signInToggle2 = _interopRequireDefault(_signInToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (labels, customerState, appState, send) => _html2.default`
<div>
    ${ (0, _signInToggle2.default)(customerState.isLogged, send) }
    ${ labels.appName(appState.version) }
    <a href="${ appState.homepage }">${ labels.viewSource }</a>
</div>`;

module.exports = exports['default'];