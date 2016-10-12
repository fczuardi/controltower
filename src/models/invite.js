import qs from 'sheet-router/qs';
const inviteModel = ({
    namespace: 'invite',
    state: {
        botId: null,
        ownerId: null
    },
    reducers: {
        set: (state, data) => data,
        setError: (state, error) => ({
            ...state,
            error
        })
    },
    effects: {
        check: (state, data, send, done) => {
            const qsData = qs(data);
            const botId = qsData.bot;
            const ownerId = qsData.owner;
            if (!botId || !ownerId) {
                return done();
            }
            send('invite:set', { botId, ownerId }, done);
            send('location:set', { pathname: '/invite' }, done);
            return done();
        },
        ignore: (state, data, send, done) => {
            send('invite:set', { botId: null }, done);
            window.location.search = '';
            return done();
        }
    }
});

export default inviteModel;
