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
        loadingBot: false,
        loadingUsers: false
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
        loadingBotBegin: (data, state) => ({
            ...state,
            loadingBot: true
        }),
        loadingBotEnd: (data, state) => ({
            ...state,
            loadingBot: false
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
            send('api:loadingBotBegin', null, done);
            http.get(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                const bot = response.body;
                send('ui:selectBot', bot.id, done);
                send('ui:enableSection', 'admins', done);
                if (bot.facebook) {
                    send('ui:enableSection', 'channels', done);
                } else {
                    send('ui:disableSection', 'channels', done);
                }
                if (bot.vtex) {
                    send('ui:enableSection', 'ecommerce', done);
                } else {
                    send('ui:disableSection', 'ecommerce', done);
                }
                if (bot.replies) {
                    send('ui:enableSection', 'replies', done);
                    send('replies:set', JSON.parse(bot.replies), done);
                    send('api:loadingBotEnd', null, done);
                } else {
                    send('ui:disableSection', 'replies', done);
                }
                send('api:getMutedChats', bot, done);
                return send('bot:set', bot, done);
            });
        },
        getMutedChats: (bot, state, send, done) => {
            const query = {
                botId: bot.id,
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
            const ownerId = data.ownerId ? { ownerId: data.ownerId } : {};
            const vtexUpdate = data.vtex ? data : {};
            const repliesUpdate = data.replies ? data : {};
            const inviteCodeUpdate = data.inviteCode ? data : {};
            const update = {
                ...ownerId,
                ...facebookUpdate,
                ...vtexUpdate,
                ...repliesUpdate,
                ...inviteCodeUpdate
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
