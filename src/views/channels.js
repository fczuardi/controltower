const pageListFormComponent = require('../components/pageListForm');
const botSetupPage = require('./botSetup');
const messages = require('../../locales/ptBr');

const createSubmit = (botId, pages, send) => e => {
    e.preventDefault();
    const newPage = pages[e.target.select.selectedIndex];
    send('api:updateBot', { botId, facebookPage: newPage });
    return send('bot:setFacebookPage', newPage);
};

module.exports = (state, send) => {
    const pages = state.ui.facebookPages;
    const currentPage = state.bot.facebook;
    const isUpdating = state.api.updatingBot;
    const onSubmit = createSubmit(state.bot.id, pages, send);
    const form = pageListFormComponent(
        pages,
        currentPage,
        isUpdating,
        botSetupPage.formClasses,
        messages.channels.facebook,
        onSubmit
    );
    return botSetupPage.view(form, {
        title: messages.channels.title,
        subtitle: messages.channels.facebook.title,
        description: messages.channels.facebook.description.trackOrder
    });
};
