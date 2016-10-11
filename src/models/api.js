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
                if (response.body.bots.length === 1) {
                    return send('api:getBot', { botId: response.body.bots[0] }, done);
                }
                return done();
            });
        },
        getBot: (data, state, send, done) => {
            const url = `${config.apiUrl}/v1/bots/${data.botId}`;
            const options = defaultOptions(state.token);
            send('api:loadingBotBegin', null, done);
            http.get(url, options, (error, response) => {
                console.log(response);
                if (error) {
                    console.log('response', response.body);
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
                if (bot.sage && bot.sage.spellId) {
                    send('ui:enableSection', 'intents', done);
                    send('sage:setId', bot.sage.spellId, done);
                    send('sage:getSpell', { field: 'intents' }, done);
                } else {
                    send('ui:disableSection', 'intents', done);
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
        },
        acceptInvite: (data, state, send, done) => {
            const url = `${config.apiUrl}/v1/bots/${data.botId}`;
            const options = defaultOptions(state.token);
            const update = {
                admins: 'me',
                customerId: data.ownerId,
                inviteCode: data.inviteCode
            };
            send('api:updateBotBegin', null, done);
            http.put(url, { ...options, json: update }, (error, response) => {
                send('api:updateBotEnd', null, done);
                if (error || response.body.error) {
                    console.error(error || response.body.error);
                    send('invite:setError', (error || response.body.error), done);
                    return done();
                }
                window.location.search = '';
                return done();
            });
        }
    }
});

export default createApiModel;
