'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const intentsModel = {
    namespace: 'intents',
    state: {
        selectedIntent: 'none',
        names: ['none'],
        utterances: {
            none: []
        }
    },
    reducers: {
        setNames: (state, names) => _extends({}, state, {
            names
        }),
        selectIntent: (state, intentName) => _extends({}, state, {
            selectedIntent: intentName
        }),
        addIntent: (state, intentName) => _extends({}, state, {
            selectedIntent: intentName,
            names: [...state.names, intentName],
            utterances: _extends({}, state.utterances, {
                [intentName]: []
            })
        }),
        addUtterance: (state, data) => _extends({}, state, {
            utterances: _extends({}, state.utterances, {
                [data.intent]: state.utterances[data.intent] ? state.utterances[data.intent].concat([data.utterance]) : [data.utterance]
            })
        }),
        setUtterances: (state, utterances) => _extends({}, state, {
            utterances
        })
    },
    effects: {}
};

exports.default = intentsModel;
module.exports = exports['default'];