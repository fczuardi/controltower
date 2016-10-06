import html from 'choo/html';

export default state => html`
<div>
    <h1>Controltower API</h1>
<code><pre>${JSON.stringify(state.api, ' ', 2)}</pre></code>
    <h1>Sage API</h1>
<code><pre>${JSON.stringify(state.sage, ' ', 2)}</pre></code>
    <h1>Customer</h1>
<code><pre>${JSON.stringify(state.customer, ' ', 2)}</pre></code>
    <h1>Bot</h1>
<code><pre>${JSON.stringify(state.bot, ' ', 2)}</pre></code>
    <h1>Users</h1>
<code><pre>${JSON.stringify(state.users, ' ', 2)}</pre></code>
    <h1>Replies</h1>
<code><pre>${JSON.stringify(state.replies, ' ', 2)}</pre></code>
</div>
`;
