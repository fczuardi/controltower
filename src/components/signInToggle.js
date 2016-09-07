import html from 'choo/html';
import messages from '../../locales/ptBr';

export default (isLogged, send) => html`
<button
    onclick=${() => send('fbsession:signInToggle', { isLogged })}
>
    ${isLogged
        ? messages.signInToggle.signOut
        : messages.signInToggle.signIn
    }
</button>`;
