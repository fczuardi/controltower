const html = require('choo/html');

module.exports = state => html`
<div>
    <h2>${JSON.stringify(state.location)}</h2>
    <h1>Auth</h1>
<code><pre>${JSON.stringify(state.api, ' ', 2)}</pre></code>
    <h1>Customer</h1>
<code><pre>${JSON.stringify(state.customer, ' ', 2)}</pre></code>
    <h1>Bot</h1>
<code><pre>${JSON.stringify(state.bot, ' ', 2)}</pre></code>
</div>
`;
