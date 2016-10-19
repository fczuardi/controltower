'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (state, prev, send) => {
    const onChange = e => {
        send('api:getBot', { botId: e.target.value });
        send('ui:selectBot', e.target.value);
    };
    const selectBox = state.customer.bots.length > 1 ? _html2.default`
        <div>
            <h2>${ _ptBr2.default.home.description }</h2>
            <select onchange=${ onChange }>
                <option>
                    Selecione
                </option>
                ${ state.customer.bots.map(botId => _html2.default`
                    <option selected=${ state.ui.selectedBot === botId }>
                        ${ botId }
                    </option>
                `) }
            </select>
        </div>` : null;
    return _html2.default`
<div>
    <h1>${ _ptBr2.default.home.title }</h1>
    ${ selectBox }
</div>
`;
};

module.exports = exports['default'];