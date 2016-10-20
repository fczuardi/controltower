'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _botSetup = require('../views/botSetup');

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (state, prev, send) => {
    const adminList = _html2.default`<div>
        <table class=${ _botSetup.formClasses.table }>
            <thead>
                <tr>
                    <td>${ _ptBr2.default.admins.team.name }</td>
                    <td>${ _ptBr2.default.admins.team.email }</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${ state.customer.name }</td>
                    <td>${ state.customer.email }</td>
                </tr>
            </tbody>
        </table>
    </div>`;
    const formValues = {
        url: `${ window.location.href }?bot=${ state.bot.id }&owner=${ state.bot.customerId }`,
        inviteCode: state.bot.inviteCode
    };
    const inviteFields = Object.keys(formValues).map(name => _html2.default`
        <div class=${ _botSetup.formClasses.formGroup }>
            <label class=${ _botSetup.formClasses.label }>
                ${ _ptBr2.default.admins.invite[name] }
            </label>
            <div class=${ _botSetup.formClasses.inputContainer }>
                <input
                    name=${ name }
                    value=${ formValues[name] || '' }
                    class=${ _botSetup.formClasses.input }
                    readonly
                >
            </div>
        </div>
    `);
    const onSubmit = e => {
        e.preventDefault();
        send('api:updateBot', { botId: state.bot.id, inviteCode: 'new' });
    };
    const inviteAdmin = _html2.default`
    <form class=${ _botSetup.formClasses.form } onsubmit=${ onSubmit }>
        ${ _ptBr2.default.admins.invite.instructions.map(instruction => _html2.default`
            <p>${ instruction }</p>
        `) }
        ${ inviteFields }
        <div class=${ _botSetup.formClasses.separator }></div>
        <div class=${ _botSetup.formClasses.formGroup }>
            <div class=${ _botSetup.formClasses.buttonGroup }>
                <button
                    type="submit"
                    class=${ _botSetup.formClasses.submitButton }
                    disabled=${ state.api.updatingBot }
                >${ _ptBr2.default.admins.invite.newKey }</button>
            </div>
        </div>
    </form>
    `;
    const panels = [(0, _botSetup.panel)(adminList, _ptBr2.default.admins.team.title), (0, _botSetup.panel)(inviteAdmin, _ptBr2.default.admins.invite.title)];
    return (0, _botSetup.view)(_ptBr2.default.admins.title, panels);
};

module.exports = exports['default'];