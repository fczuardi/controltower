const botModel = {
    namespace: 'bot',
    state: {
        id: null,
        customerId: null,
        type: null,
        users: []
    },
    reducers: {
        set: data => data
    }
};

export default botModel;
