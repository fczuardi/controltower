'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var choo = _interopDefault(require('choo'));
var ramda = require('ramda');
var html = _interopDefault(require('choo/html'));

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var config = createCommonjsModule(function (module) {
    module.exports = {
        facebook: {
            appId: '1691821884476309',
            loginParams: {
                scope: 'public_profile,email'
            },
            userFields: 'id,name,email'
        }
    };
});

var version = "0.6.34";
var homepage = "https://github.com/fczuardi/controltower#readme";

const appModel = {
    namespace: 'app',
    state: {
        version,
        homepage
    }
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

// default state
const initialState = {
    id: null,
    name: null,
    email: null,
    isLogged: false
};

// reducers
const signIn = (data, state) => _extends({}, state, {
    isLogged: true
});
const signOut = () => ({
    id: null,
    name: null,
    email: null,
    isLogged: false
});
const setInfo = (data, state) => _extends({}, state, {
    id: data.id,
    name: data.name,
    email: data.email
});

const customerModel = {
    namespace: 'customer',
    state: initialState,
    reducers: {
        setInfo,
        signIn,
        signOut
    }
};

// effects
const signInToggle = (isLogged, loginParams) => {
    if (isLogged) {
        window.FB.logout();
    } else {
        window.FB.login(loginResponse => {
            if (loginResponse.authResponse) {
                console.log('Welcome!');
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, loginParams);
    }
};
const getUserInfo = (userFields, send, done) => {
    window.FB.api(`/me?fields=${ userFields }`, response => {
        console.table(response);
        send('customer:setInfo', response, done);
    });
};

// subscriptions
const createInit = config => (send, done) => {
    const { appId } = config;
    const loginStatusChanged = data => {
        // console.log('----fbLoginStatusChange', data);
        if (data.status === 'connected') {
            send('fbsession:fetchInfo', data, done);
            return send('customer:signIn', data, done);
        }
        return send('customer:signOut', data, done);
    };
    window.fbAsyncInit = () => {
        // console.log('----fbAsyncInit----');
        window.FB.init({
            appId,
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true, // parse social plugins on this page
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
        signInToggle: (data, state, send) => signInToggle(data.isLogged, config.facebook.loginParams, send),
        fetchInfo: (data, state, send, done) => getUserInfo(config.facebook.userFields, send, done)
    },
    subscriptions: {
        statusChange: createInit(config.facebook)
    }
});

// default state
const initialState$1 = {
    selectedIndex: null,
    list: []
};

// reducers
const select = (data, state) => _extends({}, state, {
    selectedIndex: ramda.findIndex(item => item.id === data.id)(state.list)
});
const setList = (data, state) => _extends({}, state, {
    list: data.list
});

// effects
const load = (data, state, send, done) => {
    console.log(`Loading bot config (${ data.id }) from server…`);
    send('location:set', { pathname: `./b/${ data.id }` }, done);
};

// model
const customerModel$1 = {
    namespace: 'bots',
    state: initialState$1,
    reducers: {
        select,
        setList
    },
    effects: {
        load
    }
};

var fbSDK = html`
<script>(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>`;

var ptBr = createCommonjsModule(function (module) {
    module.exports = {
        dashboard: {
            title: 'Dashboard',
            botUrl: 'Entre o identificador do seu bot (enviado por email)',
            load: 'Carregar'
        },
        setup: {
            title: 'Setup',
            update: 'Atualizar'
        },
        signInToggle: {
            signIn: 'Entrar',
            signOut: 'Sair'
        }
    };
});

var signInToggle$1 = ((isLogged, send) => html`
<button
    onclick=${ () => send('fbsession:signInToggle', { isLogged }) }
>
    ${ isLogged ? ptBr.signInToggle.signOut : ptBr.signInToggle.signIn }
</button>`);

var toolbar = ((customerState, appState, send) => html`
<div
    style="border-top: 1px solid black;margin-top: 1rem;padding-top: 1rem;"
>
    ${ signInToggle$1(customerState.isLogged, send) }
    <small>
        • Control Tower v${ appState.version } •
        <a href="${ appState.homepage }">view source</a>
    </small>
</div>`);

var mainView = ((state, prev, send) => html`
<div>
    <h1>Welcome</h1>
    ${ state.customer.id ? JSON.stringify(state.customer) : '' }
    ${ toolbar(state.customer, state.app, send) }
</div>`);

var dashboardView = ((state, prev, send) => html`
<div>
    <h1>${ ptBr.dashboard.title }</h1>
    <form
        onsubmit=${ e => {
    e.preventDefault();
    const botId = document.forms[0][0].value;
    send('bots:select', { id: botId });
    send('bots:load', { id: botId });
} }
    >
        <label>
            ${ ptBr.dashboard.botUrl }
            <input type="text" name="setupId"/>
        </label>
        <input
            type="submit"
            value=${ ptBr.dashboard.load }
        />
    </form>
    ${ toolbar(state.customer, state.app, send) }
    <hr>
    <p>${ JSON.stringify(state.user) }</p>
</div>`);

const botSetupLabels = {
    facebook: {
        legend: 'Facebook Page',
        pageId: 'Facebook Page ID',
        pageToken: 'Facebook Page Token',
        appSecret: 'Facebook App Secret'
    },
    vtex: {
        legend: 'VTEX Store',
        apiToken: 'VTEX API Token',
        apiKey: 'VTEX API Key',
        apiAccountName: 'VTEX API Account Name',
        apiEnvironment: 'VTEX API Environment',
        appKey: 'VTEX App Key',
        appToken: 'VTEX App Token'
    }
};
var botForm = ((state, prev, send) => html`
<div>
    <h1>${ ptBr.setup.title }</h1>
    <form
        action="saveConfig"
        method="POST"
        onsubmit=${ e => {
    e.preventDefault();
    console.log('Form submitted', e.target);
} }
    >
        ${ Object.keys(botSetupLabels).map(group => html`
            <fieldset>
                <legend>${ botSetupLabels[group].legend }</legend>
                ${ Object.keys(botSetupLabels[group]).map(label => label !== 'legend' ? html`
                    <label>
                        ${ botSetupLabels[group][label] }
                        <input type="text" name="${ label }" />
                    </label>
                ` : null) }
            </fieldset>
            `) }
        <input
            type="submit"
            value=${ ptBr.setup.update }
        />
    </form>
    ${ toolbar(state.customer, state.app, send) }
    <a href="../../">back to dashboard</a>
    <hr>
    <p>${ JSON.stringify(state.setup) }</p>
</div>`);

const app = choo({ href: true, history: true });
app.model(appModel);
app.model(customerModel);
app.model(createFbSessionModel(config));
app.model(customerModel$1);

const authWrapper = (loggedView, anonView) => (state, prev, send) => state.customer.isLogged && state.customer.id ? loggedView(state, prev, send) : anonView(state, prev, send);

app.router([['/', authWrapper(dashboardView, mainView)], ['/b/:botId', authWrapper(botForm, mainView)],
// TODO remove this duplicated routes in a nicer manner
['/controltower', authWrapper(dashboardView, mainView)], ['/controltower/b/:botId', authWrapper(botForm, mainView)]]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);