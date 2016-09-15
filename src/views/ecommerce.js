const vtexFormComponent = require('../components/vtexForm');
const botSetupPage = require('./botSetup');
const messages = require('../../locales/ptBr');

const createSubmit = (botId, send) => e => {
    e.preventDefault();
    const fieldNames = [
        'apiToken',
        'apiKey',
        'apiAccountName',
        'apiEnvironment',
        'appKey',
        'appToken'
    ];
    const update = fieldNames.reduce((prev, name) => ({
        ...prev,
        [name]: e.target[name].value
    }), {});
    send('api:updateBot', { botId, vtex: update });
    return send('bot:setVtexStore', update);
};

module.exports = (state, send) => {
    const isUpdating = state.api.updatingBot;
    const values = state.bot.vtex;
    const onSubmit = createSubmit(state.bot.id, send);
    const form = vtexFormComponent(
        isUpdating,
        values,
        botSetupPage.formClasses,
        messages.ecommerce.vtex,
        onSubmit
    );
    return botSetupPage.view(form, {
        title: messages.ecommerce.title,
        subtitle: messages.ecommerce.vtex.title,
        description: messages.ecommerce.vtex.description.trackOrder
    });
};
