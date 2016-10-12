const intentsModel = {
    namespace: 'intents',
    state: {
        selectedIntent: 'none',
        names: [
            'none',
            'Quantos anos você tem?',
            'Tem telefone de contato?'
        ],
        utterances: {
            none: [],
            'Quantos anos você tem?': [
                'Quantos anos você tem?',
                'Quantos sua idade?',
                'Você é jovem?'
            ],
            'Tem telefone de contato?': [
                'Tem telefone de contato?'
            ]
        }
    },
    reducers: {
        selectIntent: (intentName, state) => ({
            ...state,
            selectedIntent: intentName
        }),
        addIntent: (intentName, state) => ({
            ...state,
            selectedIntent: intentName,
            names: [
                ...state.names,
                intentName
            ],
            utterances: {
                ...state.utterances,
                [intentName]: {}
            }
        })
    },
    effects: {
    }
};

export default intentsModel;
