const messages = require('../../locales/ptBr');
const botSetupPage = require('./botSetup');
const mutedBotListFormComponent = require('../components/mutedBotListForm');

module.exports = (state, send) => {
    const headers = ['Name'];
    const selectedRows = state.ui.selectedMutedUsers;
    const dataSet = state.users.filteredByMutedBot.map(user => ([
        user.name
    ]));
    const classes = botSetupPage.formClasses;
    const onRowSelected = rowIndex => send('ui:selectMutedUser', rowIndex);
    const onRowDeselected = rowIndex => send('ui:deselectMutedUser', rowIndex);
    const onSubmit = e => {
        e.preventDefault();
        console.log('make unmute API call');
    };

    const content = mutedBotListFormComponent(
        headers,
        dataSet,
        selectedRows,
        state.api.updatingBot,
        classes,
        messages.mutedChats.list,
        onRowSelected,
        onRowDeselected,
        onSubmit
    );
    return botSetupPage.view(content, {
        title: messages.mutedChats.title,
        subtitle: messages.mutedChats.list.title,
        description: messages.channels.facebook.description.trackOrder
    });
};
