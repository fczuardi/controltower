import html from 'choo/html';
const click = (send, action) => e => {
    e.preventDefault();
    send(action);
};
export default (send, buttonClassname) => html`
<form>
    <h1>Please Sign In</h1>
    <h2>You need to be logged to access your control tower.</h2>
    <button
        class=${buttonClassname}
        onclick=${click(send, 'fbsession:signIn')}}
    >
        Sig In with Facebook
    </button>
</form>
`;
