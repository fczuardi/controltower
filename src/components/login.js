import html from 'choo/html';

const click = (send, action) => e => {
    e.preventDefault();
    send(action);
};

export default (labels, classes, send) => html`
<form>
    <h1>${labels.title}</h1>
    <p class=${classes.subtitle}>${labels.subtitle}</p>
    <button
        class=${classes.button}
        onclick=${click(send, 'fbsession:signIn')}}
    >
        ${labels.fbSignInButton}
    </button>
</form>
`;
