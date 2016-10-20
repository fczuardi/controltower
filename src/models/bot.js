const botModel = {
    namespace: 'bot',
    state: {
        id: null,
        customerId: null,
        inviteCode: null,
        type: null
    },
    reducers: {
        set: (state, data) => data,
        setFacebookPage: (state, page) => ({
            ...state,
            facebook: {
                ...state.facebook,
                pageAccessToken: page.access_token,
                pageId: page.id,
                pageName: page.name
            }
        }),
        setVtexStore: (state, update) => ({
            ...state,
            vtex: {
                ...state.vtex,
                ...update
            }
        })
    }
};

export default botModel;
