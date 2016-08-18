import config from '../config.js';
import choo from 'choo';
import { signIn, signOut } from './reducers/auth';
import fbSignInToggle from './effects/fbSignInToggle';
import fbSetup from './subscriptions/fbSetup';
import mainView from './views/main';

const app = choo();
app.model({
    state: {
        isLogged: false
    },
    reducers: {
        signIn,
        signOut
    },
    effects: {
        signInToggle: (data, state) => fbSignInToggle(state.isLogged)
    },
    subscriptions: [
        fbSetup(config.facebook)
    ]
});

app.router(route => [
    route('/', mainView)
]);
const tree = app.start();
document.body.appendChild(tree);
