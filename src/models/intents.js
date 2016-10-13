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
        setNames: (state, names) => ({
            ...state,
            names
        }),
        selectIntent: (state, intentName) => ({
            ...state,
            selectedIntent: intentName
        }),
        addIntent: (state, intentName) => ({
            ...state,
            selectedIntent: intentName,
            names: [
                ...state.names,
                intentName
            ],
            utterances: {
                ...state.utterances,
                [intentName]: []
            }
        }),
        addUtterance: (state, data) => ({
            ...state,
            utterances: {
                ...state.utterances,
                [data.intent]: (
                    state.utterances[data.intent]
                        ? state.utterances[data.intent].concat([data.utterance])
                        : [data.utterance]
                )
            }
        }),
        setUtterances: (state, utterances) => ({
            ...state,
            utterances
        })
    },
    effects: {
    }
};

export default intentsModel;
