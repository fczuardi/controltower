import html from 'choo/html';
const fbLoginButton = (isLogged, send) => html`
<button
    onclick=${() => send('signInToggle')}
>
    ${isLogged}
</button>`;
export default fbLoginButton;
