const intentsModel = {
    namespace: 'intents',
    state: {
        selectedIntent: 'none',
        names: [
            'none',
            'Quantos anos você tem?',
            'bar'
        ],
        utterances: {
            'Quantos anos você tem?': [
                'Quantos anos você tem?',
                'Quantos sua idade?',
                'Você é jovem?'
            ]
        }
    },
    reducers: {
    },
    effects: {
    }
};

export default intentsModel;
