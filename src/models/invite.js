import qs from 'sheet-router/qs';
const inviteModel = ({
    namespace: 'invite',
    state: {
        botId: null
    },
    reducers: {
        set: data => data
    },
    effects: {
        check: (data, state, send, done) => {
            const qsData = qs(data);
            const botId = qsData.joinTeam;
            if (!botId) {
                return done();
            }
            send('invite:set', { botId }, done);
            send('location:set', { pathname: '/invite' }, done);
            return done();
        },
        accept: (data, state, send, done) => {
            console.log('TBD accept inviteCode', data);
            return done();
        },
        ignore: (data, state, send, done) => {
            send('invite:set', { botId: null }, done);
            send('location:set', { pathname: '/' }, done);
            window.location.search = '';
            return done();
        }
    }
});

export default inviteModel;
