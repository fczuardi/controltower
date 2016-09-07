import html from 'choo/html';
import signInToggle from './signInToggle';

export default (labels, customerState, appState, send) => html`
<div>
    ${signInToggle(customerState.isLogged, send)}
    ${labels.appName(appState.version)}
    <a href="${appState.homepage}">${labels.viewSource}</a>
</div>`;
