import html from 'choo/html';

import messages from '../../locales/ptBr';
import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    <h1>${messages.dashboard.title}</h1>
    <form
        onsubmit=${e => {
            e.preventDefault();
            const botId = document.forms[0][0].value;
            send('bots:select', { id: botId });
            send('bots:load', { id: botId });
        }}
    >
        <label>
            ${messages.dashboard.botUrl}
            <input type="text" name="setupId"/>
        </label>
        <input
            type="submit"
            value=${messages.dashboard.load}
        />
    </form>
    ${toolbar(state.customer, state.app, send)}
    <hr>
    <p>${JSON.stringify(state.user)}</p>
</div>`;
