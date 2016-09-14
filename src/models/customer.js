const customerModel = {
    namespace: 'customer',
    state: {
        id: null,
        isLogged: false,
        name: null
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
        setFbInfo: (data, state) => ({
            ...state,
            facebook: {
                ...state.facebook,
                id: data.id,
                name: data.name,
                email: data.email,
                accessToken: data.accessToken
            }
        })
    },
    effects: {
        fetchInfo: (data, state, send, done) => {
            console.log('Make controltower-api signup post here');
            done();
        }
    }
};

export default customerModel;
