import choo from 'choo';
import { pipe } from 'ramda';

// config
import config from '../config';

// models
import appModel from './models/app';
import uiModel from './models/ui';
import customerModel from './models/customer';
import botModel from './models/bot';
import createApiModel from './models/api';
import createFbSessionModel from './models/fbSession';

// views
import fbSDK from './views/fbSDK';
import mainView from './views/main';
import loginView from './views/login';
import dashboardView from './views/dashboard';
import homeContent from './views/home';
import channelsContent from './views/channels';

const app = choo();
app.model(appModel);
app.model(uiModel);
app.model(customerModel);
app.model(botModel);
app.model(createApiModel(config.calamar));
app.model(createFbSessionModel(config.facebook));

const defaultAnonView = loginView;
const authWrapper =
    (loggedView, anonView = defaultAnonView) => (state, prev, send) => (
        state.customer.isLogged
            ? loggedView(state, prev, send)
            : anonView(state, prev, send)
);

const viewWrapper = pipe(authWrapper, mainView);
const homeView = dashboardView(homeContent);
const channelsView = dashboardView(channelsContent);

app.router([
    ['/', viewWrapper(homeView)],
    ['/channels', viewWrapper(channelsView)]
    // TODO find a better solution than duplicate routes
    // ['/controltower', viewWrapper(homeView)],
    // ['/controltower/channels', viewWrapper(channelsView)]
]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);
