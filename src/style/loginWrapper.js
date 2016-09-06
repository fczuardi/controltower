const html = require('choo/html');
const sf = require('sheetify');
const loginCss = sf`
.login {
    position: absolute;
    width: 100%;
    height: 100%;
}
`;
const buttonClassname = 'btn btn-primary';
module.exports = loginView => (state, prev, send) => html`
<div class=${loginCss}>
    <div class="login">
        <div class="login_wrapper">
            <div class="login_form">
                <section class="login_content">
                    ${loginView(send, buttonClassname)}
            </section>
        </div>
    </div>
</div>`;
