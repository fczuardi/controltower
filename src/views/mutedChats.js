const html = require('choo/html');
const messages = require('../../locales/ptBr');

module.exports = () => html`
<div>
    <h1>
        ${messages.mutedChats.title}
    </h1>
</div>
`;
