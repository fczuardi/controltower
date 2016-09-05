import { findIndex } from 'ramda';

// default state
const initialState = {
    selectedIndex: null,
    list: []
};

// reducers
const select = (data, state) => ({
    ...state,
    selectedIndex: findIndex(item => (item.id === data.id))(state.list)
});
const setList = (data, state) => ({
    ...state,
    list: data.list
});

// effects
const load = (data, state, send, done) => {
    console.log(`Loading bot config (${data.id}) from server…`);
    send('location:set', { pathname: `./b/${data.id}` }, done);
};

// model
const customerModel = {
    namespace: 'bots',
    state: initialState,
    reducers: {
        select,
        setList
    },
    effects: {
        load
    }
};

export default customerModel;
