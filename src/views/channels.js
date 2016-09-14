const html = require('choo/html');

module.exports = state => html`
<div>
    <h1>Channels</h1>
<code><pre>${JSON.stringify(state, ' ', 2)}</pre></code>
</div>
`;
