import config from '../config';
import choo from 'choo';
import { signIn, signOut, setInfo } from './reducers/user';
import fbSignInToggle from './effects/fbSignInToggle';
import fbGetUserInfo from './effects/fbGetUserInfo';
import fbSetup from './subscriptions/fbSetup';
import mainView from './views/main';
import dashboardView from './views/dashboard';
import setupForm from './views/setup';

const app = choo();
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
        fetchInfo: (data, state, send, done) => {
            fbGetUserInfo(config.facebook.userFields, send, done);
        }
    },
    subscriptions: {
        statusChange: fbSetup(config.facebook)
    }
};
app.model(userModel);

const authWrapper = (loggedView, anonView) => (state, prev, send) => (
    state.user.isLogged && state.user.id
        ? loggedView(state, prev, send)
        : anonView(state, prev, send)
);

app.router(route => [
    route('/', authWrapper(dashboardView, mainView)),
    route('/b/:botId', authWrapper(setupForm, mainView))
]);

const tree = app.start({ hash: true });
document.body.appendChild(tree);
