import html from 'choo/html';
import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    ${toolbar(state.user, send)}
    <h1>Setup</h1>
    <p>${JSON.stringify(state.params)}</p>
    <a href="#">
        Dashboard
    </a>
</div>`;
