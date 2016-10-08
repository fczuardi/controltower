import html from 'choo/html';
import messages from '../../locales/ptBr';

export default (state, prev, send) => {
    const onSubmit = e => {
        e.preventDefault();
        send('invite:accept', e.target.inviteCode.value);
    };
    const ignoreClick = () => {
        send('invite:ignore');
    };
    return html`
<div>
    <h1>${messages.invite.title}</h1>
    <h2>${messages.invite.subtitle(state.invite.botId)}</h2>
    <h3>${messages.invite.description}</h3>
    <form onsubmit=${onSubmit}>
        <input name="inviteCode"/>
        <input
            type="submit"
            value=${messages.invite.submitButton}
        />
        <input
            type="button"
            value=${messages.invite.ignoreButton}
            onclick=${ignoreClick}
        />
    </form>
</div>`;
};
