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
    const onSubmit = e => {
        e.preventDefault();
        send('api:acceptInvite', {
            inviteCode: e.target.inviteCode.value,
            ownerId: state.invite.ownerId,
            botId: state.invite.botId
        });
    };
    const ignoreClick = () => {
        send('invite:ignore');
    };
    const errorOutput = !state.invite.error ? null : _html2.default`
        <div>
            <h4>Error:${ state.invite.error.message }</h4>
            <p>${ JSON.stringify(state.invite.error) }</p>
        </div>
    `;
    return _html2.default`
<div class="login">
    <div class="login_wrapper">
        <form class="login_form" onsubmit=${ onSubmit }>
            <h1>${ _ptBr2.default.invite.title }</h1>
            <h2>${ _ptBr2.default.invite.subtitle(state.invite.botId) }</h2>
            <p>${ _ptBr2.default.invite.description }</p>
            <input name="inviteCode"/>
            <input
                type="submit"
                disabled=${ state.api.updatingBot }
                value=${ _ptBr2.default.invite.submitButton }
            />
            <input
                type="button"
                value=${ _ptBr2.default.invite.ignoreButton }
                onclick=${ ignoreClick }
            />
            ${ errorOutput }
        </form>
    </div>
</div>`;
};

module.exports = exports['default'];