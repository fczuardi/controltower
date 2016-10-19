'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (isLogged, send) => _html2.default`
<button
    onclick=${ () => send('fbsession:signInToggle', { isLogged }) }
>
    ${ isLogged ? _ptBr2.default.signInToggle.signOut : _ptBr2.default.signInToggle.signIn }
</button>`;

module.exports = exports['default'];