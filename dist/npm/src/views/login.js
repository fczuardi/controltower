'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

var _login = require('../components/login');

var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classes = {
    subtitle: 'lead',
    button: 'btn btn-primary'
};

exports.default = (state, prev, send) => _html2.default`
<div class="login">
    <div class="login_wrapper">
        <div class="login_form">
            <section class="login_content">
                ${ (0, _login2.default)(_ptBr2.default.login, classes, send) }
            </section>
        </div>
    </div>
</div>`;

module.exports = exports['default'];