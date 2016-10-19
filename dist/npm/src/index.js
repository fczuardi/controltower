'use strict';

var _choo = require('choo');

var _choo2 = _interopRequireDefault(_choo);

var _ramda = require('ramda');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _app = require('./models/app');

var _app2 = _interopRequireDefault(_app);

var _ui = require('./models/ui');

var _ui2 = _interopRequireDefault(_ui);

var _customer = require('./models/customer');

var _customer2 = _interopRequireDefault(_customer);

var _bot = require('./models/bot');

var _bot2 = _interopRequireDefault(_bot);

var _replies = require('./models/replies');

var _replies2 = _interopRequireDefault(_replies);

var _intents = require('./models/intents');

var _intents2 = _interopRequireDefault(_intents);

var _users = require('./models/users');

var _users2 = _interopRequireDefault(_users);

var _invite = require('./models/invite');

var _invite2 = _interopRequireDefault(_invite);

var _api = require('./models/api');

var _api2 = _interopRequireDefault(_api);

var _fbSession = require('./models/fbSession');

var _fbSession2 = _interopRequireDefault(_fbSession);

var _sage = require('./models/sage');

var _sage2 = _interopRequireDefault(_sage);

var _fbSDK = require('./views/fbSDK');

var _fbSDK2 = _interopRequireDefault(_fbSDK);

var _main = require('./views/main');

var _main2 = _interopRequireDefault(_main);

var _login = require('./views/login');

var _login2 = _interopRequireDefault(_login);

var _dashboard = require('./views/dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _home = require('./views/home');

var _home2 = _interopRequireDefault(_home);

var _channels = require('./views/channels');

var _channels2 = _interopRequireDefault(_channels);

var _ecommerce = require('./views/ecommerce');

var _ecommerce2 = _interopRequireDefault(_ecommerce);

var _intents3 = require('./views/intents');

var _intents4 = _interopRequireDefault(_intents3);

var _replies3 = require('./views/replies');

var _replies4 = _interopRequireDefault(_replies3);

var _mutedChats = require('./views/mutedChats');

var _mutedChats2 = _interopRequireDefault(_mutedChats);

var _admins = require('./views/admins');

var _admins2 = _interopRequireDefault(_admins);

var _invitation = require('./views/invitation');

var _invitation2 = _interopRequireDefault(_invitation);

var _debug = require('./views/debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// models
const app = (0, _choo2.default)({ history: false, href: false });

// views


// config

app.model(_app2.default);
app.model(_ui2.default);
app.model(_customer2.default);
app.model(_bot2.default);
app.model(_replies2.default);
app.model(_intents2.default);
app.model(_users2.default);
app.model(_invite2.default);
app.model((0, _api2.default)(_config2.default.controltower));
app.model((0, _sage2.default)(_config2.default.sage));
app.model((0, _fbSession2.default)(_config2.default.facebook));

const defaultAnonView = _login2.default;
const authWrapper = (loggedView, anonView = defaultAnonView) => (state, prev, send) => state.customer.isLogged ? loggedView(state, prev, send) : anonView(state, prev, send);

const viewWrapper = (0, _ramda.pipe)(authWrapper, _dashboard2.default);
const homeView = viewWrapper(_home2.default);
const channelsView = viewWrapper(_channels2.default);
const ecommerceView = viewWrapper(_ecommerce2.default);
const intentsView = viewWrapper(_intents4.default);
const repliesView = viewWrapper(_replies4.default);
const mutedChatsView = viewWrapper(_mutedChats2.default);
const adminsView = viewWrapper(_admins2.default);
const invitationView = _invitation2.default;
const debugView = viewWrapper(_debug2.default);

const rootView = homeView;
app.router([['/', rootView], ['/controltower', rootView], ['/controltower/', rootView], ['/home', homeView], ['/channels', channelsView], ['/ecommerce', ecommerceView], ['/intents', intentsView], ['/replies', repliesView], ['/mutedChats', mutedChatsView], ['/admins', adminsView], ['/invite', invitationView], ['/debug', debugView]]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(_fbSDK2.default);
document.body.appendChild((0, _main2.default)());
const mainWrapper = document.getElementById('mainContent');
mainWrapper.appendChild(tree);