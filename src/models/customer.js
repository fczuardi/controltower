// default state
const initialState = {
    id: null,
    isLogged: false,
    facebook: {
        id: null,
        name: null,
        email: null,
        accessToken: null
    }
};

// reducers
const signOut = () => initialState;
const signIn = (data, state) => ({
    ...state,
    isLogged: true
});
const setFbInfo = (data, state) => ({
    ...state,
    facebook: {
        ...state.facebook,
        id: data.id,
        name: data.name,
        email: data.email,
        accessToken: data.accessToken
    }
});

const customerModel = {
    namespace: 'customer',
    state: initialState,
    reducers: {
        setFbInfo,
        signIn,
        signOut
    }
};

export default customerModel;
