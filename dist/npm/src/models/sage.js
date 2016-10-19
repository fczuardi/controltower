'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _xhr = require('xhr');

var _xhr2 = _interopRequireDefault(_xhr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultOptions = spellId => ({
    json: true,
    headers: {
        'BOT-ID': spellId
    }
});

const createSageModel = config => ({
    namespace: 'sage',
    state: {
        spellId: null,
        updatingSpell: false,
        loadingUtterances: false,
        loadingIntents: false
    },
    reducers: {
        set: (state, data) => data,
        setId: (state, spellId) => _extends({}, state, {
            spellId
        }),
        updatingSpellBegin: state => _extends({}, state, {
            updatingSpell: true
        }),
        updatingSpellEnd: state => _extends({}, state, {
            updatingSpell: false
        }),
        loadingUtterancesBegin: state => _extends({}, state, {
            loadingUtterances: true
        }),
        loadingUtterancesEnd: state => _extends({}, state, {
            loadingUtterances: false
        }),
        loadingIntentsBegin: state => _extends({}, state, {
            loadingIntents: true
        }),
        loadingIntentsEnd: state => _extends({}, state, {
            loadingIntents: false
        })
    },
    effects: {
        // Creates a new spell
        createSpell: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots`;
            const body = {
                name: data.name,
                desc: data.description
            };
            _xhr2.default.post(url, { json: body }, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                /*
                EXAMPLE RESPONSE
                {
                    "bot_status": 0, // ignore here
                    "bot_id": "ebbb9cd6-91d0-49f1-bc5f-ead1689db222" // used in every request
                }
                */
                console.log(response.body);
                return done();
            });
        },
        getSpell: (state, data, send, done) => {
            const field = data.field ? data.field : 'all';
            const url = `${ config.apiUrl }/bots/${ field }`;
            const options = defaultOptions(state.spellId);
            console.log('getSpell options', options);
            _xhr2.default.get(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                /* EXAMPLE RESPONSE (field = intents)
                [
                  {
                    "name": "none",
                    "children": []
                  },
                  ...
                ]
                */
                if (data.field === 'intents') {
                    const intentNames = response.body.map(intentObj => intentObj.name);
                    return send('intents:setNames', intentNames, done);
                }
                /* EXAMPLE RESPONSE (field = utterances)
                [
                  {
                    "text": "none",
                    "intent": "none",
                    "context": "",
                    "entities": []
                  },
                  ...
                ]
                */
                if (data.field === 'utterances') {
                    const utterances = response.body.reduce((prev, utterance) => {
                        const intentName = utterance.intent;
                        const utteranceText = utterance.text;
                        const oldIntentUtterances = prev[intentName] || [];
                        const intentUtterances = oldIntentUtterances.concat([utteranceText]);
                        return Object.assign(prev, { [intentName]: intentUtterances });
                    }, {});
                    return send('intents:setUtterances', utterances, done);
                }
                console.log('data.field', data.field);
                return done();
            });
        },
        /* All request below will return a status 200 if ok,
           else 40X or 50X with an success/error message*/
        createIntent: (state, intentName, send, done) => {
            console.log('Sage Create Intent', intentName);
            const url = `${ config.apiUrl }/bots/intents`;
            const options = defaultOptions(state.spellId);
            const body = [{
                name: intentName,
                children: []
            }];
            _xhr2.default.post(url, _extends({}, options, { json: body }), (err, response) => {
                const error = err || response.body.error || typeof response.body === 'string' && response.body.indexOf('error') !== -1;
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                console.log(response.body);
                // example of success return:
                // "Success:intents updated (0:skipped)"
                send('intents:addIntent', intentName, done);
                return done();
            });
        },
        deleteIntent: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots/intents/${ data.intent }`;
            const options = defaultOptions(state.spellId);
            _xhr2.default.delete(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                // return send('api:getBot', { botId: response.body.bots[0] }, done);
                console.log(response.body);
                return done();
            });
        },
        createUtterance: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots/utterances`;
            const options = defaultOptions(state.spellId);
            const body = [{
                text: data.utterance,
                intent: data.intent,
                entities: [],
                context: ''
            }];
            _xhr2.default.post(url, _extends({}, options, { json: body }), (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                // example of sucess response:
                // "Success:[{'text': u'foo and chill?'}]"
                console.log('Create utterance response', response.body);
                send('intents:addUtterance', {
                    intent: data.intent, utterance: data.utterance
                }, done);
                return done();
            });
        },
        updateUtterance: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots/utteraces/${ data.utterance }`;
            const options = defaultOptions(state.spellId);
            const body = { intent: data.intent };
            _xhr2.default.put(url, _extends({}, options, { json: body }), (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                console.log(response.body);
                return done();
            });
        }
    }
});

exports.default = createSageModel;
module.exports = exports['default'];