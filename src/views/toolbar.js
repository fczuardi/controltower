import html from 'choo/html';
import fbSDK from './fbSDK';
import signInToggle from './signInToggle';

export default (userState, send) => html`
<div>
    ${fbSDK}
    ${signInToggle(userState.isLogged, send)}
</div>`;
