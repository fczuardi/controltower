import html from 'choo/html';

import messages from '../../locales/ptBr';

export default (isLogged, send) => html`
<button
    onclick=${() => send('user:signInToggle')}
>
    ${isLogged
        ? messages.signInToggle.signOut
        : messages.signInToggle.signIn
    }
</button>`;
