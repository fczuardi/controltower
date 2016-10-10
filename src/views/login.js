import html from 'choo/html';
import messages from '../../locales/ptBr';
import loginComponent from '../components/login';

const classes = {
    subtitle: 'lead',
    button: 'btn btn-primary'
};
export default (state, prev, send) => html`
<div class="login">
    <div class="login_wrapper">
        <div class="login_form">
            <section class="login_content">
                ${loginComponent(messages.login, classes, send)}
            </section>
        </div>
    </div>
</div>`;
