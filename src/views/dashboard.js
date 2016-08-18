import messages from '../../locales/ptBr';
import html from 'choo/html';
import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    <h1>${messages.dashboard.title}</h1>
    <form
        method="POST"
        action="#/setup"
        onsubmit=${e => {
            e.preventDefault();
            const setupId = document.forms[0][0].value;
            send('setup:setId', { id: setupId });
            send('setup:fetch', { setupId });
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
    ${toolbar(state.user, state.app, send)}
    <hr>
    <p>${JSON.stringify(state.user)}</p>
</div>`;
