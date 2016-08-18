import config from '../config';
import choo from 'choo';
import { signIn, signOut, setInfo } from './reducers/user';
import fbSignInToggle from './effects/fbSignInToggle';
import fbGetUserInfo from './effects/fbGetUserInfo';
import fbSetup from './subscriptions/fbSetup';
import mainView from './views/main';

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
    subscriptions: [
        fbSetup(config.facebook)
    ]
};
app.model(userModel);
app.router(route => [
    route('/', mainView)
]);
const tree = app.start();
document.body.appendChild(tree);
