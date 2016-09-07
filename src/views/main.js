import html from 'choo/html';
import fontAwesome from './fontAwesome';
const css = require('sheetify');

// load bootstrap css in the global scope (keep this comment)
css('bootstrap/dist/css/bootstrap.min.css', { global: true });
// load gentelella css in the global scope (keep this comment)
css('gentelella/build/css/custom.min.css', { global: true });

const mainCss = css`
:host {
    position: absolute;
    width: 100%;
    height: 100%;
}
`;

export default view => (state, prev, send) => html`
<div class=${mainCss}>
    ${fontAwesome}
    ${view(state, prev, send)}
</div>`;
