import http from 'choo/http';

const defaultOptions = token => ({
    json: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
});

const createApiModel = config => ({
    namespace: 'api',
    state: {
        token: null
    },
    reducers: {
        set: data => data
    },
    effects: {
        getCustomer: (data, state, send, done) => {
            const url = `${config.apiUrl}/v1/customers`;
            const options = defaultOptions(state.token);
            http.post(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                send('customer:set', response.body, done);
                return send('api:getBot', { botId: response.body.bots[0] }, done);
            });
        },
        getBot: (data, state, send, done) => {
            const url = `${config.apiUrl}/v1/bots/${data.botId}`;
            const options = defaultOptions(state.token);
            http.get(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                if (response.body.facebook) {
                    send('ui:enableSection', 'channels', done);
                } else {
                    send('ui:disableSection', 'channels', done);
                }
                return send('bot:set', response.body, done);
            });
        }
    }
});

export default createApiModel;
