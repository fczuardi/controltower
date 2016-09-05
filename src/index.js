import choo from 'choo';

import config from '../config';

import appModel from './models/app';
import customerModel from './models/customer';
import createFbSessionModel from './models/fbSession';
import botsModel from './models/bots';

import fbSDK from './views/fbSDK';
import mainView from './views/main';
import dashboardView from './views/dashboard';
import botForm from './views/bot';

const app = choo({ href: true, history: true });
app.model(appModel);
app.model(customerModel);
app.model(createFbSessionModel(config));
app.model(botsModel);

const authWrapper = (loggedView, anonView = mainView) => (state, prev, send) => (
    state.customer.isLogged && state.customer.id
        ? loggedView(state, prev, send)
        : anonView(state, prev, send)
);

app.router([
    ['/', authWrapper(dashboardView)],
    ['/b/:botId', authWrapper(botForm)],
    // TODO remove this duplicated routes in a nicer manner
    ['/controltower', authWrapper(dashboardView)],
    ['/controltower/b/:botId', authWrapper(botForm)]
]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);
