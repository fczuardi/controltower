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
        updatingBot: false,
        loadingUsers: false,
        loadingReplies: false
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
        }),
        loadingUsersBegin: (data, state) => ({
            ...state,
            loadingUsers: true
        }),
        loadingUsersEnd: (data, state) => ({
            ...state,
            loadingUsers: false
        }),
        loadingRepliesBegin: (data, state) => ({
            ...state,
            loadingReplies: true
        }),
        loadingRepliesEnd: (data, state) => ({
            ...state,
            loadingReplies: false
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
            send('api:loadingRepliesBegin', null, done);
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
                if (response.body.replies) {
                    send('ui:enableSection', 'replies', done);
                    send('replies:set', JSON.parse(response.body.replies), done);
                    send('api:loadingRepliesEnd', null, done);
                } else {
                    send('ui:disableSection', 'replies', done);
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
            send('api:loadingUsersBegin', null, done);
            http.get(url, options, (error, response) => {
                send('api:loadingUsersEnd', null, done);
                if (error) {
                    console.error(error);
                    return done();
                }
                send('ui:enableSection', 'mutedChats', done);
                return send('users:setMuted', response.body, done);
            });
        },
        unMuteChats: (data, state, send, done) => {
            const url = `${config.apiUrl}/v1/users`;
            const options = defaultOptions(state.token);
            const body = {
                ...data,
                update: {
                    botStatus: 'active'
                }
            };
            send('api:loadingUsersBegin', null, done);
            http.put(url, { ...options, json: body }, (error, response) => {
                send('api:loadingUsersEnd', null, done);
                if (error) {
                    console.error(error);
                    return done();
                }
                send('ui:setSelectedMutedUsers', [], done);
                return send('users:unMuteUsers',
                    response.body.map(item => item.id), done);
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
            const repliesUpdate = data.replies ? data : {};
            const update = {
                ...facebookUpdate,
                ...vtexUpdate,
                ...repliesUpdate
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
