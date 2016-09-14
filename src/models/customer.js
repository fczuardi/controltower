const customerModel = ({
    namespace: 'customer',
    state: {
        id: null,
        name: null,
        email: null,
        bots: [],
        facebookId: null,
        isLogged: null
    },
    reducers: {
        signIn: (data, state) => ({
            ...state,
            isLogged: true
        }),
        signOut: (data, state) => ({
            ...state,
            isLogged: false
        }),
        set: data => data
    }
});

export default customerModel;
