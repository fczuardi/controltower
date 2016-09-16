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
        }
    }
});

export default usersModel;
