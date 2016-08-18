import html from 'choo/html';
import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    <h1>Dashboard</h1>
    <p>${JSON.stringify(state.user)}</p>
    <ul>
        <li>
            <a href="#/b/12345">
                Setup 12345
            </a>
        </li>
    </ul>
    ${toolbar(state.user, send)}
</div>`;
