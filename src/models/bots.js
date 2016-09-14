import { findIndex } from 'ramda';

const botModel = {
    namespace: 'bots',
    state: {
        selectedIndex: null,
        list: []
    },
    reducers: {
        select: (data, state) => ({
            ...state,
            selectedIndex: findIndex(item => (item.id === data.id))(state.list)
        }),
        setList: (data, state) => ({
            ...state,
            list: data.list
        })
    },
    effects: {
        load: (data, state, send, done) => {
            console.log(`Loading bot config (${data.id}) from server…`);
            send('location:set', { pathname: `./b/${data.id}` }, done);
        }
    }
};

export default botModel;
