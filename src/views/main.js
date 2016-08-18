import html from 'choo/html';
import fbSDK from './fbSDK';
import signInToggle from './signInToggle';

const main = (state, prev, send) => html`
<div>
    ${fbSDK}
    ${signInToggle(state.user.isLogged, send)}
    ${state.user.id ? JSON.stringify(state.user) : ''}
</div>`;
export default main;
