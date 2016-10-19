'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

var _botSetup = require('../views/botSetup');

var _mutedBotListForm = require('../components/mutedBotListForm');

var _mutedBotListForm2 = _interopRequireDefault(_mutedBotListForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const toolbarRight = (isLoading, onRefreshClick) => _html2.default`
<div class="toolbarRefreshButton">
    <button
        class="btn btn-primary"
        ${ isLoading ? 'disabled' : '' }
        onclick=${ onRefreshClick }
    >
        <i class="fa fa-repeat"></i>
    </button>
</div>
`;

const preventDefaultWrap = cb => e => {
    e.preventDefault();return cb();
};

exports.default = (state, prev, send) => {
    const headers = ['Name'];
    const selectedRows = state.ui.selectedMutedUsers;
    const dataSet = state.users.filteredByMutedBot.map(user => [user.name]);
    const isEmpty = !dataSet.length;
    const description = isEmpty ? _ptBr2.default.mutedChats.list.description.withoutChats : _ptBr2.default.mutedChats.list.description.withChats;
    const onRowSelected = rowIndex => send('ui:selectMutedUser', rowIndex);
    const onRowDeselected = rowIndex => send('ui:deselectMutedUser', rowIndex);
    const onRefreshClick = preventDefaultWrap(() => send('api:getMutedChats', state.bot));
    const onSubmit = preventDefaultWrap(() => {
        send('api:unMuteChats', {
            ids: state.users.filteredByMutedBot.filter((item, index) => selectedRows.includes(index)).map(item => item.id),
            botId: state.bot.id
        });
    });

    const navbarRightContent = toolbarRight(state.api.loadingUsers, onRefreshClick);
    const content = isEmpty ? null : (0, _mutedBotListForm2.default)(headers, dataSet, selectedRows, state.api.loadingUsers, _botSetup.formClasses, _ptBr2.default.mutedChats.list, onRowSelected, onRowDeselected, onSubmit);
    const panels = [(0, _botSetup.panel)(content, _ptBr2.default.mutedChats.list.title, description, navbarRightContent)];
    return (0, _botSetup.view)(_ptBr2.default.mutedChats.title, panels);
};

module.exports = exports['default'];