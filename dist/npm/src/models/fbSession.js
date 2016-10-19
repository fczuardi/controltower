'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const signInToggle = (isLogged, loginParams) => {
    if (isLogged) {
        window.FB.logout();
    } else {
        window.FB.login(loginResponse => {
            if (loginResponse.authResponse) {
                console.log('Welcome!', loginResponse.authResponse);
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, loginParams);
    }
};

const createFbSessionModel = config => ({
    namespace: 'fbsession',
    subscriptions: {
        init: (send, done) => {
            window.fbAsyncInit = () => {
                window.FB.init({
                    appId: config.appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.7'
                });
                window.FB.Event.subscribe('auth.statusChange', data => send('fbsession:statusChange', data, done));
                window.FB.getLoginStatus();
            };
            done();
        }
    },
    effects: {
        statusChange: (state, data, send, done) => {
            if (data.status === 'connected') {
                send('customer:signIn', data.authResponse, done);
                send('invite:check', window.location.href, done);
                send('api:set', { token: data.authResponse.accessToken }, done);
                send('fbsession:getPages', null, done);
                return send('api:getCustomer', null, done);
            }
            return send('customer:signOut', data, done);
        },
        getPages: (state, data, send, done) => {
            console.log('getPages');
            window.FB.api('/me/accounts', 'get', {}, response => {
                console.log('response', response);
                return send('ui:setFbPages', response.data, done);
            });
        },
        signIn: (state, data, send) => signInToggle(false, config.loginParams, send),
        signInToggle: (state, data, send) => signInToggle(data.isLogged, config.loginParams, send)
    }
});

exports.default = createFbSessionModel;
module.exports = exports['default'];