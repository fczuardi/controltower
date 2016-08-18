import html from 'choo/html';
import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    <h1>Welcome</h1>
    ${state.user.id ? JSON.stringify(state.user) : ''}
    ${toolbar(state.user, state.app, send)}
</div>`;
