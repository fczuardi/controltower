// default state
const initialState = {
    id: null,
    name: null,
    email: null,
    isLogged: false
};

// reducers
const signIn = (data, state) => ({
    ...state,
    isLogged: true
});
const signOut = () => ({
    id: null,
    name: null,
    email: null,
    isLogged: false
});
const setInfo = (data, state) => ({
    ...state,
    id: data.id,
    name: data.name,
    email: data.email
});

const customerModel = {
    namespace: 'customer',
    state: initialState,
    reducers: {
        setInfo,
        signIn,
        signOut
    }
};

export default customerModel;
