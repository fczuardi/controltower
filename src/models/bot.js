const botModel = {
    namespace: 'bot',
    state: {
        id: null,
        customerId: null,
        users: []
    },
    reducers: {
        set: data => data
    }
};

export default botModel;
