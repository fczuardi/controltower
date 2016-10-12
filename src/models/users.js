const usersModel = ({
    namespace: 'users',
    state: {
        filteredByMutedBot: []
    },
    reducers: {
        setMuted: (state, data) => {
            console.log('setMuted', data);
            return {
                ...state,
                filteredByMutedBot: data
            };
        },
        unMuteUsers: (state, data) => {
            console.log('unMuteUsers', data);
            return {
                ...state,
                filteredByMutedBot: state.filteredByMutedBot.filter(
                    item => {
                        console.log('item.id', item.id, data, data.includes(item.id));
                        const result = !data.includes(item.id);
                        console.log('result', result);
                        return result;
                    }
                )
            };
        }
    }
});

export default usersModel;
