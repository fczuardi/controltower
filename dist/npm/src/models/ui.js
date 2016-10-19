'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const uiModel = {
    namespace: 'ui',
    state: {
        selectedSection: 'home',
        selectedBot: null,
        enabledSections: ['home', 'debug'],
        menu: ['home', 'channels', 'ecommerce', 'intents', 'replies', 'mutedChats', 'admins', 'debug'],
        facebookPages: [],
        selectedMutedUsers: [],
        selectedReply: null
    },
    reducers: {
        enableSection: (state, name) => state.enabledSections.includes(name) ? state : _extends({}, state, {
            enabledSections: state.enabledSections.concat([name])
        }),
        disableSection: (state, name) => _extends({}, state, {
            enabledSections: state.enabledSections.filter(item => item !== name)
        }),
        selectSection: (state, name) => _extends({}, state, {
            selectedSection: name
        }),
        setFbPages: (state, facebookPages) => _extends({}, state, {
            facebookPages
        }),
        selectBot: (state, botId) => _extends({}, state, {
            selectedBot: botId
        }),
        selectReply: (state, replyKey) => _extends({}, state, {
            selectedReply: replyKey
        }),
        selectMutedUser: (state, index) => _extends({}, state, {
            selectedMutedUsers: state.selectedMutedUsers.concat([index])
        }),
        deselectMutedUser: (state, index) => _extends({}, state, {
            selectedMutedUsers: state.selectedMutedUsers.filter(i => i !== index)
        }),
        setSelectedMutedUsers: (state, data) => _extends({}, state, {
            selectedMutedUsers: data
        })
    }
};

exports.default = uiModel;
module.exports = exports['default'];