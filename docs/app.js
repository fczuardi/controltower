'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var choo = _interopDefault(require('choo'));
var ramda = require('ramda');
var html = _interopDefault(require('choo/html'));
var insertCss = _interopDefault(require('insert-css'));

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

var version = "0.7.3";
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

var defaultTheme = createCommonjsModule(function (module) {
    const html$$ = html;
    const sf = 0;
    ;(insertCss("/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */\n\n/**\n * 1. Change the default font family in all browsers (opinionated).\n * 2. Correct the line height in all browsers.\n * 3. Prevent adjustments of font size after orientation changes in IE and iOS.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  line-height: 1.15; /* 2 */\n  -ms-text-size-adjust: 100%; /* 3 */\n  -webkit-text-size-adjust: 100%; /* 3 */\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n * 2. Add the correct display in IE.\n */\n\narticle,\naside,\ndetails, /* 1 */\nfigcaption,\nfigure,\nfooter,\nheader,\nmain, /* 2 */\nmenu,\nnav,\nsection,\nsummary { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Add the correct display in IE 10-.\n * 1. Add the correct display in IE.\n */\n\ntemplate, /* 1 */\n[hidden] {\n  display: none;\n}\n\n/* Links\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * Remove the outline on focused links when they are also active or hovered\n * in all browsers (opinionated).\n */\n\na:active,\na:hover {\n  outline-width: 0;\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change font properties to `inherit` in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font: inherit; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Restore the font weight unset by the previous rule.\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Change the border, margin, and padding in all browsers (opinionated).\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on OS X.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * Correct the text style of placeholders in Chrome, Edge, and Safari.\n */\n\n::-webkit-input-placeholder {\n  color: inherit;\n  opacity: 0.54;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}") || true) && "_c5770200";

    const mainCss = (insertCss("._f545f2f7 h1 {\n    color: red\n}") || true) && "_f545f2f7";

    module.exports = view => (state, prev, send) => html$$`
<div class=${ mainCss }>
    ${ view(state, prev, send) }
</div>`;
});

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
    <a href="../">back to dashboard</a>
    <hr>
    <p>${ JSON.stringify(state.setup) }</p>
</div>`);

const app = choo({ href: true, history: true });
app.model(appModel);
app.model(customerModel);
app.model(createFbSessionModel(config));
app.model(customerModel$1);

const authWrapper = (loggedView, anonView = mainView) => (state, prev, send) => state.customer.isLogged && state.customer.id ? loggedView(state, prev, send) : anonView(state, prev, send);
const viewWrapper = ramda.pipe(defaultTheme, authWrapper);

app.router([['/', viewWrapper(dashboardView)], ['/b/:botId', viewWrapper(botForm)],
// TODO remove this duplicated routes in a nicer manner
['/controltower', viewWrapper(dashboardView)], ['/controltower/b/:botId', viewWrapper(botForm)]]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);