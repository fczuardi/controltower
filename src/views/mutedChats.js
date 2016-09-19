import html from 'choo/html';
import messages from '../../locales/ptBr';
import { formClasses, view } from '../views/botSetup';
import mutedBotListFormComponent from '../components/mutedBotListForm';

const toolbarRight = (isLoading, onRefreshClick) => html`
<div class="toolbarRefreshButton">
    <button
        class="btn btn-primary"
        ${isLoading ? 'disabled' : ''}
        onclick=${onRefreshClick}
    >
        <i class="fa fa-repeat"></i>
    </button>
</div>
`;

const preventDefaultWrap = cb => e => { e.preventDefault(); return cb(); };

export default (state, send) => {
    const headers = ['Name'];
    const selectedRows = state.ui.selectedMutedUsers;
    const dataSet = state.users.filteredByMutedBot.map(user => ([user.name]));
    const isEmpty = !dataSet.length;
    const description = isEmpty
        ? messages.mutedChats.list.description.withoutChats
        : messages.mutedChats.list.description.withChats;
    const onRowSelected = rowIndex => send('ui:selectMutedUser', rowIndex);
    const onRowDeselected = rowIndex => send('ui:deselectMutedUser', rowIndex);
    const onRefreshClick = preventDefaultWrap(() =>
        send('api:getMutedChats', state.bot)
    );
    const onSubmit = preventDefaultWrap(() => {
        send('api:unMuteChats', {
            ids: state.users.filteredByMutedBot.filter(
                (item, index) => selectedRows.includes(index)
            ).map(
                item => item.id
            ),
            botId: state.bot.id
        });
    });

    const navbarRightContent = toolbarRight(state.api.loadingUsers, onRefreshClick);
    const content = isEmpty ? null : mutedBotListFormComponent(
        headers,
        dataSet,
        selectedRows,
        state.api.loadingUsers,
        formClasses,
        messages.mutedChats.list,
        onRowSelected,
        onRowDeselected,
        onSubmit
    );
    return view(content, {
        title: messages.mutedChats.title,
        subtitle: messages.mutedChats.list.title,
        description
    }, navbarRightContent);
};
