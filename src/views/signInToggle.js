import messages from '../../locales/ptBr';
import html from 'choo/html';
const fbLoginButton = (isLogged, send) => html`
<button
    onclick=${() => send('user:signInToggle')}
>
    ${isLogged ? messages.user.signOut : messages.user.signIn}
</button>`;
export default fbLoginButton;
