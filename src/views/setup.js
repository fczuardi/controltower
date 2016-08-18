import messages from '../../locales/ptBr';
import html from 'choo/html';
import toolbar from './toolbar';

const botSetupLabels = {
    facebook: {
        legend: 'Facebook Page',
        pageId: 'Facebook Page ID',
        pageToken: 'Facebook Page Token',
        appSecret: 'Facebook App Secret'
    },
    vtex: {
        legend: 'VTEX Store',
        apiToken: 'VTEX API Token',
        apiKey: 'VTEX API Key',
        apiAccountName: 'VTEX API Account Name',
        apiEnvironment: 'VTEX API Environment',
        appKey: 'VTEX App Key',
        appToken: 'VTEX App Token'
    }
};
export default (state, prev, send) => html`
<div>
    <h1>${messages.setup.title}</h1>
    <form
        action="saveConfig"
        method="POST"
        onsubmit=${e => {
            e.preventDefault();
            console.log('Form submitted', e.target);
        }}
    >
        ${Object.keys(botSetupLabels).map(group => html`
            <fieldset>
                <legend>${botSetupLabels[group].legend}</legend>
                ${Object.keys(botSetupLabels[group]).map(label => (
                    label !== 'legend' ? html`
                    <label>
                        ${botSetupLabels[group][label]}
                        <input type="text" name="${label}" />
                    </label>
                ` : null))}
            </fieldset>
            `
        )}
        <input
            type="submit"
            value=${messages.setup.update}
        />
    </form>
    ${toolbar(state.user, state.app, send)}
    <a href="#">back to dashboard</a>
    <hr>
    <p>${JSON.stringify(state.setup)}</p>
</div>`;
