import html from 'choo/html';
import fbSDK from './fbSDK';
import signInToggle from './signInToggle';

export default (userState, appState, send) => html`
<div
    style="border-top: 1px solid black;margin-top: 1rem;padding-top: 1rem;"
>
    ${fbSDK}
    ${signInToggle(userState.isLogged, send)}
    <small>
        • Control Tower v${appState.version} •
        <a href="${appState.homepage}">view source</a>
    </small>
</div>`;
