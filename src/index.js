import choo from 'choo';

import config from '../config';
import { version, homepage } from '../package.json';

import fbGetUserInfo from './effects/fbGetUserInfo';
import fbSignInToggle from './effects/fbSignInToggle';
import { signIn, signOut, setInfo } from './reducers/user';
import fbSetup from './subscriptions/fbSetup';
import dashboardView from './views/dashboard';
import fbSDK from './views/fbSDK';
import mainView from './views/main';
import setupForm from './views/setup';

const app = choo({ href: false, history: false });
const appModel = {
    namespace: 'app',
    state: {
        version,
        homepage
    }
};
const userModel = {
    namespace: 'user',
    state: {
        id: null,
        name: null,
        email: null,
        isLogged: false
    },
    reducers: {
        setInfo,
        signIn,
        signOut
    },
    effects: {
        signInToggle: (data, state, send) =>
            fbSignInToggle(state.isLogged, config.facebook.loginParams, send),
        fetchInfo: (data, state, send, done) =>
            fbGetUserInfo(config.facebook.userFields, send, done)
    },
    subscriptions: {
        statusChange: fbSetup(config.facebook)
    }
};
const setupModel = {
    namespace: 'setup',
    state: {
        id: null
    },
    reducers: {
        setId: (data, state) => ({
            ...state,
            id: data.id
        })
    },
    effects: {
        fetch: (data, state, send, done) => {
            console.log(`/b/${data.setupId}`);
            send('location:set', { pathname: `/b/${data.setupId}` }, done);
        }
    }
};
app.model(appModel);
app.model(userModel);
app.model(setupModel);

const authWrapper = (loggedView, anonView) => (state, prev, send) => (
    state.user.isLogged && state.user.id
        ? loggedView(state, prev, send)
        : anonView(state, prev, send)
);

app.router([
    ['/', authWrapper(dashboardView, mainView)],
    ['/controltower', authWrapper(dashboardView, mainView)],
    ['/b/:botId', authWrapper(setupForm, mainView)]
]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);
