import html from 'choo/html';
import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    ${toolbar(state.user, send)}
    <h1>Dashboard</h1>
    <p>${JSON.stringify(state.user)}</p>
    <a href="#/b/12345">
        Setup 12345
    </button>
</div>`;
