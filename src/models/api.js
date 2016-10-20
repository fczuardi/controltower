import http from 'xhr';
import { stringify as qsStringify } from 'querystring';

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
        set: (state, data) => data,
        updateBotBegin: state => ({
            ...state,
            updatingBot: true
        }),
        updateBotEnd: state => ({
            ...state,
            updatingBot: false
        }),
        loadingUsersBegin: state => ({
            ...state,
            loadingUsers: true
        }),
        loadingUsersEnd: state => ({
            ...state,
            loadingUsers: false
        }),
        loadingBotBegin: state => ({
            ...state,
            loadingBot: true
        }),
        loadingBotEnd: state => ({
            ...state,
            loadingBot: false
        })
    },
    effects: {
        getCustomer: (state, data, send, done) => {
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
        getBot: (state, data, send, done) => {
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
                    if (bot.type === 'ecommerce') {
                        send('ui:enableSection', 'replies', done);
                        send('ui:selectReply', 'start', done);
                    }
                    send('replies:set', JSON.parse(bot.replies), done);
                    send('api:loadingBotEnd', null, done);
                } else {
                    send('ui:disableSection', 'replies', done);
                }
                if (bot.sage && bot.sage.spellId) {
                    send('ui:enableSection', 'intents', done);
                    send('sage:setId', bot.sage.spellId, done);
                    send('sage:getSpell', { field: 'intents' }, done);
                    send('sage:getSpell', { field: 'utterances' }, done);
                } else {
                    send('ui:disableSection', 'intents', done);
                }
                send('api:getMutedChats', bot, done);
                return send('bot:set', bot, done);
            });
        },
        getMutedChats: (state, bot, send, done) => {
            const query = {
                botId: bot.id,
                botStatus: 'muted'
            };
            const url = `${config.apiUrl}/v1/users/?${qsStringify(query)}`;
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
        unMuteChats: (state, data, send, done) => {
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
        updateBot: (state, data, send, done) => {
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
        acceptInvite: (state, data, send, done) => {
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
