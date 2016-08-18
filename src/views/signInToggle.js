import html from 'choo/html';
const fbLoginButton = (isLogged, send) => html`
<button
    onclick=${() => send('user:signInToggle')}
>
    ${isLogged}
</button>`;
export default fbLoginButton;
