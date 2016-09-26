const botModel = {
    namespace: 'bot',
    state: {
        id: null,
        customerId: null,
        type: null
    },
    reducers: {
        set: data => data,
        setFacebookPage: (page, state) => ({
            ...state,
            facebook: {
                ...state.facebook,
                pageAccessToken: page.access_token,
                pageId: page.id,
                pageName: page.name
            }
        }),
        setVtexStore: (update, state) => ({
            ...state,
            vtex: {
                ...state.vtex,
                ...update
            }
        })
    }
};

export default botModel;
