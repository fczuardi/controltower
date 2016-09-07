const html = require('choo/html');
const messages = require('../../locales/ptBr');
const loginComponent = require('../components/login');
const css = require('sheetify');
const loginCss = css`
.login {
    position: absolute;
    width: 100%;
    height: 100%;
}
`;
const classes = {
    subtitle: 'lead',
    button: 'btn btn-primary'
};
module.exports = (state, prev, send) => html`
<div class=${loginCss}>
    <div class="login">
        <div class="login_wrapper">
            <div class="login_form">
                <section class="login_content">
                    ${loginComponent(messages.login, classes, send)}
                </section>
            </div>
        </div>
    </div>
</div>`;
