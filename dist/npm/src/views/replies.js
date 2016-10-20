'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var _botSetup = require('../views/botSetup');

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

var _replyListForm = require('../components/replyListForm');

var _replyListForm2 = _interopRequireDefault(_replyListForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createOnChange = send => e => {
    e.preventDefault();
    send('ui:selectReply', e.target.value);
    return send('location:set', { pathname: '/replies' });
};

const createOnSubmit = (selectedReplyKey, selectedReply = {}, bot, send) => e => {
    e.preventDefault();
    const fieldNames = ['title', 'text', 'subtitle', 'logo', 'url'];
    let updates = {};
    fieldNames.forEach(fieldName => {
        if (!e.target[fieldName]) {
            return null;
        }
        return Object.assign(updates, { [fieldName]: e.target[fieldName].value });
    });
    updates = Object.assign(selectedReply, updates);
    send('replies:setReply', { [selectedReplyKey]: updates });
    return send('replies:sendReplies', bot);
};

const replyClasses = {
    sampleQuestion: 'user-chat-bubble',
    title: 'reply-title',
    subtitle: 'reply-subtitle',
    body: 'reply-body',
    footer: 'reply-footer',
    button: 'reply-button',
    container: 'reply-container col-md-8 col-sm-8 col-xs-12',
    template: {
        button: 'reply-template-button',
        generic: 'reply-template-generic',
        none: 'reply-template-text'
    }
};

const classes = Object.assign({}, _botSetup.formClasses, { reply: replyClasses });

exports.default = (state, prev, send) => {
    const selectedReplyKey = state.ui.selectedReply;
    const selectedReply = selectedReplyKey ? (0, _ramda.path)(state.ui.selectedReply.split('.'), state.replies) : null;
    const replyTitles = state.intents.names.filter(name => name !== 'none').reduce((previous, name) => Object.assign(previous, { [name]: name }), {});
    const onChange = createOnChange(send);
    const onSubmit = createOnSubmit(selectedReplyKey, selectedReply, state.bot, send);
    const content = (0, _replyListForm2.default)(replyTitles, selectedReplyKey, state.replies, selectedReply, state.intents.utterances, classes, _ptBr2.default.replies.ecommerce, state.api.loadingBot || state.api.updatingBot, onChange, onSubmit);
    const panels = [(0, _botSetup.panel)(content, _ptBr2.default.replies.ecommerce.title, _ptBr2.default.replies.ecommerce.description)];
    return (0, _botSetup.view)(_ptBr2.default.replies.title, panels);
};

module.exports = exports['default'];