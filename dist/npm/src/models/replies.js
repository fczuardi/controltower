'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

const repliesModel = {
    namespace: 'replies',
    state: {},
    reducers: {
        set: (state, data) => data,
        setReply: (state, data) => (0, _ramda.merge)(state, data),
        setSampleQuestion: (state, data) => _extends({}, state, {
            [data.intent]: state[data.intent] ? Object.assign(state[data.intent], { sampleQuestion: data.utterance }) : { text: '', sampleQuestion: data.utterance }
        })
    },
    effects: {
        sendReplies: (state, bot, send, done) => send('api:updateBot', {
            botId: bot.id,
            ownerId: bot.customerId,
            replies: JSON.stringify(state)
        }, done)
    }
};

exports.default = repliesModel;
module.exports = exports['default'];