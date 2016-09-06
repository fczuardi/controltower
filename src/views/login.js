import html from 'choo/html';
import messages from '../../locales/ptBr';
const click = (send, action) => e => {
    e.preventDefault();
    send(action);
};
export default (send, buttonClassname) => html`
<form>
    <h1>${messages.login.title}</h1>
    <h2>${messages.login.subtitle}</h2>
    <button
        class=${buttonClassname}
        onclick=${click(send, 'fbsession:signIn')}}
    >
        ${messages.login.fbSignInButton}
    </button>
</form>
`;
