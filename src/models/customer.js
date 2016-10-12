import qs from 'sheet-router/qs';
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
        set: (state, data) => data,
        signIn: state => ({
            ...state,
            isLogged: true
        }),
        signOut: state => ({
            ...state,
            isLogged: false
        })
    }
});

export default customerModel;
