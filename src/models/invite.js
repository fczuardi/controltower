import qs from 'sheet-router/qs';
const inviteModel = ({
    namespace: 'invite',
    state: {
        botId: null,
        ownerId: null
    },
    reducers: {
        set: data => data,
        setError: (error, state) => ({
            ...state,
            error
        })
    },
    effects: {
        check: (data, state, send, done) => {
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
        ignore: (data, state, send, done) => {
            send('invite:set', { botId: null }, done);
            window.location.search = '';
            return done();
        }
    }
});

export default inviteModel;
