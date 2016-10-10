import html from 'choo/html';
import messages from '../../locales/ptBr';

export default (state, prev, send) => {
    const onSubmit = e => {
        e.preventDefault();
        send('api:acceptInvite', {
            inviteCode: e.target.inviteCode.value,
            ownerId: state.invite.ownerId,
            botId: state.invite.botId
        });
    };
    const ignoreClick = () => {
        send('invite:ignore');
    };
    const errorOutput = !state.invite.error ? null : html`
        <div>
            <h4>Error:${state.invite.error.message}</h4>
            <p>${JSON.stringify(state.invite.error)}</p>
        </div>
    `;
    return html`
<div class="login">
    <div class="login_wrapper">
        <form class="login_form" onsubmit=${onSubmit}>
            <h1>${messages.invite.title}</h1>
            <h2>${messages.invite.subtitle(state.invite.botId)}</h2>
            <p>${messages.invite.description}</p>
            <input name="inviteCode"/>
            <input
                type="submit"
                disabled=${state.api.updatingBot}
                value=${messages.invite.submitButton}
            />
            <input
                type="button"
                value=${messages.invite.ignoreButton}
                onclick=${ignoreClick}
            />
            ${errorOutput}
        </form>
    </div>
</div>`;
};
