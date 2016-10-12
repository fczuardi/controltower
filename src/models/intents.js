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
        })
    },
    effects: {
    }
};

export default intentsModel;
