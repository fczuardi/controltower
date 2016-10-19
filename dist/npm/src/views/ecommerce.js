'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vtexForm = require('../components/vtexForm');

var _vtexForm2 = _interopRequireDefault(_vtexForm);

var _botSetup = require('../views/botSetup');

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSubmit = (bot, send) => e => {
    e.preventDefault();
    const fieldNames = ['apiToken', 'apiKey', 'apiAccountName', 'apiEnvironment'];
    const update = fieldNames.reduce((prev, name) => Object.assign(prev, {
        [name]: e.target[name].value
    }), {});
    send('api:updateBot', {
        botId: bot.id,
        ownerId: bot.customerId,
        vtex: update
    });
    return send('bot:setVtexStore', update);
};

exports.default = (state, prev, send) => {
    const isUpdating = state.api.updatingBot;
    const values = state.bot.vtex;
    const onSubmit = createSubmit(state.bot, send);
    const form = (0, _vtexForm2.default)(isUpdating, values, _botSetup.formClasses, _ptBr2.default.ecommerce.vtex, onSubmit);
    const panels = [(0, _botSetup.panel)(form, _ptBr2.default.ecommerce.vtex.title, _ptBr2.default.ecommerce.vtex.description.trackOrder)];
    return (0, _botSetup.view)(_ptBr2.default.ecommerce.title, panels);
};

module.exports = exports['default'];