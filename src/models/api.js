import http from 'choo/http';
import qs from 'querystring';

const defaultOptions = token => ({
    json: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
});

const createApiModel = config => ({
    namespace: 'api',
    state: {
        token: null,
        updatingBot: false
    },
    reducers: {
        set: data => data,
        updateBotBegin: (data, state) => ({
            ...state,
            updatingBot: true
        }),
        updateBotEnd: (data, state) => ({
            ...state,
            updatingBot: false
        })
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
                if (response.body.vtex) {
                    send('ui:enableSection', 'ecommerce', done);
                } else {
                    send('ui:disableSection', 'ecommerce', done);
                }
                send('api:getMutedChats', response.body, done);
                return send('bot:set', response.body, done);
            });
        },
        getMutedChats: (bot, state, send, done) => {
            const query = {
                botId: bot.id,
                customerId: bot.customerId,
                botStatus: 'muted'
            };
            const url = `${config.apiUrl}/v1/users/?${qs.stringify(query)}`;
            const options = defaultOptions(state.token);
            http.get(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                if (response.body.length) {
                    send('ui:enableSection', 'mutedChats', done);
                } else {
                    send('ui:disableSection', 'mutedChats', done);
                }
                // TODO create users model to build the muted chats list
                return done();
            });
        },
        updateBot: (data, state, send, done) => {
            const url = `${config.apiUrl}/v1/bots/${data.botId}`;
            const options = defaultOptions(state.token);
            const facebookUpdate = !data.facebookPage ? {} : {
                facebook: {
                    pageAccessToken: data.facebookPage.access_token,
                    pageId: data.facebookPage.id,
                    pageName: data.facebookPage.name
                }
            };
            const vtexUpdate = data.vtex ? data : {};
            const update = {
                ...facebookUpdate,
                ...vtexUpdate
            };
            send('api:updateBotBegin', null, done);
            http.put(url, { ...options, json: update }, (error, response) => {
                send('api:updateBotEnd', null, done);
                if (error) {
                    console.error(error);
                    return done();
                }
                return send('bot:set', response.body, done);
            });
        }
    }
});

export default createApiModel;
