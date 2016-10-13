import html from 'choo/html';
import messages from '../../locales/ptBr';

export default (state, prev, send) => {
    const onChange = e => {
        send('api:getBot', { botId: e.target.value });
        send('ui:selectBot', e.target.value);
    };
    const selectBox = state.customer.bots.length > 1
        ? html`
        <div>
            <h2>${messages.home.description}</h2>
            <select onchange=${onChange}>
                <option>
                    Selecione
                </option>
                ${state.customer.bots.map(botId => html`
                    <option selected=${state.ui.selectedBot === botId}>
                        ${botId}
                    </option>
                `)}
            </select>
        </div>`
        : null;
    return html`
<div>
    <h1>${messages.home.title}</h1>
    ${selectBox}
</div>
`;
};
