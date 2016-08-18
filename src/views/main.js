import html from 'choo/html';
import fbSDK from './fbSDK';
import signInToggle from './signInToggle';

const main = (state, prev, send) => html`
<div>
    ${fbSDK}
    ${signInToggle(state.isLogged, send)}
</div>`;
export default main;
