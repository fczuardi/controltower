const html = require('choo/html');
const fontAwesome = require('./fontAwesome');
const mainCss = require('./main.css');
module.exports = view => (state, prev, send) => html`
<div class=${mainCss}>
    ${fontAwesome}
    <div class="nav-md">
        <div class="container body">
            <div class="main_container">
                ${view(state, prev, send)}
            </div>
        </div>
    </div>
</div>`;
