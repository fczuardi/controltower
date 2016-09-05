import html from 'choo/html';

import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    <h1>Welcome</h1>
    ${state.customer.id ? JSON.stringify(state.customer) : ''}
    ${toolbar(state.customer, state.app, send)}
</div>`;
