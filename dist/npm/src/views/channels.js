'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pageListForm = require('../components/pageListForm');

var _pageListForm2 = _interopRequireDefault(_pageListForm);

var _botSetup = require('./botSetup');

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSubmit = (bot, pages, send) => e => {
    e.preventDefault();
    const newPage = pages[e.target.select.selectedIndex - 1];
    send('api:updateBot', {
        botId: bot.id,
        ownerId: bot.customerId,
        facebookPage: newPage
    });
    return send('bot:setFacebookPage', newPage);
};

exports.default = (state, prev, send) => {
    const pages = state.ui.facebookPages;
    const currentPage = state.bot.facebook;
    const isUpdating = state.api.updatingBot;
    const onSubmit = createSubmit(state.bot, pages, send);
    const form = (0, _pageListForm2.default)(pages, currentPage, isUpdating, _botSetup.formClasses, _ptBr2.default.channels.facebook, onSubmit);
    const panels = [(0, _botSetup.panel)(form, _ptBr2.default.channels.facebook.title, _ptBr2.default.channels.facebook.description.trackOrder)];
    return (0, _botSetup.view)(_ptBr2.default.channels.title, panels);
};

module.exports = exports['default'];