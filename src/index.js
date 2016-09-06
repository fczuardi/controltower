import choo from 'choo';
import { pipe } from 'ramda';

// config
import config from '../config';

// models
import appModel from './models/app';
import customerModel from './models/customer';
import createFbSessionModel from './models/fbSession';
import botsModel from './models/bots';

// views
import fbSDK from './views/fbSDK';
import loginView from './views/login';
import dashboardView from './views/dashboard';
import botForm from './views/bot';

// styling
import mainWrapper from './style/defaultTheme';
import loginWrapper from './style/loginWrapper';

const app = choo({ href: true, history: true });
app.model(appModel);
app.model(customerModel);
app.model(createFbSessionModel(config));
app.model(botsModel);

const defaultAnonView = loginWrapper(loginView);
const authWrapper =
    (loggedView, anonView = defaultAnonView) => (state, prev, send) => (
        state.customer.isLogged
            ? loggedView(state, prev, send)
            : anonView(state, prev, send)
);

const viewWrapper = pipe(authWrapper, mainWrapper);

app.router([
    ['/', viewWrapper(dashboardView)],
    ['/b/:botId', viewWrapper(botForm)],
    // TODO remove this duplicated routes in a nicer manner
    ['/controltower', viewWrapper(dashboardView)],
    ['/controltower/b/:botId', viewWrapper(botForm)]
]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);
