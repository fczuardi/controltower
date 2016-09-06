const html = require('choo/html');
const bootstrap = require('./bootstrap');
const fontAwesome = require('./fontAwesome');
const mainCss = require('./main.css');
module.exports = view => (state, prev, send) => html`
<div class=${mainCss}>
    ${view(state, prev, send)}
    ${bootstrap}
    ${fontAwesome}
</div>`;
