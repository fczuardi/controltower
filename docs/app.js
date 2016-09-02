'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var choo = _interopDefault(require('choo'));
var html = _interopDefault(require('choo/html'));

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var config = createCommonjsModule(function (module) {
    module.exports = {
        rootPath: '/controltower/',
        facebook: {
            appId: '1691821884476309',
            loginParams: {
                scope: 'public_profile,email'
            },
            userFields: 'id,name,email'
        }
    };
});

var version = "0.6.21";
var homepage = "https://github.com/fczuardi/controltower#readme";

function fbGetUserInfo (userFields, send, done) {
    window.FB.api(`/me?fields=${ userFields }`, response => {
        console.table(response);
        send('user:setInfo', response, done);
    });
}

function fbSignInToggle (isLogged, loginParams) {
    if (isLogged) {
        return window.FB.logout();
    }
    return window.FB.login(loginResponse => {
        if (loginResponse.authResponse) {
            console.log('Welcome!');
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, loginParams);
}

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

const fbSetup = config => (send, done) => {
    const { appId } = config;

    const fbLoginStatusChange = data => {
        // console.log('----fbLoginStatusChange', data);
        if (data.status === 'connected') {
            send('user:fetchInfo', data, done);
            return send('user:signIn', data, done);
        }
        return send('user:signOut', data, done);
    };
    window.fbAsyncInit = () => {
        // console.log('----fbAsyncInit----');
        window.FB.init({
            appId,
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true, // parse social plugins on this page
            version: 'v2.7' // use graph api version 2.5
        });
        window.FB.Event.subscribe('auth.statusChange', fbLoginStatusChange);
        window.FB.getLoginStatus();
    };
};

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
    onclick=${ () => send('user:signInToggle') }
>
    ${ isLogged ? ptBr.signInToggle.signOut : ptBr.signInToggle.signIn }
</button>`);

var toolbar = ((userState, appState, send) => html`
<div
    style="border-top: 1px solid black;margin-top: 1rem;padding-top: 1rem;"
>
    ${ signInToggle$1(userState.isLogged, send) }
    <small>
        • Control Tower v${ appState.version } •
        <a href="${ appState.homepage }">view source</a>
    </small>
</div>`);

var dashboardView = ((state, prev, send) => html`
<div>
    <h1>${ ptBr.dashboard.title }</h1>
    <form
        method="POST"
        action="#/setup"
        onsubmit=${ e => {
    e.preventDefault();
    const setupId = document.forms[0][0].value;
    send('setup:setId', { id: setupId });
    send('setup:fetch', { setupId });
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
    ${ toolbar(state.user, state.app, send) }
    <hr>
    <p>${ JSON.stringify(state.user) }</p>
</div>`);

var fbSDK = html`
<script>(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>`;

var mainView = ((state, prev, send) => html`
<div>
    <h1>Welcome</h1>
    ${ state.user.id ? JSON.stringify(state.user) : '' }
    ${ toolbar(state.user, state.app, send) }
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
var setupForm = ((state, prev, send) => html`
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
    ${ toolbar(state.user, state.app, send) }
    <a href=${ state.app.rootPath }>back to dashboard</a>
    <hr>
    <p>${ JSON.stringify(state.setup) }</p>
</div>`);

const { rootPath } = config;
const app = choo();
const appModel = {
    namespace: 'app',
    state: {
        version,
        homepage,
        rootPath
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
        signInToggle: (data, state, send) => fbSignInToggle(state.isLogged, config.facebook.loginParams, send),
        fetchInfo: (data, state, send, done) => fbGetUserInfo(config.facebook.userFields, send, done)
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
        setId: (data, state) => _extends({}, state, {
            id: data.id
        })
    },
    effects: {
        fetch: (data, state, send, done) => {
            send('location:set', { pathname: `${ rootPath }b/${ data.setupId }` }, done);
        }
    }
};
app.model(appModel);
app.model(userModel);
app.model(setupModel);

const authWrapper = (loggedView, anonView) => (state, prev, send) => state.user.isLogged && state.user.id ? loggedView(state, prev, send) : anonView(state, prev, send);

app.router([[`${ rootPath }`, authWrapper(dashboardView, mainView)], [`${ rootPath }b/:botId`, authWrapper(setupForm, mainView)]]);

const tree = app.start({ hash: true });

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);