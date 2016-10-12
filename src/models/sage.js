import http from 'xhr';

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
        set: data => data,
        setId: (spellId, state) => ({
            ...state,
            spellId
        }),
        updatingSpellBegin: (data, state) => ({
            ...state,
            updatingSpell: true
        }),
        updatingSpellEnd: (data, state) => ({
            ...state,
            updatingSpell: false
        }),
        loadingUtterancesBegin: (data, state) => ({
            ...state,
            loadingUtterances: true
        }),
        loadingUtterancesEnd: (data, state) => ({
            ...state,
            loadingUtterances: false
        }),
        loadingIntentsBegin: (data, state) => ({
            ...state,
            loadingIntents: true
        }),
        loadingIntentsEnd: (data, state) => ({
            ...state,
            loadingIntents: false
        })
    },
    effects: {
        // Creates a new spell
        createSpell: (data, state, send, done) => {
            const url = `${config.apiUrl}/bots`;
            const body = {
                name: data.name,
                desc: data.description
            };
            http.post(url, { json: body }, (error, response) => {
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
        getSpell: (data, state, send, done) => {
            const field = data.field ? data.field : 'all';
            const url = `${config.apiUrl}/bots/${field}`;
            const options = defaultOptions(state.spellId);
            console.log('getSpell options', options);
            http.get(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
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
                EXAMPLE RESPONSE (field = intents)
                [
                  {
                    "name": "none",
                    "children": []
                  },
                  ...
                ]
                */
                console.log(response.body);
                return done();
            });
        },
        /* All request below will return a status 200 if ok,
           else 40X or 50X with an success/error message*/
        createIntent: (intentName, state, send, done) => {
            console.log('Sage Create Intent', intentName);
            const url = `${config.apiUrl}/bots/intents`;
            const options = defaultOptions(state.spellId);
            const body = [{
                name: intentName,
                children: []
            }];
            http.post(url, { ...options, json: body }, (err, response) => {
                const error = (err || response.body.error ||
                    (typeof response.body === 'string' && response.body.indexOf('error') !== -1)
                );
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
        deleteIntent: (data, state, send, done) => {
            const url = `${config.apiUrl}/bots/intents/${data.intent}`;
            const options = defaultOptions(state.spellId);
            http.delete(url, options, (error, response) => {
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
        createUtterance: (data, state, send, done) => {
            const url = `${config.apiUrl}/bots/utterances`;
            const options = defaultOptions(state.spellId);
            const body = [
                {
                    text: data.utterance,
                    intent: data.intent,
                    entities: [],
                    context: ''
                }];
            http.post(url, { ...options, json: body }, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                console.log(response.body);
                return done();
            });
        },
        updateUtterance: (data, state, send, done) => {
            const url = `${config.apiUrl}/bots/utteraces/${data.utterance}`;
            const options = defaultOptions(state.spellId);
            const body = { intent: data.intent };
            http.put(url, { ...options, json: body }, (error, response) => {
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

export default createSageModel;
