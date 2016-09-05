const html = require('choo/html');
const sf = require('sheetify');
sf('normalize.css');

const mainCss = sf`
h1 {
    color: red
}
`;

module.exports = view => (state, prev, send) => html`
<div class=${mainCss}>
    ${view(state, prev, send)}
</div>`;
