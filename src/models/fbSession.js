// effects
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
const getUserInfo = (userFields, send, done) => {
    const accessToken = window.FB.getAuthResponse().accessToken;
    window.FB.api(`/me?fields=${userFields}`, response => {
        send('customer:setFbInfo', { ...response, accessToken }, done);
    });
};

// subscriptions
const createInit = config => (send, done) => {
    const { appId } = config;
    const loginStatusChanged = data => {
        // console.log('----fbLoginStatusChange', data);
        if (data.status === 'connected') {
            send('fbsession:fetchInfo', data, done);
            return send('customer:signIn', null, done);
        }
        return send('customer:signOut', data, done);
    };
    window.fbAsyncInit = () => {
        // console.log('----fbAsyncInit----');
        window.FB.init({
            appId,
            cookie: true,  // enable cookies to allow the server to access the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.7' // use graph api version 2.5
        });
        window.FB.Event.subscribe('auth.statusChange', loginStatusChanged);
        window.FB.getLoginStatus();
    };
};

const createFbSessionModel = config => ({
    namespace: 'fbsession',
    state: {},
    effects: {
        signIn: (data, state, send) =>
            signInToggle(false, config.facebook.loginParams, send),
        signInToggle: (data, state, send) =>
            signInToggle(data.isLogged, config.facebook.loginParams, send),
        fetchInfo: (data, state, send, done) =>
            getUserInfo(config.facebook.userFields, send, done)
    },
    subscriptions: {
        statusChange: createInit(config.facebook)
    }
});
export default createFbSessionModel;
