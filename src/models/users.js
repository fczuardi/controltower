const usersModel = ({
    namespace: 'users',
    state: {
        filteredByMutedBot: []
    },
    reducers: {
        setMuted: (data, state) => {
            console.log('setMuted', data);
            return {
                ...state,
                filteredByMutedBot: data
            };
        },
        unMuteUsers: (data, state) => {
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
