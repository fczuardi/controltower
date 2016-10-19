'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const click = (send, key) => e => {
    e.preventDefault();
    const pathname = `/${ key }`;
    send('ui:selectSection', key);
    send('location:set', { pathname });
};

exports.default = (uiState, classes, send) => _html2.default`
<ul class=${ classes.list }>
${ uiState.menu.map(key => !uiState.enabledSections.includes(key) ? null : _html2.default`
    <li class=${ key === uiState.selectedSection ? classes.active : '' }>
        <a onclick=${ click(send, key) }">
            <i class=${ classes.icons[key] }></i>
            ${ _ptBr2.default.sidebar[key] }
        </a>
    </li>
`) }
</ul>`;

module.exports = exports['default'];