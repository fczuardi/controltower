'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var choo = _interopDefault(require('choo'));
var ramda = require('ramda');
var qs = _interopDefault(require('sheet-router/qs'));
var http = _interopDefault(require('xhr'));
var querystring = require('querystring');
var html = _interopDefault(require('choo/html'));

var config = {
    controltower: {
        apiUrl: 'https://zvll8fpfa4.execute-api.us-east-1.amazonaws.com/latest'
    },
    sage: {
        apiUrl: 'https://idxpyugwsa.execute-api.us-east-1.amazonaws.com/dev'
    },
    facebook: {
        appId: '1691821884476309',
        loginParams: {
            scope: 'public_profile,email,pages_show_list,manage_pages'
        },
        userFields: 'id,name,email'
    }
};

var version = "0.15.1";












var homepage = "https://github.com/fczuardi/controltower#readme";

const appModel = {
    namespace: 'app',
    state: {
        version,
        homepage
    }
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















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

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};











var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};





var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

const uiModel = {
    namespace: 'ui',
    state: {
        selectedSection: 'home',
        selectedBot: null,
        enabledSections: ['home', 'debug'],
        menu: ['home', 'channels', 'ecommerce', 'intents', 'replies', 'mutedChats', 'admins', 'debug'],
        facebookPages: [],
        selectedMutedUsers: [],
        selectedReply: null
    },
    reducers: {
        enableSection: (state, name) => state.enabledSections.includes(name) ? state : _extends({}, state, {
            enabledSections: state.enabledSections.concat([name])
        }),
        disableSection: (state, name) => _extends({}, state, {
            enabledSections: state.enabledSections.filter(item => item !== name)
        }),
        selectSection: (state, name) => _extends({}, state, {
            selectedSection: name
        }),
        setFbPages: (state, facebookPages) => _extends({}, state, {
            facebookPages
        }),
        selectBot: (state, botId) => _extends({}, state, {
            selectedBot: botId
        }),
        selectReply: (state, replyKey) => _extends({}, state, {
            selectedReply: replyKey
        }),
        selectMutedUser: (state, index) => _extends({}, state, {
            selectedMutedUsers: state.selectedMutedUsers.concat([index])
        }),
        deselectMutedUser: (state, index) => _extends({}, state, {
            selectedMutedUsers: state.selectedMutedUsers.filter(i => i !== index)
        }),
        setSelectedMutedUsers: (state, data) => _extends({}, state, {
            selectedMutedUsers: data
        })
    }
};

const customerModel = {
    namespace: 'customer',
    state: {
        id: null,
        name: null,
        email: null,
        bots: [],
        facebookId: null,
        isLogged: null
    },
    reducers: {
        set: (state, data) => data,
        signIn: state => _extends({}, state, {
            isLogged: true
        }),
        signOut: state => _extends({}, state, {
            isLogged: false
        })
    }
};

const botModel = {
    namespace: 'bot',
    state: {
        id: null,
        customerId: null,
        inviteCode: null,
        type: null
    },
    reducers: {
        set: (state, data) => data,
        setFacebookPage: (state, page) => _extends({}, state, {
            facebook: _extends({}, state.facebook, {
                pageAccessToken: page.access_token,
                pageId: page.id,
                pageName: page.name
            })
        }),
        setVtexStore: (state, update) => _extends({}, state, {
            vtex: _extends({}, state.vtex, update)
        })
    }
};

const repliesModel = {
    namespace: 'replies',
    state: {},
    reducers: {
        set: (state, data) => data,
        setReply: (state, data) => ramda.merge(state, data),
        setSampleQuestion: (state, data) => _extends({}, state, {
            [data.intent]: state[data.intent] ? Object.assign(state[data.intent], { sampleQuestion: data.utterance }) : { text: '', sampleQuestion: data.utterance }
        })
    },
    effects: {
        sendReplies: (state, bot, send, done) => send('api:updateBot', {
            botId: bot.id,
            ownerId: bot.customerId,
            replies: JSON.stringify(state)
        }, done)
    }
};

const intentsModel = {
    namespace: 'intents',
    state: {
        selectedIntent: 'none',
        names: ['none'],
        utterances: {
            none: []
        }
    },
    reducers: {
        setNames: (state, names) => _extends({}, state, {
            names
        }),
        selectIntent: (state, intentName) => _extends({}, state, {
            selectedIntent: intentName
        }),
        addIntent: (state, intentName) => _extends({}, state, {
            selectedIntent: intentName,
            names: [...state.names, intentName],
            utterances: _extends({}, state.utterances, {
                [intentName]: []
            })
        }),
        addUtterance: (state, data) => _extends({}, state, {
            utterances: _extends({}, state.utterances, {
                [data.intent]: state.utterances[data.intent] ? state.utterances[data.intent].concat([data.utterance]) : [data.utterance]
            })
        }),
        setUtterances: (state, utterances) => _extends({}, state, {
            utterances
        })
    },
    effects: {}
};

const usersModel = {
    namespace: 'users',
    state: {
        filteredByMutedBot: []
    },
    reducers: {
        setMuted: (state, data) => {
            console.log('setMuted', data);
            return _extends({}, state, {
                filteredByMutedBot: data
            });
        },
        unMuteUsers: (state, data) => {
            console.log('unMuteUsers', data);
            return _extends({}, state, {
                filteredByMutedBot: state.filteredByMutedBot.filter(item => {
                    console.log('item.id', item.id, data, data.includes(item.id));
                    const result = !data.includes(item.id);
                    console.log('result', result);
                    return result;
                })
            });
        }
    }
};

const inviteModel = {
    namespace: 'invite',
    state: {
        botId: null,
        ownerId: null
    },
    reducers: {
        set: (state, data) => data,
        setError: (state, error) => _extends({}, state, {
            error
        })
    },
    effects: {
        check: (state, data, send, done) => {
            const qsData = qs(data);
            const botId = qsData.bot;
            const ownerId = qsData.owner;
            if (!botId || !ownerId) {
                return done();
            }
            send('invite:set', { botId, ownerId }, done);
            send('location:set', { pathname: '/invite' }, done);
            return done();
        },
        ignore: (state, data, send, done) => {
            send('invite:set', { botId: null }, done);
            window.location.search = '';
            return done();
        }
    }
};

const defaultOptions = token => ({
    json: true,
    headers: {
        Authorization: `Bearer ${ token }`
    }
});

const createApiModel = config => ({
    namespace: 'api',
    state: {
        token: null,
        updatingBot: false,
        loadingBot: false,
        loadingUsers: false
    },
    reducers: {
        set: (state, data) => data,
        updateBotBegin: state => _extends({}, state, {
            updatingBot: true
        }),
        updateBotEnd: state => _extends({}, state, {
            updatingBot: false
        }),
        loadingUsersBegin: state => _extends({}, state, {
            loadingUsers: true
        }),
        loadingUsersEnd: state => _extends({}, state, {
            loadingUsers: false
        }),
        loadingBotBegin: state => _extends({}, state, {
            loadingBot: true
        }),
        loadingBotEnd: state => _extends({}, state, {
            loadingBot: false
        })
    },
    effects: {
        getCustomer: (state, data, send, done) => {
            const url = `${ config.apiUrl }/v1/customers`;
            const options = defaultOptions(state.token);
            http.post(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                send('customer:set', response.body, done);
                if (response.body.bots.length === 1) {
                    return send('api:getBot', { botId: response.body.bots[0] }, done);
                }
                return done();
            });
        },
        getBot: (state, data, send, done) => {
            const url = `${ config.apiUrl }/v1/bots/${ data.botId }`;
            const options = defaultOptions(state.token);
            send('api:loadingBotBegin', null, done);
            http.get(url, options, (error, response) => {
                console.log(response);
                if (error) {
                    console.log('response', response.body);
                    console.error(error);
                    return done();
                }
                const bot = response.body;
                send('ui:selectBot', bot.id, done);
                send('ui:enableSection', 'admins', done);
                if (bot.facebook) {
                    send('ui:enableSection', 'channels', done);
                } else {
                    send('ui:disableSection', 'channels', done);
                }
                if (bot.vtex) {
                    send('ui:enableSection', 'ecommerce', done);
                } else {
                    send('ui:disableSection', 'ecommerce', done);
                }
                if (bot.replies) {
                    send('ui:enableSection', 'replies', done);
                    send('replies:set', JSON.parse(bot.replies), done);
                    send('api:loadingBotEnd', null, done);
                } else {
                    send('ui:disableSection', 'replies', done);
                }
                if (bot.sage && bot.sage.spellId) {
                    send('ui:enableSection', 'intents', done);
                    send('sage:setId', bot.sage.spellId, done);
                    send('sage:getSpell', { field: 'intents' }, done);
                    send('sage:getSpell', { field: 'utterances' }, done);
                } else {
                    send('ui:disableSection', 'intents', done);
                }
                send('api:getMutedChats', bot, done);
                return send('bot:set', bot, done);
            });
        },
        getMutedChats: (state, bot, send, done) => {
            const query = {
                botId: bot.id,
                botStatus: 'muted'
            };
            const url = `${ config.apiUrl }/v1/users/?${ querystring.stringify(query) }`;
            const options = defaultOptions(state.token);
            send('api:loadingUsersBegin', null, done);
            http.get(url, options, (error, response) => {
                send('api:loadingUsersEnd', null, done);
                if (error) {
                    console.error(error);
                    return done();
                }
                send('ui:enableSection', 'mutedChats', done);
                return send('users:setMuted', response.body, done);
            });
        },
        unMuteChats: (state, data, send, done) => {
            const url = `${ config.apiUrl }/v1/users`;
            const options = defaultOptions(state.token);
            const body = _extends({}, data, {
                update: {
                    botStatus: 'active'
                }
            });
            send('api:loadingUsersBegin', null, done);
            http.put(url, _extends({}, options, { json: body }), (error, response) => {
                send('api:loadingUsersEnd', null, done);
                if (error) {
                    console.error(error);
                    return done();
                }
                send('ui:setSelectedMutedUsers', [], done);
                return send('users:unMuteUsers', response.body.map(item => item.id), done);
            });
        },
        updateBot: (state, data, send, done) => {
            const url = `${ config.apiUrl }/v1/bots/${ data.botId }`;
            const options = defaultOptions(state.token);
            const facebookUpdate = !data.facebookPage ? {} : {
                facebook: {
                    pageAccessToken: data.facebookPage.access_token,
                    pageId: data.facebookPage.id,
                    pageName: data.facebookPage.name
                }
            };
            const ownerId = data.ownerId ? { ownerId: data.ownerId } : {};
            const vtexUpdate = data.vtex ? data : {};
            const repliesUpdate = data.replies ? data : {};
            const inviteCodeUpdate = data.inviteCode ? data : {};
            const update = _extends({}, ownerId, facebookUpdate, vtexUpdate, repliesUpdate, inviteCodeUpdate);
            send('api:updateBotBegin', null, done);
            http.put(url, _extends({}, options, { json: update }), (error, response) => {
                send('api:updateBotEnd', null, done);
                if (error) {
                    console.error(error);
                    return done();
                }
                return send('bot:set', response.body, done);
            });
        },
        acceptInvite: (state, data, send, done) => {
            const url = `${ config.apiUrl }/v1/bots/${ data.botId }`;
            const options = defaultOptions(state.token);
            const update = {
                admins: 'me',
                customerId: data.ownerId,
                inviteCode: data.inviteCode
            };
            send('api:updateBotBegin', null, done);
            http.put(url, _extends({}, options, { json: update }), (error, response) => {
                send('api:updateBotEnd', null, done);
                if (error || response.body.error) {
                    console.error(error || response.body.error);
                    send('invite:setError', error || response.body.error, done);
                    return done();
                }
                window.location.search = '';
                return done();
            });
        }
    }
});

const signInToggle = (isLogged, loginParams) => {
    if (isLogged) {
        window.FB.logout();
    } else {
        window.FB.login(loginResponse => {
            if (loginResponse.authResponse) {
                console.log('Welcome!', loginResponse.authResponse);
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, loginParams);
    }
};

const createFbSessionModel = config => ({
    namespace: 'fbsession',
    subscriptions: {
        init: (send, done) => {
            window.fbAsyncInit = () => {
                window.FB.init({
                    appId: config.appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.7'
                });
                window.FB.Event.subscribe('auth.statusChange', data => send('fbsession:statusChange', data, done));
                window.FB.getLoginStatus();
            };
            done();
        }
    },
    effects: {
        statusChange: (state, data, send, done) => {
            if (data.status === 'connected') {
                send('customer:signIn', data.authResponse, done);
                send('invite:check', window.location.href, done);
                send('api:set', { token: data.authResponse.accessToken }, done);
                send('fbsession:getPages', null, done);
                return send('api:getCustomer', null, done);
            }
            return send('customer:signOut', data, done);
        },
        getPages: (state, data, send, done) => {
            console.log('getPages');
            window.FB.api('/me/accounts', 'get', {}, response => {
                console.log('response', response);
                return send('ui:setFbPages', response.data, done);
            });
        },
        signIn: (state, data, send) => signInToggle(false, config.loginParams, send),
        signInToggle: (state, data, send) => signInToggle(data.isLogged, config.loginParams, send)
    }
});

const defaultOptions$1 = spellId => ({
    json: true,
    headers: {
        'BOT-ID': spellId
    }
});

const createSageModel = config => ({
    namespace: 'sage',
    state: {
        spellId: null,
        updatingSpell: false,
        loadingUtterances: false,
        loadingIntents: false
    },
    reducers: {
        set: (state, data) => data,
        setId: (state, spellId) => _extends({}, state, {
            spellId
        }),
        updatingSpellBegin: state => _extends({}, state, {
            updatingSpell: true
        }),
        updatingSpellEnd: state => _extends({}, state, {
            updatingSpell: false
        }),
        loadingUtterancesBegin: state => _extends({}, state, {
            loadingUtterances: true
        }),
        loadingUtterancesEnd: state => _extends({}, state, {
            loadingUtterances: false
        }),
        loadingIntentsBegin: state => _extends({}, state, {
            loadingIntents: true
        }),
        loadingIntentsEnd: state => _extends({}, state, {
            loadingIntents: false
        })
    },
    effects: {
        // Creates a new spell
        createSpell: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots`;
            const body = {
                name: data.name,
                desc: data.description
            };
            http.post(url, { json: body }, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                /*
                EXAMPLE RESPONSE
                {
                    "bot_status": 0, // ignore here
                    "bot_id": "ebbb9cd6-91d0-49f1-bc5f-ead1689db222" // used in every request
                }
                */
                console.log(response.body);
                return done();
            });
        },
        getSpell: (state, data, send, done) => {
            const field = data.field ? data.field : 'all';
            const url = `${ config.apiUrl }/bots/${ field }`;
            const options = defaultOptions$1(state.spellId);
            console.log('getSpell options', options);
            http.get(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                /* EXAMPLE RESPONSE (field = intents)
                [
                  {
                    "name": "none",
                    "children": []
                  },
                  ...
                ]
                */
                if (data.field === 'intents') {
                    const intentNames = response.body.map(intentObj => intentObj.name);
                    return send('intents:setNames', intentNames, done);
                }
                /* EXAMPLE RESPONSE (field = utterances)
                [
                  {
                    "text": "none",
                    "intent": "none",
                    "context": "",
                    "entities": []
                  },
                  ...
                ]
                */
                if (data.field === 'utterances') {
                    const utterances = response.body.reduce((prev, utterance) => {
                        const intentName = utterance.intent;
                        const utteranceText = utterance.text;
                        const oldIntentUtterances = prev[intentName] || [];
                        const intentUtterances = oldIntentUtterances.concat([utteranceText]);
                        return Object.assign(prev, { [intentName]: intentUtterances });
                    }, {});
                    return send('intents:setUtterances', utterances, done);
                }
                console.log('data.field', data.field);
                return done();
            });
        },
        /* All request below will return a status 200 if ok,
           else 40X or 50X with an success/error message*/
        createIntent: (state, intentName, send, done) => {
            console.log('Sage Create Intent', intentName);
            const url = `${ config.apiUrl }/bots/intents`;
            const options = defaultOptions$1(state.spellId);
            const body = [{
                name: intentName,
                children: []
            }];
            http.post(url, _extends({}, options, { json: body }), (err, response) => {
                const error = err || response.body.error || typeof response.body === 'string' && response.body.indexOf('error') !== -1;
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                console.log(response.body);
                // example of success return:
                // "Success:intents updated (0:skipped)"
                send('intents:addIntent', intentName, done);
                return done();
            });
        },
        deleteIntent: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots/intents/${ data.intent }`;
            const options = defaultOptions$1(state.spellId);
            http.delete(url, options, (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                // return send('api:getBot', { botId: response.body.bots[0] }, done);
                console.log(response.body);
                return done();
            });
        },
        createUtterance: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots/utterances`;
            const options = defaultOptions$1(state.spellId);
            const body = [{
                text: data.utterance,
                intent: data.intent,
                entities: [],
                context: ''
            }];
            http.post(url, _extends({}, options, { json: body }), (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                // example of sucess response:
                // "Success:[{'text': u'foo and chill?'}]"
                console.log('Create utterance response', response.body);
                send('intents:addUtterance', {
                    intent: data.intent, utterance: data.utterance
                }, done);
                return done();
            });
        },
        updateUtterance: (state, data, send, done) => {
            const url = `${ config.apiUrl }/bots/utteraces/${ data.utterance }`;
            const options = defaultOptions$1(state.spellId);
            const body = { intent: data.intent };
            http.put(url, _extends({}, options, { json: body }), (error, response) => {
                if (error) {
                    console.error(error);
                    return done();
                }
                // FIXME
                console.log(response.body);
                return done();
            });
        }
    }
});

var fbSDK = html`
<script>(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>`;

var fontAwesome = html`
<link
    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
    rel="stylesheet"
    integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1"
    crossorigin="anonymous"
>`;

// load bootstrap css in the global scope (keep this comment)
(require('insert-css')("/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n *//*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{margin:.67em 0;font-size:2em}mark{color:#000;background:#ff0}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{height:0;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{margin:0;font:inherit;color:inherit}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}input{line-height:normal}input[type=checkbox],input[type=radio]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-appearance:textfield}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{padding:.35em .625em .75em;margin:0 2px;border:1px solid silver}legend{padding:0;border:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-spacing:0;border-collapse:collapse}td,th{padding:0}/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */@media print{*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;-webkit-box-shadow:none!important;box-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}abbr[title]:after{content:\" (\" attr(title) \")\"}a[href^=\"javascript:\"]:after,a[href^=\"#\"]:after{content:\"\"}blockquote,pre{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}img,tr{page-break-inside:avoid}img{max-width:100%!important}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}.navbar{display:none}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000!important}.label{border:1px solid #000}.table{border-collapse:collapse!important}.table td,.table th{background-color:#fff!important}.table-bordered td,.table-bordered th{border:1px solid #ddd!important}}@font-face{font-family:'Glyphicons Halflings';src:url(../fonts/glyphicons-halflings-regular.eot);src:url(../fonts/glyphicons-halflings-regular.eot?#iefix) format('embedded-opentype'),url(../fonts/glyphicons-halflings-regular.woff2) format('woff2'),url(../fonts/glyphicons-halflings-regular.woff) format('woff'),url(../fonts/glyphicons-halflings-regular.ttf) format('truetype'),url(../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular) format('svg')}.glyphicon{position:relative;top:1px;display:inline-block;font-family:'Glyphicons Halflings';font-style:normal;font-weight:400;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.glyphicon-asterisk:before{content:\"\\002a\"}.glyphicon-plus:before{content:\"\\002b\"}.glyphicon-eur:before,.glyphicon-euro:before{content:\"\\20ac\"}.glyphicon-minus:before{content:\"\\2212\"}.glyphicon-cloud:before{content:\"\\2601\"}.glyphicon-envelope:before{content:\"\\2709\"}.glyphicon-pencil:before{content:\"\\270f\"}.glyphicon-glass:before{content:\"\\e001\"}.glyphicon-music:before{content:\"\\e002\"}.glyphicon-search:before{content:\"\\e003\"}.glyphicon-heart:before{content:\"\\e005\"}.glyphicon-star:before{content:\"\\e006\"}.glyphicon-star-empty:before{content:\"\\e007\"}.glyphicon-user:before{content:\"\\e008\"}.glyphicon-film:before{content:\"\\e009\"}.glyphicon-th-large:before{content:\"\\e010\"}.glyphicon-th:before{content:\"\\e011\"}.glyphicon-th-list:before{content:\"\\e012\"}.glyphicon-ok:before{content:\"\\e013\"}.glyphicon-remove:before{content:\"\\e014\"}.glyphicon-zoom-in:before{content:\"\\e015\"}.glyphicon-zoom-out:before{content:\"\\e016\"}.glyphicon-off:before{content:\"\\e017\"}.glyphicon-signal:before{content:\"\\e018\"}.glyphicon-cog:before{content:\"\\e019\"}.glyphicon-trash:before{content:\"\\e020\"}.glyphicon-home:before{content:\"\\e021\"}.glyphicon-file:before{content:\"\\e022\"}.glyphicon-time:before{content:\"\\e023\"}.glyphicon-road:before{content:\"\\e024\"}.glyphicon-download-alt:before{content:\"\\e025\"}.glyphicon-download:before{content:\"\\e026\"}.glyphicon-upload:before{content:\"\\e027\"}.glyphicon-inbox:before{content:\"\\e028\"}.glyphicon-play-circle:before{content:\"\\e029\"}.glyphicon-repeat:before{content:\"\\e030\"}.glyphicon-refresh:before{content:\"\\e031\"}.glyphicon-list-alt:before{content:\"\\e032\"}.glyphicon-lock:before{content:\"\\e033\"}.glyphicon-flag:before{content:\"\\e034\"}.glyphicon-headphones:before{content:\"\\e035\"}.glyphicon-volume-off:before{content:\"\\e036\"}.glyphicon-volume-down:before{content:\"\\e037\"}.glyphicon-volume-up:before{content:\"\\e038\"}.glyphicon-qrcode:before{content:\"\\e039\"}.glyphicon-barcode:before{content:\"\\e040\"}.glyphicon-tag:before{content:\"\\e041\"}.glyphicon-tags:before{content:\"\\e042\"}.glyphicon-book:before{content:\"\\e043\"}.glyphicon-bookmark:before{content:\"\\e044\"}.glyphicon-print:before{content:\"\\e045\"}.glyphicon-camera:before{content:\"\\e046\"}.glyphicon-font:before{content:\"\\e047\"}.glyphicon-bold:before{content:\"\\e048\"}.glyphicon-italic:before{content:\"\\e049\"}.glyphicon-text-height:before{content:\"\\e050\"}.glyphicon-text-width:before{content:\"\\e051\"}.glyphicon-align-left:before{content:\"\\e052\"}.glyphicon-align-center:before{content:\"\\e053\"}.glyphicon-align-right:before{content:\"\\e054\"}.glyphicon-align-justify:before{content:\"\\e055\"}.glyphicon-list:before{content:\"\\e056\"}.glyphicon-indent-left:before{content:\"\\e057\"}.glyphicon-indent-right:before{content:\"\\e058\"}.glyphicon-facetime-video:before{content:\"\\e059\"}.glyphicon-picture:before{content:\"\\e060\"}.glyphicon-map-marker:before{content:\"\\e062\"}.glyphicon-adjust:before{content:\"\\e063\"}.glyphicon-tint:before{content:\"\\e064\"}.glyphicon-edit:before{content:\"\\e065\"}.glyphicon-share:before{content:\"\\e066\"}.glyphicon-check:before{content:\"\\e067\"}.glyphicon-move:before{content:\"\\e068\"}.glyphicon-step-backward:before{content:\"\\e069\"}.glyphicon-fast-backward:before{content:\"\\e070\"}.glyphicon-backward:before{content:\"\\e071\"}.glyphicon-play:before{content:\"\\e072\"}.glyphicon-pause:before{content:\"\\e073\"}.glyphicon-stop:before{content:\"\\e074\"}.glyphicon-forward:before{content:\"\\e075\"}.glyphicon-fast-forward:before{content:\"\\e076\"}.glyphicon-step-forward:before{content:\"\\e077\"}.glyphicon-eject:before{content:\"\\e078\"}.glyphicon-chevron-left:before{content:\"\\e079\"}.glyphicon-chevron-right:before{content:\"\\e080\"}.glyphicon-plus-sign:before{content:\"\\e081\"}.glyphicon-minus-sign:before{content:\"\\e082\"}.glyphicon-remove-sign:before{content:\"\\e083\"}.glyphicon-ok-sign:before{content:\"\\e084\"}.glyphicon-question-sign:before{content:\"\\e085\"}.glyphicon-info-sign:before{content:\"\\e086\"}.glyphicon-screenshot:before{content:\"\\e087\"}.glyphicon-remove-circle:before{content:\"\\e088\"}.glyphicon-ok-circle:before{content:\"\\e089\"}.glyphicon-ban-circle:before{content:\"\\e090\"}.glyphicon-arrow-left:before{content:\"\\e091\"}.glyphicon-arrow-right:before{content:\"\\e092\"}.glyphicon-arrow-up:before{content:\"\\e093\"}.glyphicon-arrow-down:before{content:\"\\e094\"}.glyphicon-share-alt:before{content:\"\\e095\"}.glyphicon-resize-full:before{content:\"\\e096\"}.glyphicon-resize-small:before{content:\"\\e097\"}.glyphicon-exclamation-sign:before{content:\"\\e101\"}.glyphicon-gift:before{content:\"\\e102\"}.glyphicon-leaf:before{content:\"\\e103\"}.glyphicon-fire:before{content:\"\\e104\"}.glyphicon-eye-open:before{content:\"\\e105\"}.glyphicon-eye-close:before{content:\"\\e106\"}.glyphicon-warning-sign:before{content:\"\\e107\"}.glyphicon-plane:before{content:\"\\e108\"}.glyphicon-calendar:before{content:\"\\e109\"}.glyphicon-random:before{content:\"\\e110\"}.glyphicon-comment:before{content:\"\\e111\"}.glyphicon-magnet:before{content:\"\\e112\"}.glyphicon-chevron-up:before{content:\"\\e113\"}.glyphicon-chevron-down:before{content:\"\\e114\"}.glyphicon-retweet:before{content:\"\\e115\"}.glyphicon-shopping-cart:before{content:\"\\e116\"}.glyphicon-folder-close:before{content:\"\\e117\"}.glyphicon-folder-open:before{content:\"\\e118\"}.glyphicon-resize-vertical:before{content:\"\\e119\"}.glyphicon-resize-horizontal:before{content:\"\\e120\"}.glyphicon-hdd:before{content:\"\\e121\"}.glyphicon-bullhorn:before{content:\"\\e122\"}.glyphicon-bell:before{content:\"\\e123\"}.glyphicon-certificate:before{content:\"\\e124\"}.glyphicon-thumbs-up:before{content:\"\\e125\"}.glyphicon-thumbs-down:before{content:\"\\e126\"}.glyphicon-hand-right:before{content:\"\\e127\"}.glyphicon-hand-left:before{content:\"\\e128\"}.glyphicon-hand-up:before{content:\"\\e129\"}.glyphicon-hand-down:before{content:\"\\e130\"}.glyphicon-circle-arrow-right:before{content:\"\\e131\"}.glyphicon-circle-arrow-left:before{content:\"\\e132\"}.glyphicon-circle-arrow-up:before{content:\"\\e133\"}.glyphicon-circle-arrow-down:before{content:\"\\e134\"}.glyphicon-globe:before{content:\"\\e135\"}.glyphicon-wrench:before{content:\"\\e136\"}.glyphicon-tasks:before{content:\"\\e137\"}.glyphicon-filter:before{content:\"\\e138\"}.glyphicon-briefcase:before{content:\"\\e139\"}.glyphicon-fullscreen:before{content:\"\\e140\"}.glyphicon-dashboard:before{content:\"\\e141\"}.glyphicon-paperclip:before{content:\"\\e142\"}.glyphicon-heart-empty:before{content:\"\\e143\"}.glyphicon-link:before{content:\"\\e144\"}.glyphicon-phone:before{content:\"\\e145\"}.glyphicon-pushpin:before{content:\"\\e146\"}.glyphicon-usd:before{content:\"\\e148\"}.glyphicon-gbp:before{content:\"\\e149\"}.glyphicon-sort:before{content:\"\\e150\"}.glyphicon-sort-by-alphabet:before{content:\"\\e151\"}.glyphicon-sort-by-alphabet-alt:before{content:\"\\e152\"}.glyphicon-sort-by-order:before{content:\"\\e153\"}.glyphicon-sort-by-order-alt:before{content:\"\\e154\"}.glyphicon-sort-by-attributes:before{content:\"\\e155\"}.glyphicon-sort-by-attributes-alt:before{content:\"\\e156\"}.glyphicon-unchecked:before{content:\"\\e157\"}.glyphicon-expand:before{content:\"\\e158\"}.glyphicon-collapse-down:before{content:\"\\e159\"}.glyphicon-collapse-up:before{content:\"\\e160\"}.glyphicon-log-in:before{content:\"\\e161\"}.glyphicon-flash:before{content:\"\\e162\"}.glyphicon-log-out:before{content:\"\\e163\"}.glyphicon-new-window:before{content:\"\\e164\"}.glyphicon-record:before{content:\"\\e165\"}.glyphicon-save:before{content:\"\\e166\"}.glyphicon-open:before{content:\"\\e167\"}.glyphicon-saved:before{content:\"\\e168\"}.glyphicon-import:before{content:\"\\e169\"}.glyphicon-export:before{content:\"\\e170\"}.glyphicon-send:before{content:\"\\e171\"}.glyphicon-floppy-disk:before{content:\"\\e172\"}.glyphicon-floppy-saved:before{content:\"\\e173\"}.glyphicon-floppy-remove:before{content:\"\\e174\"}.glyphicon-floppy-save:before{content:\"\\e175\"}.glyphicon-floppy-open:before{content:\"\\e176\"}.glyphicon-credit-card:before{content:\"\\e177\"}.glyphicon-transfer:before{content:\"\\e178\"}.glyphicon-cutlery:before{content:\"\\e179\"}.glyphicon-header:before{content:\"\\e180\"}.glyphicon-compressed:before{content:\"\\e181\"}.glyphicon-earphone:before{content:\"\\e182\"}.glyphicon-phone-alt:before{content:\"\\e183\"}.glyphicon-tower:before{content:\"\\e184\"}.glyphicon-stats:before{content:\"\\e185\"}.glyphicon-sd-video:before{content:\"\\e186\"}.glyphicon-hd-video:before{content:\"\\e187\"}.glyphicon-subtitles:before{content:\"\\e188\"}.glyphicon-sound-stereo:before{content:\"\\e189\"}.glyphicon-sound-dolby:before{content:\"\\e190\"}.glyphicon-sound-5-1:before{content:\"\\e191\"}.glyphicon-sound-6-1:before{content:\"\\e192\"}.glyphicon-sound-7-1:before{content:\"\\e193\"}.glyphicon-copyright-mark:before{content:\"\\e194\"}.glyphicon-registration-mark:before{content:\"\\e195\"}.glyphicon-cloud-download:before{content:\"\\e197\"}.glyphicon-cloud-upload:before{content:\"\\e198\"}.glyphicon-tree-conifer:before{content:\"\\e199\"}.glyphicon-tree-deciduous:before{content:\"\\e200\"}.glyphicon-cd:before{content:\"\\e201\"}.glyphicon-save-file:before{content:\"\\e202\"}.glyphicon-open-file:before{content:\"\\e203\"}.glyphicon-level-up:before{content:\"\\e204\"}.glyphicon-copy:before{content:\"\\e205\"}.glyphicon-paste:before{content:\"\\e206\"}.glyphicon-alert:before{content:\"\\e209\"}.glyphicon-equalizer:before{content:\"\\e210\"}.glyphicon-king:before{content:\"\\e211\"}.glyphicon-queen:before{content:\"\\e212\"}.glyphicon-pawn:before{content:\"\\e213\"}.glyphicon-bishop:before{content:\"\\e214\"}.glyphicon-knight:before{content:\"\\e215\"}.glyphicon-baby-formula:before{content:\"\\e216\"}.glyphicon-tent:before{content:\"\\26fa\"}.glyphicon-blackboard:before{content:\"\\e218\"}.glyphicon-bed:before{content:\"\\e219\"}.glyphicon-apple:before{content:\"\\f8ff\"}.glyphicon-erase:before{content:\"\\e221\"}.glyphicon-hourglass:before{content:\"\\231b\"}.glyphicon-lamp:before{content:\"\\e223\"}.glyphicon-duplicate:before{content:\"\\e224\"}.glyphicon-piggy-bank:before{content:\"\\e225\"}.glyphicon-scissors:before{content:\"\\e226\"}.glyphicon-bitcoin:before{content:\"\\e227\"}.glyphicon-btc:before{content:\"\\e227\"}.glyphicon-xbt:before{content:\"\\e227\"}.glyphicon-yen:before{content:\"\\00a5\"}.glyphicon-jpy:before{content:\"\\00a5\"}.glyphicon-ruble:before{content:\"\\20bd\"}.glyphicon-rub:before{content:\"\\20bd\"}.glyphicon-scale:before{content:\"\\e230\"}.glyphicon-ice-lolly:before{content:\"\\e231\"}.glyphicon-ice-lolly-tasted:before{content:\"\\e232\"}.glyphicon-education:before{content:\"\\e233\"}.glyphicon-option-horizontal:before{content:\"\\e234\"}.glyphicon-option-vertical:before{content:\"\\e235\"}.glyphicon-menu-hamburger:before{content:\"\\e236\"}.glyphicon-modal-window:before{content:\"\\e237\"}.glyphicon-oil:before{content:\"\\e238\"}.glyphicon-grain:before{content:\"\\e239\"}.glyphicon-sunglasses:before{content:\"\\e240\"}.glyphicon-text-size:before{content:\"\\e241\"}.glyphicon-text-color:before{content:\"\\e242\"}.glyphicon-text-background:before{content:\"\\e243\"}.glyphicon-object-align-top:before{content:\"\\e244\"}.glyphicon-object-align-bottom:before{content:\"\\e245\"}.glyphicon-object-align-horizontal:before{content:\"\\e246\"}.glyphicon-object-align-left:before{content:\"\\e247\"}.glyphicon-object-align-vertical:before{content:\"\\e248\"}.glyphicon-object-align-right:before{content:\"\\e249\"}.glyphicon-triangle-right:before{content:\"\\e250\"}.glyphicon-triangle-left:before{content:\"\\e251\"}.glyphicon-triangle-bottom:before{content:\"\\e252\"}.glyphicon-triangle-top:before{content:\"\\e253\"}.glyphicon-console:before{content:\"\\e254\"}.glyphicon-superscript:before{content:\"\\e255\"}.glyphicon-subscript:before{content:\"\\e256\"}.glyphicon-menu-left:before{content:\"\\e257\"}.glyphicon-menu-right:before{content:\"\\e258\"}.glyphicon-menu-down:before{content:\"\\e259\"}.glyphicon-menu-up:before{content:\"\\e260\"}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}button,input,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}a{color:#337ab7;text-decoration:none}a:focus,a:hover{color:#23527c;text-decoration:underline}a:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.carousel-inner>.item>a>img,.carousel-inner>.item>img,.img-responsive,.thumbnail a>img,.thumbnail>img{display:block;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{display:inline-block;max-width:100%;height:auto;padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.img-circle{border-radius:50%}hr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}[role=button]{cursor:pointer}.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-weight:400;line-height:1;color:#777}.h1,.h2,.h3,h1,h2,h3{margin-top:20px;margin-bottom:10px}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small{font-size:65%}.h4,.h5,.h6,h4,h5,h6{margin-top:10px;margin-bottom:10px}.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-size:75%}.h1,h1{font-size:36px}.h2,h2{font-size:30px}.h3,h3{font-size:24px}.h4,h4{font-size:18px}.h5,h5{font-size:14px}.h6,h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}.small,small{font-size:85%}.mark,mark{padding:.2em;background-color:#fcf8e3}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#337ab7}a.text-primary:focus,a.text-primary:hover{color:#286090}.text-success{color:#3c763d}a.text-success:focus,a.text-success:hover{color:#2b542c}.text-info{color:#31708f}a.text-info:focus,a.text-info:hover{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:focus,a.text-warning:hover{color:#66512c}.text-danger{color:#a94442}a.text-danger:focus,a.text-danger:hover{color:#843534}.bg-primary{color:#fff;background-color:#337ab7}a.bg-primary:focus,a.bg-primary:hover{background-color:#286090}.bg-success{background-color:#dff0d8}a.bg-success:focus,a.bg-success:hover{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:focus,a.bg-info:hover{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:focus,a.bg-warning:hover{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:focus,a.bg-danger:hover{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ol,ul{margin-top:0;margin-bottom:10px}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;margin-left:-5px;list-style:none}.list-inline>li{display:inline-block;padding-right:5px;padding-left:5px}dl{margin-top:0;margin-bottom:20px}dd,dt{line-height:1.42857143}dt{font-weight:700}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[data-original-title],abbr[title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote ol:last-child,blockquote p:last-child,blockquote ul:last-child{margin-bottom:0}blockquote .small,blockquote footer,blockquote small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote .small:before,blockquote footer:before,blockquote small:before{content:'\\2014 \\00A0'}.blockquote-reverse,blockquote.pull-right{padding-right:15px;padding-left:0;text-align:right;border-right:5px solid #eee;border-left:0}.blockquote-reverse .small:before,.blockquote-reverse footer:before,.blockquote-reverse small:before,blockquote.pull-right .small:before,blockquote.pull-right footer:before,blockquote.pull-right small:before{content:''}.blockquote-reverse .small:after,.blockquote-reverse footer:after,.blockquote-reverse small:after,blockquote.pull-right .small:after,blockquote.pull-right footer:after,blockquote.pull-right small:after{content:'\\00A0 \\2014'}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}kbd{padding:2px 4px;font-size:90%;color:#fff;background-color:#333;border-radius:3px;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.25);box-shadow:inset 0 -1px 0 rgba(0,0,0,.25)}kbd kbd{padding:0;font-size:100%;font-weight:700;-webkit-box-shadow:none;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;color:#333;word-break:break-all;word-wrap:break-word;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width:768px){.container{width:750px}}@media (min-width:992px){.container{width:970px}}@media (min-width:1200px){.container{width:1170px}}.container-fluid{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}.row{margin-right:-15px;margin-left:-15px}.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{position:relative;min-height:1px;padding-right:15px;padding-left:15px}.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}caption{padding-top:8px;padding-bottom:8px;color:#777;text-align:left}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>tbody>tr>td,.table>tbody>tr>th,.table>tfoot>tr>td,.table>tfoot>tr>th,.table>thead>tr>td,.table>thead>tr>th{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>td,.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>td,.table>thead:first-child>tr:first-child>th{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>tbody>tr>td,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>td,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>thead>tr>th{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border:1px solid #ddd}.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border-bottom-width:2px}.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}.table-hover>tbody>tr:hover{background-color:#f5f5f5}table col[class*=col-]{position:static;display:table-column;float:none}table td[class*=col-],table th[class*=col-]{position:static;display:table-cell;float:none}.table>tbody>tr.active>td,.table>tbody>tr.active>th,.table>tbody>tr>td.active,.table>tbody>tr>th.active,.table>tfoot>tr.active>td,.table>tfoot>tr.active>th,.table>tfoot>tr>td.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>thead>tr.active>th,.table>thead>tr>td.active,.table>thead>tr>th.active{background-color:#f5f5f5}.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr.active:hover>th,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover{background-color:#e8e8e8}.table>tbody>tr.success>td,.table>tbody>tr.success>th,.table>tbody>tr>td.success,.table>tbody>tr>th.success,.table>tfoot>tr.success>td,.table>tfoot>tr.success>th,.table>tfoot>tr>td.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>thead>tr.success>th,.table>thead>tr>td.success,.table>thead>tr>th.success{background-color:#dff0d8}.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr.success:hover>th,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover{background-color:#d0e9c6}.table>tbody>tr.info>td,.table>tbody>tr.info>th,.table>tbody>tr>td.info,.table>tbody>tr>th.info,.table>tfoot>tr.info>td,.table>tfoot>tr.info>th,.table>tfoot>tr>td.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>thead>tr.info>th,.table>thead>tr>td.info,.table>thead>tr>th.info{background-color:#d9edf7}.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr.info:hover>th,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover{background-color:#c4e3f3}.table>tbody>tr.warning>td,.table>tbody>tr.warning>th,.table>tbody>tr>td.warning,.table>tbody>tr>th.warning,.table>tfoot>tr.warning>td,.table>tfoot>tr.warning>th,.table>tfoot>tr>td.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>thead>tr.warning>th,.table>thead>tr>td.warning,.table>thead>tr>th.warning{background-color:#fcf8e3}.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr.warning:hover>th,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover{background-color:#faf2cc}.table>tbody>tr.danger>td,.table>tbody>tr.danger>th,.table>tbody>tr>td.danger,.table>tbody>tr>th.danger,.table>tfoot>tr.danger>td,.table>tfoot>tr.danger>th,.table>tfoot>tr>td.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>thead>tr.danger>th,.table>thead>tr>td.danger,.table>thead>tr>th.danger{background-color:#f2dede}.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr.danger:hover>th,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover{background-color:#ebcccc}.table-responsive{min-height:.01%;overflow-x:auto}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>td,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>thead>tr>th{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}}fieldset{min-width:0;padding:0;margin:0;border:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:700}input[type=search]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=checkbox],input[type=radio]{margin:4px 0 0;margin-top:1px\\9;line-height:normal}input[type=file]{display:block}input[type=range]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type=file]:focus,input[type=checkbox]:focus,input[type=radio]:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition:border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}.form-control::-moz-placeholder{color:#999;opacity:1}.form-control:-ms-input-placeholder{color:#999}.form-control::-webkit-input-placeholder{color:#999}.form-control::-ms-expand{background-color:transparent;border:0}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#eee;opacity:1}.form-control[disabled],fieldset[disabled] .form-control{cursor:not-allowed}textarea.form-control{height:auto}input[type=search]{-webkit-appearance:none}@media screen and (-webkit-min-device-pixel-ratio:0){input[type=date].form-control,input[type=time].form-control,input[type=datetime-local].form-control,input[type=month].form-control{line-height:34px}.input-group-sm input[type=date],.input-group-sm input[type=time],.input-group-sm input[type=datetime-local],.input-group-sm input[type=month],input[type=date].input-sm,input[type=time].input-sm,input[type=datetime-local].input-sm,input[type=month].input-sm{line-height:30px}.input-group-lg input[type=date],.input-group-lg input[type=time],.input-group-lg input[type=datetime-local],.input-group-lg input[type=month],input[type=date].input-lg,input[type=time].input-lg,input[type=datetime-local].input-lg,input[type=month].input-lg{line-height:46px}}.form-group{margin-bottom:15px}.checkbox,.radio{position:relative;display:block;margin-top:10px;margin-bottom:10px}.checkbox label,.radio label{min-height:20px;padding-left:20px;margin-bottom:0;font-weight:400;cursor:pointer}.checkbox input[type=checkbox],.checkbox-inline input[type=checkbox],.radio input[type=radio],.radio-inline input[type=radio]{position:absolute;margin-top:4px\\9;margin-left:-20px}.checkbox+.checkbox,.radio+.radio{margin-top:-5px}.checkbox-inline,.radio-inline{position:relative;display:inline-block;padding-left:20px;margin-bottom:0;font-weight:400;vertical-align:middle;cursor:pointer}.checkbox-inline+.checkbox-inline,.radio-inline+.radio-inline{margin-top:0;margin-left:10px}fieldset[disabled] input[type=checkbox],fieldset[disabled] input[type=radio],input[type=checkbox].disabled,input[type=checkbox][disabled],input[type=radio].disabled,input[type=radio][disabled]{cursor:not-allowed}.checkbox-inline.disabled,.radio-inline.disabled,fieldset[disabled] .checkbox-inline,fieldset[disabled] .radio-inline{cursor:not-allowed}.checkbox.disabled label,.radio.disabled label,fieldset[disabled] .checkbox label,fieldset[disabled] .radio label{cursor:not-allowed}.form-control-static{min-height:34px;padding-top:7px;padding-bottom:7px;margin-bottom:0}.form-control-static.input-lg,.form-control-static.input-sm{padding-right:0;padding-left:0}.input-sm{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}select[multiple].input-sm,textarea.input-sm{height:auto}.form-group-sm .form-control{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.form-group-sm select.form-control{height:30px;line-height:30px}.form-group-sm select[multiple].form-control,.form-group-sm textarea.form-control{height:auto}.form-group-sm .form-control-static{height:30px;min-height:32px;padding:6px 10px;font-size:12px;line-height:1.5}.input-lg{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-lg{height:46px;line-height:46px}select[multiple].input-lg,textarea.input-lg{height:auto}.form-group-lg .form-control{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.form-group-lg select.form-control{height:46px;line-height:46px}.form-group-lg select[multiple].form-control,.form-group-lg textarea.form-control{height:auto}.form-group-lg .form-control-static{height:46px;min-height:38px;padding:11px 16px;font-size:18px;line-height:1.3333333}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:0;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center;pointer-events:none}.form-group-lg .form-control+.form-control-feedback,.input-group-lg+.form-control-feedback,.input-lg+.form-control-feedback{width:46px;height:46px;line-height:46px}.form-group-sm .form-control+.form-control-feedback,.input-group-sm+.form-control-feedback,.input-sm+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .checkbox,.has-success .checkbox-inline,.has-success .control-label,.has-success .help-block,.has-success .radio,.has-success .radio-inline,.has-success.checkbox label,.has-success.checkbox-inline label,.has-success.radio label,.has-success.radio-inline label{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;background-color:#dff0d8;border-color:#3c763d}.has-success .form-control-feedback{color:#3c763d}.has-warning .checkbox,.has-warning .checkbox-inline,.has-warning .control-label,.has-warning .help-block,.has-warning .radio,.has-warning .radio-inline,.has-warning.checkbox label,.has-warning.checkbox-inline label,.has-warning.radio label,.has-warning.radio-inline label{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;background-color:#fcf8e3;border-color:#8a6d3b}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .checkbox,.has-error .checkbox-inline,.has-error .control-label,.has-error .help-block,.has-error .radio,.has-error .radio-inline,.has-error.checkbox label,.has-error.checkbox-inline label,.has-error.radio label,.has-error.radio-inline label{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;background-color:#f2dede;border-color:#a94442}.has-error .form-control-feedback{color:#a94442}.has-feedback label~.form-control-feedback{top:25px}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-static{display:inline-block}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .form-control,.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .checkbox,.form-inline .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .checkbox label,.form-inline .radio label{padding-left:0}.form-inline .checkbox input[type=checkbox],.form-inline .radio input[type=radio]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .checkbox,.form-horizontal .checkbox-inline,.form-horizontal .radio,.form-horizontal .radio-inline{padding-top:7px;margin-top:0;margin-bottom:0}.form-horizontal .checkbox,.form-horizontal .radio{min-height:27px}.form-horizontal .form-group{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.form-horizontal .control-label{padding-top:7px;margin-bottom:0;text-align:right}}.form-horizontal .has-feedback .form-control-feedback{right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:11px;font-size:18px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px;font-size:12px}}.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.btn.active.focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn:active:focus,.btn:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn.focus,.btn:focus,.btn:hover{color:#333;text-decoration:none}.btn.active,.btn:active{background-image:none;outline:0;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none;opacity:.65}a.btn.disabled,fieldset[disabled] a.btn{pointer-events:none}.btn-default{color:#333;background-color:#fff;border-color:#ccc}.btn-default.focus,.btn-default:focus{color:#333;background-color:#e6e6e6;border-color:#8c8c8c}.btn-default:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active.focus,.btn-default.active:focus,.btn-default.active:hover,.btn-default:active.focus,.btn-default:active:focus,.btn-default:active:hover,.open>.dropdown-toggle.btn-default.focus,.open>.dropdown-toggle.btn-default:focus,.open>.dropdown-toggle.btn-default:hover{color:#333;background-color:#d4d4d4;border-color:#8c8c8c}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled.focus,.btn-default.disabled:focus,.btn-default.disabled:hover,.btn-default[disabled].focus,.btn-default[disabled]:focus,.btn-default[disabled]:hover,fieldset[disabled] .btn-default.focus,fieldset[disabled] .btn-default:focus,fieldset[disabled] .btn-default:hover{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#333}.btn-primary{color:#fff;background-color:#337ab7;border-color:#2e6da4}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#286090;border-color:#122b40}.btn-primary:hover{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active.focus,.btn-primary.active:focus,.btn-primary.active:hover,.btn-primary:active.focus,.btn-primary:active:focus,.btn-primary:active:hover,.open>.dropdown-toggle.btn-primary.focus,.open>.dropdown-toggle.btn-primary:focus,.open>.dropdown-toggle.btn-primary:hover{color:#fff;background-color:#204d74;border-color:#122b40}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled.focus,.btn-primary.disabled:focus,.btn-primary.disabled:hover,.btn-primary[disabled].focus,.btn-primary[disabled]:focus,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary.focus,fieldset[disabled] .btn-primary:focus,fieldset[disabled] .btn-primary:hover{background-color:#337ab7;border-color:#2e6da4}.btn-primary .badge{color:#337ab7;background-color:#fff}.btn-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#449d44;border-color:#255625}.btn-success:hover{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active.focus,.btn-success.active:focus,.btn-success.active:hover,.btn-success:active.focus,.btn-success:active:focus,.btn-success:active:hover,.open>.dropdown-toggle.btn-success.focus,.open>.dropdown-toggle.btn-success:focus,.open>.dropdown-toggle.btn-success:hover{color:#fff;background-color:#398439;border-color:#255625}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled.focus,.btn-success.disabled:focus,.btn-success.disabled:hover,.btn-success[disabled].focus,.btn-success[disabled]:focus,.btn-success[disabled]:hover,fieldset[disabled] .btn-success.focus,fieldset[disabled] .btn-success:focus,fieldset[disabled] .btn-success:hover{background-color:#5cb85c;border-color:#4cae4c}.btn-success .badge{color:#5cb85c;background-color:#fff}.btn-info{color:#fff;background-color:#5bc0de;border-color:#46b8da}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#31b0d5;border-color:#1b6d85}.btn-info:hover{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active.focus,.btn-info.active:focus,.btn-info.active:hover,.btn-info:active.focus,.btn-info:active:focus,.btn-info:active:hover,.open>.dropdown-toggle.btn-info.focus,.open>.dropdown-toggle.btn-info:focus,.open>.dropdown-toggle.btn-info:hover{color:#fff;background-color:#269abc;border-color:#1b6d85}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled.focus,.btn-info.disabled:focus,.btn-info.disabled:hover,.btn-info[disabled].focus,.btn-info[disabled]:focus,.btn-info[disabled]:hover,fieldset[disabled] .btn-info.focus,fieldset[disabled] .btn-info:focus,fieldset[disabled] .btn-info:hover{background-color:#5bc0de;border-color:#46b8da}.btn-info .badge{color:#5bc0de;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning.focus,.btn-warning:focus{color:#fff;background-color:#ec971f;border-color:#985f0d}.btn-warning:hover{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active.focus,.btn-warning.active:focus,.btn-warning.active:hover,.btn-warning:active.focus,.btn-warning:active:focus,.btn-warning:active:hover,.open>.dropdown-toggle.btn-warning.focus,.open>.dropdown-toggle.btn-warning:focus,.open>.dropdown-toggle.btn-warning:hover{color:#fff;background-color:#d58512;border-color:#985f0d}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled.focus,.btn-warning.disabled:focus,.btn-warning.disabled:hover,.btn-warning[disabled].focus,.btn-warning[disabled]:focus,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning.focus,fieldset[disabled] .btn-warning:focus,fieldset[disabled] .btn-warning:hover{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c9302c;border-color:#761c19}.btn-danger:hover{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active.focus,.btn-danger.active:focus,.btn-danger.active:hover,.btn-danger:active.focus,.btn-danger:active:focus,.btn-danger:active:hover,.open>.dropdown-toggle.btn-danger.focus,.open>.dropdown-toggle.btn-danger:focus,.open>.dropdown-toggle.btn-danger:hover{color:#fff;background-color:#ac2925;border-color:#761c19}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled.focus,.btn-danger.disabled:focus,.btn-danger.disabled:hover,.btn-danger[disabled].focus,.btn-danger[disabled]:focus,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger.focus,fieldset[disabled] .btn-danger:focus,fieldset[disabled] .btn-danger:hover{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{font-weight:400;color:#337ab7;border-radius:0}.btn-link,.btn-link.active,.btn-link:active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:active,.btn-link:focus,.btn-link:hover{border-color:transparent}.btn-link:focus,.btn-link:hover{color:#23527c;text-decoration:underline;background-color:transparent}.btn-link[disabled]:focus,.btn-link[disabled]:hover,fieldset[disabled] .btn-link:focus,fieldset[disabled] .btn-link:hover{color:#777;text-decoration:none}.btn-group-lg>.btn,.btn-lg{padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.btn-group-sm>.btn,.btn-sm{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type=button].btn-block,input[type=reset].btn-block,input[type=submit].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease;-webkit-transition-duration:.35s;-o-transition-duration:.35s;transition-duration:.35s;-webkit-transition-property:height,visibility;-o-transition-property:height,visibility;transition-property:height,visibility}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px dashed;border-top:4px solid\\9;border-right:4px solid transparent;border-left:4px solid transparent}.dropdown,.dropup{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:400;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:focus,.dropdown-menu>li>a:hover{color:#262626;text-decoration:none;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:focus,.dropdown-menu>.active>a:hover{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{color:#777}.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{text-decoration:none;cursor:not-allowed;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled=false)}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{right:0;left:auto}.dropdown-menu-left{right:auto;left:0}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}.dropdown-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{content:\"\";border-top:0;border-bottom:4px dashed;border-bottom:4px solid\\9}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:2px}@media (min-width:768px){.navbar-right .dropdown-menu{right:0;left:auto}.navbar-right .dropdown-menu-left{right:auto;left:0}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group-vertical>.btn,.btn-group>.btn{position:relative;float:left}.btn-group-vertical>.btn.active,.btn-group-vertical>.btn:active,.btn-group-vertical>.btn:focus,.btn-group-vertical>.btn:hover,.btn-group>.btn.active,.btn-group>.btn:active,.btn-group>.btn:focus,.btn-group>.btn:hover{z-index:2}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn,.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-bottom-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-right:8px;padding-left:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-right:12px;padding-left:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-top-left-radius:0;border-top-right-radius:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-top-right-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{display:table-cell;float:none;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle=buttons]>.btn input[type=checkbox],[data-toggle=buttons]>.btn input[type=radio],[data-toggle=buttons]>.btn-group>.btn input[type=checkbox],[data-toggle=buttons]>.btn-group>.btn input[type=radio]{position:absolute;clip:rect(0,0,0,0);pointer-events:none}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*=col-]{float:none;padding-right:0;padding-left:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group .form-control:focus{z-index:3}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn,textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn,textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn{height:auto}.input-group .form-control,.input-group-addon,.input-group-btn{display:table-cell}.input-group .form-control:not(:first-child):not(:last-child),.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:400;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type=checkbox],.input-group-addon input[type=radio]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn-group:not(:last-child)>.btn,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:first-child>.btn-group:not(:first-child)>.btn,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle{border-top-left-radius:0;border-bottom-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:active,.input-group-btn>.btn:focus,.input-group-btn>.btn:hover{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{z-index:2;margin-left:-1px}.nav{padding-left:0;margin-bottom:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:focus,.nav>li>a:hover{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:focus,.nav>li.disabled>a:hover{color:#777;text-decoration:none;cursor:not-allowed;background-color:transparent}.nav .open>a,.nav .open>a:focus,.nav .open>a:hover{background-color:#eee;border-color:#337ab7}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:4px 4px 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:focus,.nav-tabs>li.active>a:hover{color:#555;cursor:default;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:4px}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:focus,.nav-pills>li.active>a:hover{color:#fff;background-color:#337ab7}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0}.navbar{position:relative;min-height:50px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:4px}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{padding-right:15px;padding-left:15px;overflow-x:visible;-webkit-overflow-scrolling:touch;border-top:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;-webkit-box-shadow:none;box-shadow:none}.navbar-collapse.collapse{display:block!important;height:auto!important;padding-bottom:0;overflow:visible!important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse{padding-right:0;padding-left:0}}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:340px}@media (max-device-width:480px) and (orientation:landscape){.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:200px}}.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-bottom,.navbar-fixed-top{position:fixed;right:0;left:0;z-index:1030}@media (min-width:768px){.navbar-fixed-bottom,.navbar-fixed-top{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;height:50px;padding:15px 15px;font-size:18px;line-height:20px}.navbar-brand:focus,.navbar-brand:hover{text-decoration:none}.navbar-brand>img{display:block}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;padding:9px 10px;margin-top:8px;margin-right:15px;margin-bottom:8px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:4px}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:7.5px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;-webkit-box-shadow:none;box-shadow:none}.navbar-nav .open .dropdown-menu .dropdown-header,.navbar-nav .open .dropdown-menu>li>a{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:focus,.navbar-nav .open .dropdown-menu>li>a:hover{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:15px;padding-bottom:15px}}.navbar-form{padding:10px 15px;margin-top:8px;margin-right:-15px;margin-bottom:8px;margin-left:-15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1)}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .form-control-static{display:inline-block}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .form-control,.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .checkbox,.navbar-form .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .checkbox label,.navbar-form .radio label{padding-left:0}.navbar-form .checkbox input[type=checkbox],.navbar-form .radio input[type=radio]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}.navbar-form .form-group:last-child{margin-bottom:0}}@media (min-width:768px){.navbar-form{width:auto;padding-top:0;padding-bottom:0;margin-right:0;margin-left:0;border:0;-webkit-box-shadow:none;box-shadow:none}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-left-radius:0;border-top-right-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{margin-bottom:0;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:8px;margin-bottom:8px}.navbar-btn.btn-sm{margin-top:10px;margin-bottom:10px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.navbar-text{margin-top:15px;margin-bottom:15px}@media (min-width:768px){.navbar-text{float:left;margin-right:15px;margin-left:15px}}@media (min-width:768px){.navbar-left{float:left!important}.navbar-right{float:right!important;margin-right:-15px}.navbar-right~.navbar-right{margin-right:0}}.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}.navbar-default .navbar-brand{color:#777}.navbar-default .navbar-brand:focus,.navbar-default .navbar-brand:hover{color:#5e5e5e;background-color:transparent}.navbar-default .navbar-text{color:#777}.navbar-default .navbar-nav>li>a{color:#777}.navbar-default .navbar-nav>li>a:focus,.navbar-default .navbar-nav>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:focus,.navbar-default .navbar-nav>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:focus,.navbar-default .navbar-nav>.disabled>a:hover{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:focus,.navbar-default .navbar-toggle:hover{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#e7e7e7}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:focus,.navbar-default .navbar-nav>.open>a:hover{color:#555;background-color:#e7e7e7}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#777}.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#777}.navbar-default .navbar-link:hover{color:#333}.navbar-default .btn-link{color:#777}.navbar-default .btn-link:focus,.navbar-default .btn-link:hover{color:#333}.navbar-default .btn-link[disabled]:focus,.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:focus,fieldset[disabled] .navbar-default .btn-link:hover{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#9d9d9d}.navbar-inverse .navbar-brand:focus,.navbar-inverse .navbar-brand:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a:focus,.navbar-inverse .navbar-nav>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:focus,.navbar-inverse .navbar-nav>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:focus,.navbar-inverse .navbar-nav>.disabled>a:hover{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:focus,.navbar-inverse .navbar-toggle:hover{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:focus,.navbar-inverse .navbar-nav>.open>a:hover{color:#fff;background-color:#080808}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#9d9d9d}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#9d9d9d}.navbar-inverse .btn-link:focus,.navbar-inverse .btn-link:hover{color:#fff}.navbar-inverse .btn-link[disabled]:focus,.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:focus,fieldset[disabled] .navbar-inverse .btn-link:hover{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:4px}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{padding:0 5px;color:#ccc;content:\"/\\00a0\"}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{z-index:2;color:#23527c;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:3;color:#fff;cursor:default;background-color:#337ab7;border-color:#337ab7}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.pager{padding-left:0;margin:20px 0;text-align:center;list-style:none}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:focus,.pager li>a:hover{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:focus,.pager .disabled>a:hover,.pager .disabled>span{color:#777;cursor:not-allowed;background-color:#fff}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:focus,a.label:hover{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:focus,.label-default[href]:hover{background-color:#5e5e5e}.label-primary{background-color:#337ab7}.label-primary[href]:focus,.label-primary[href]:hover{background-color:#286090}.label-success{background-color:#5cb85c}.label-success[href]:focus,.label-success[href]:hover{background-color:#449d44}.label-info{background-color:#5bc0de}.label-info[href]:focus,.label-info[href]:hover{background-color:#31b0d5}.label-warning{background-color:#f0ad4e}.label-warning[href]:focus,.label-warning[href]:hover{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:focus,.label-danger[href]:hover{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:middle;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-group-xs>.btn .badge,.btn-xs .badge{top:0;padding:1px 5px}a.badge:focus,a.badge:hover{color:#fff;text-decoration:none;cursor:pointer}.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#337ab7;background-color:#fff}.list-group-item>.badge{float:right}.list-group-item>.badge+.badge{margin-right:5px}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding-top:30px;padding-bottom:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron .h1,.jumbotron h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron,.container-fluid .jumbotron{padding-right:15px;padding-left:15px;border-radius:6px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron,.container-fluid .jumbotron{padding-right:60px;padding-left:60px}.jumbotron .h1,.jumbotron h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:border .2s ease-in-out;-o-transition:border .2s ease-in-out;transition:border .2s ease-in-out}.thumbnail a>img,.thumbnail>img{margin-right:auto;margin-left:auto}a.thumbnail.active,a.thumbnail:focus,a.thumbnail:hover{border-color:#337ab7}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:700}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@-o-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{height:20px;margin-bottom:20px;overflow:hidden;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1)}.progress-bar{float:left;width:0;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#337ab7;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-bar-striped,.progress-striped .progress-bar{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress-bar.active,.progress.active .progress-bar{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar-success{background-color:#5cb85c}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-info{background-color:#5bc0de}.progress-striped .progress-bar-info{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-warning{background-color:#f0ad4e}.progress-striped .progress-bar-warning{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-danger{background-color:#d9534f}.progress-striped .progress-bar-danger{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.media{margin-top:15px}.media:first-child{margin-top:0}.media,.media-body{overflow:hidden;zoom:1}.media-body{width:10000px}.media-object{display:block}.media-object.img-thumbnail{max-width:none}.media-right,.media>.pull-right{padding-left:10px}.media-left,.media>.pull-left{padding-right:10px}.media-body,.media-left,.media-right{display:table-cell;vertical-align:top}.media-middle{vertical-align:middle}.media-bottom{vertical-align:bottom}.media-heading{margin-top:0;margin-bottom:5px}.media-list{padding-left:0;list-style:none}.list-group{padding-left:0;margin-bottom:20px}.list-group-item{position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}.list-group-item:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}a.list-group-item,button.list-group-item{color:#555}a.list-group-item .list-group-item-heading,button.list-group-item .list-group-item-heading{color:#333}a.list-group-item:focus,a.list-group-item:hover,button.list-group-item:focus,button.list-group-item:hover{color:#555;text-decoration:none;background-color:#f5f5f5}button.list-group-item{width:100%;text-align:left}.list-group-item.disabled,.list-group-item.disabled:focus,.list-group-item.disabled:hover{color:#777;cursor:not-allowed;background-color:#eee}.list-group-item.disabled .list-group-item-heading,.list-group-item.disabled:focus .list-group-item-heading,.list-group-item.disabled:hover .list-group-item-heading{color:inherit}.list-group-item.disabled .list-group-item-text,.list-group-item.disabled:focus .list-group-item-text,.list-group-item.disabled:hover .list-group-item-text{color:#777}.list-group-item.active,.list-group-item.active:focus,.list-group-item.active:hover{z-index:2;color:#fff;background-color:#337ab7;border-color:#337ab7}.list-group-item.active .list-group-item-heading,.list-group-item.active .list-group-item-heading>.small,.list-group-item.active .list-group-item-heading>small,.list-group-item.active:focus .list-group-item-heading,.list-group-item.active:focus .list-group-item-heading>.small,.list-group-item.active:focus .list-group-item-heading>small,.list-group-item.active:hover .list-group-item-heading,.list-group-item.active:hover .list-group-item-heading>.small,.list-group-item.active:hover .list-group-item-heading>small{color:inherit}.list-group-item.active .list-group-item-text,.list-group-item.active:focus .list-group-item-text,.list-group-item.active:hover .list-group-item-text{color:#c7ddef}.list-group-item-success{color:#3c763d;background-color:#dff0d8}a.list-group-item-success,button.list-group-item-success{color:#3c763d}a.list-group-item-success .list-group-item-heading,button.list-group-item-success .list-group-item-heading{color:inherit}a.list-group-item-success:focus,a.list-group-item-success:hover,button.list-group-item-success:focus,button.list-group-item-success:hover{color:#3c763d;background-color:#d0e9c6}a.list-group-item-success.active,a.list-group-item-success.active:focus,a.list-group-item-success.active:hover,button.list-group-item-success.active,button.list-group-item-success.active:focus,button.list-group-item-success.active:hover{color:#fff;background-color:#3c763d;border-color:#3c763d}.list-group-item-info{color:#31708f;background-color:#d9edf7}a.list-group-item-info,button.list-group-item-info{color:#31708f}a.list-group-item-info .list-group-item-heading,button.list-group-item-info .list-group-item-heading{color:inherit}a.list-group-item-info:focus,a.list-group-item-info:hover,button.list-group-item-info:focus,button.list-group-item-info:hover{color:#31708f;background-color:#c4e3f3}a.list-group-item-info.active,a.list-group-item-info.active:focus,a.list-group-item-info.active:hover,button.list-group-item-info.active,button.list-group-item-info.active:focus,button.list-group-item-info.active:hover{color:#fff;background-color:#31708f;border-color:#31708f}.list-group-item-warning{color:#8a6d3b;background-color:#fcf8e3}a.list-group-item-warning,button.list-group-item-warning{color:#8a6d3b}a.list-group-item-warning .list-group-item-heading,button.list-group-item-warning .list-group-item-heading{color:inherit}a.list-group-item-warning:focus,a.list-group-item-warning:hover,button.list-group-item-warning:focus,button.list-group-item-warning:hover{color:#8a6d3b;background-color:#faf2cc}a.list-group-item-warning.active,a.list-group-item-warning.active:focus,a.list-group-item-warning.active:hover,button.list-group-item-warning.active,button.list-group-item-warning.active:focus,button.list-group-item-warning.active:hover{color:#fff;background-color:#8a6d3b;border-color:#8a6d3b}.list-group-item-danger{color:#a94442;background-color:#f2dede}a.list-group-item-danger,button.list-group-item-danger{color:#a94442}a.list-group-item-danger .list-group-item-heading,button.list-group-item-danger .list-group-item-heading{color:inherit}a.list-group-item-danger:focus,a.list-group-item-danger:hover,button.list-group-item-danger:focus,button.list-group-item-danger:hover{color:#a94442;background-color:#ebcccc}a.list-group-item-danger.active,a.list-group-item-danger.active:focus,a.list-group-item-danger.active:hover,button.list-group-item-danger.active,button.list-group-item-danger.active:focus,button.list-group-item-danger.active:hover{color:#fff;background-color:#a94442;border-color:#a94442}.list-group-item-heading{margin-top:0;margin-bottom:5px}.list-group-item-text{margin-bottom:0;line-height:1.3}.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:4px;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05)}.panel-body{padding:15px}.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-left-radius:3px;border-top-right-radius:3px}.panel-heading>.dropdown .dropdown-toggle{color:inherit}.panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}.panel-title>.small,.panel-title>.small>a,.panel-title>a,.panel-title>small,.panel-title>small>a{color:inherit}.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.list-group,.panel>.panel-collapse>.list-group{margin-bottom:0}.panel>.list-group .list-group-item,.panel>.panel-collapse>.list-group .list-group-item{border-width:1px 0;border-radius:0}.panel>.list-group:first-child .list-group-item:first-child,.panel>.panel-collapse>.list-group:first-child .list-group-item:first-child{border-top:0;border-top-left-radius:3px;border-top-right-radius:3px}.panel>.list-group:last-child .list-group-item:last-child,.panel>.panel-collapse>.list-group:last-child .list-group-item:last-child{border-bottom:0;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.panel-heading+.panel-collapse>.list-group .list-group-item:first-child{border-top-left-radius:0;border-top-right-radius:0}.panel-heading+.list-group .list-group-item:first-child{border-top-width:0}.list-group+.panel-footer{border-top-width:0}.panel>.panel-collapse>.table,.panel>.table,.panel>.table-responsive>.table{margin-bottom:0}.panel>.panel-collapse>.table caption,.panel>.table caption,.panel>.table-responsive>.table caption{padding-right:15px;padding-left:15px}.panel>.table-responsive:first-child>.table:first-child,.panel>.table:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child,.panel>.table:first-child>thead:first-child>tr:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child{border-top-left-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child{border-top-right-radius:3px}.panel>.table-responsive:last-child>.table:last-child,.panel>.table:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-bottom-right-radius:3px}.panel>.panel-body+.table,.panel>.panel-body+.table-responsive,.panel>.table+.panel-body,.panel>.table-responsive+.panel-body{border-top:1px solid #ddd}.panel>.table>tbody:first-child>tr:first-child td,.panel>.table>tbody:first-child>tr:first-child th{border-top:0}.panel>.table-bordered,.panel>.table-responsive>.table-bordered{border:0}.panel>.table-bordered>tbody>tr>td:first-child,.panel>.table-bordered>tbody>tr>th:first-child,.panel>.table-bordered>tfoot>tr>td:first-child,.panel>.table-bordered>tfoot>tr>th:first-child,.panel>.table-bordered>thead>tr>td:first-child,.panel>.table-bordered>thead>tr>th:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:first-child,.panel>.table-responsive>.table-bordered>thead>tr>td:first-child,.panel>.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.panel>.table-bordered>tbody>tr>td:last-child,.panel>.table-bordered>tbody>tr>th:last-child,.panel>.table-bordered>tfoot>tr>td:last-child,.panel>.table-bordered>tfoot>tr>th:last-child,.panel>.table-bordered>thead>tr>td:last-child,.panel>.table-bordered>thead>tr>th:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:last-child,.panel>.table-responsive>.table-bordered>thead>tr>td:last-child,.panel>.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.panel>.table-bordered>tbody>tr:first-child>td,.panel>.table-bordered>tbody>tr:first-child>th,.panel>.table-bordered>thead>tr:first-child>td,.panel>.table-bordered>thead>tr:first-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>th,.panel>.table-responsive>.table-bordered>thead>tr:first-child>td,.panel>.table-responsive>.table-bordered>thead>tr:first-child>th{border-bottom:0}.panel>.table-bordered>tbody>tr:last-child>td,.panel>.table-bordered>tbody>tr:last-child>th,.panel>.table-bordered>tfoot>tr:last-child>td,.panel>.table-bordered>tfoot>tr:last-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>th,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>td,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}.panel>.table-responsive{margin-bottom:0;border:0}.panel-group{margin-bottom:20px}.panel-group .panel{margin-bottom:0;border-radius:4px}.panel-group .panel+.panel{margin-top:5px}.panel-group .panel-heading{border-bottom:0}.panel-group .panel-heading+.panel-collapse>.list-group,.panel-group .panel-heading+.panel-collapse>.panel-body{border-top:1px solid #ddd}.panel-group .panel-footer{border-top:0}.panel-group .panel-footer+.panel-collapse .panel-body{border-bottom:1px solid #ddd}.panel-default{border-color:#ddd}.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}.panel-default>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-default>.panel-heading .badge{color:#f5f5f5;background-color:#333}.panel-default>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-primary{border-color:#337ab7}.panel-primary>.panel-heading{color:#fff;background-color:#337ab7;border-color:#337ab7}.panel-primary>.panel-heading+.panel-collapse>.panel-body{border-top-color:#337ab7}.panel-primary>.panel-heading .badge{color:#337ab7;background-color:#fff}.panel-primary>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#337ab7}.panel-success{border-color:#d6e9c6}.panel-success>.panel-heading{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.panel-success>.panel-heading+.panel-collapse>.panel-body{border-top-color:#d6e9c6}.panel-success>.panel-heading .badge{color:#dff0d8;background-color:#3c763d}.panel-success>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#d6e9c6}.panel-info{border-color:#bce8f1}.panel-info>.panel-heading{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.panel-info>.panel-heading+.panel-collapse>.panel-body{border-top-color:#bce8f1}.panel-info>.panel-heading .badge{color:#d9edf7;background-color:#31708f}.panel-info>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#bce8f1}.panel-warning{border-color:#faebcc}.panel-warning>.panel-heading{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.panel-warning>.panel-heading+.panel-collapse>.panel-body{border-top-color:#faebcc}.panel-warning>.panel-heading .badge{color:#fcf8e3;background-color:#8a6d3b}.panel-warning>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#faebcc}.panel-danger{border-color:#ebccd1}.panel-danger>.panel-heading{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.panel-danger>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ebccd1}.panel-danger>.panel-heading .badge{color:#f2dede;background-color:#a94442}.panel-danger>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ebccd1}.embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden}.embed-responsive .embed-responsive-item,.embed-responsive embed,.embed-responsive iframe,.embed-responsive object,.embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}.embed-responsive-16by9{padding-bottom:56.25%}.embed-responsive-4by3{padding-bottom:75%}.well{min-height:20px;padding:19px;margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e3e3e3;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.05);box-shadow:inset 0 1px 1px rgba(0,0,0,.05)}.well blockquote{border-color:#ddd;border-color:rgba(0,0,0,.15)}.well-lg{padding:24px;border-radius:6px}.well-sm{padding:9px;border-radius:3px}.close{float:right;font-size:21px;font-weight:700;line-height:1;color:#000;text-shadow:0 1px 0 #fff;filter:alpha(opacity=20);opacity:.2}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer;filter:alpha(opacity=50);opacity:.5}button.close{-webkit-appearance:none;padding:0;cursor:pointer;background:0 0;border:0}.modal-open{overflow:hidden}.modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;display:none;overflow:hidden;-webkit-overflow-scrolling:touch;outline:0}.modal.fade .modal-dialog{-webkit-transition:-webkit-transform .3s ease-out;-o-transition:-o-transform .3s ease-out;transition:transform .3s ease-out;-webkit-transform:translate(0,-25%);-ms-transform:translate(0,-25%);-o-transform:translate(0,-25%);transform:translate(0,-25%)}.modal.in .modal-dialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);-o-transform:translate(0,0);transform:translate(0,0)}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal-dialog{position:relative;width:auto;margin:10px}.modal-content{position:relative;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;outline:0;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}.modal-backdrop.fade{filter:alpha(opacity=0);opacity:0}.modal-backdrop.in{filter:alpha(opacity=50);opacity:.5}.modal-header{padding:15px;border-bottom:1px solid #e5e5e5}.modal-header .close{margin-top:-2px}.modal-title{margin:0;line-height:1.42857143}.modal-body{position:relative;padding:15px}.modal-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5}.modal-footer .btn+.btn{margin-bottom:0;margin-left:5px}.modal-footer .btn-group .btn+.btn{margin-left:-1px}.modal-footer .btn-block+.btn-block{margin-left:0}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);box-shadow:0 5px 15px rgba(0,0,0,.5)}.modal-sm{width:300px}}@media (min-width:992px){.modal-lg{width:900px}}.tooltip{position:absolute;z-index:1070;display:block;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:12px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;filter:alpha(opacity=0);opacity:0;line-break:auto}.tooltip.in{filter:alpha(opacity=90);opacity:.9}.tooltip.top{padding:5px 0;margin-top:-3px}.tooltip.right{padding:0 5px;margin-left:3px}.tooltip.bottom{padding:5px 0;margin-top:3px}.tooltip.left{padding:0 5px;margin-left:-3px}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;background-color:#000;border-radius:4px}.tooltip-arrow{position:absolute;width:0;height:0;border-color:transparent;border-style:solid}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-left .tooltip-arrow{right:5px;bottom:0;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-right .tooltip-arrow{bottom:0;left:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-width:5px 5px 5px 0;border-right-color:#000}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-width:5px 0 5px 5px;border-left-color:#000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-left .tooltip-arrow{top:0;right:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-right .tooltip-arrow{top:0;left:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.popover{position:absolute;top:0;left:0;z-index:1060;display:none;max-width:276px;padding:1px;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0,0,0,.2);box-shadow:0 5px 10px rgba(0,0,0,.2);line-break:auto}.popover.top{margin-top:-10px}.popover.right{margin-left:10px}.popover.bottom{margin-top:10px}.popover.left{margin-left:-10px}.popover-title{padding:8px 14px;margin:0;font-size:14px;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-radius:5px 5px 0 0}.popover-content{padding:9px 14px}.popover>.arrow,.popover>.arrow:after{position:absolute;display:block;width:0;height:0;border-color:transparent;border-style:solid}.popover>.arrow{border-width:11px}.popover>.arrow:after{content:\"\";border-width:10px}.popover.top>.arrow{bottom:-11px;left:50%;margin-left:-11px;border-top-color:#999;border-top-color:rgba(0,0,0,.25);border-bottom-width:0}.popover.top>.arrow:after{bottom:1px;margin-left:-10px;content:\" \";border-top-color:#fff;border-bottom-width:0}.popover.right>.arrow{top:50%;left:-11px;margin-top:-11px;border-right-color:#999;border-right-color:rgba(0,0,0,.25);border-left-width:0}.popover.right>.arrow:after{bottom:-10px;left:1px;content:\" \";border-right-color:#fff;border-left-width:0}.popover.bottom>.arrow{top:-11px;left:50%;margin-left:-11px;border-top-width:0;border-bottom-color:#999;border-bottom-color:rgba(0,0,0,.25)}.popover.bottom>.arrow:after{top:1px;margin-left:-10px;content:\" \";border-top-width:0;border-bottom-color:#fff}.popover.left>.arrow{top:50%;right:-11px;margin-top:-11px;border-right-width:0;border-left-color:#999;border-left-color:rgba(0,0,0,.25)}.popover.left>.arrow:after{right:1px;bottom:-10px;content:\" \";border-right-width:0;border-left-color:#fff}.carousel{position:relative}.carousel-inner{position:relative;width:100%;overflow:hidden}.carousel-inner>.item{position:relative;display:none;-webkit-transition:.6s ease-in-out left;-o-transition:.6s ease-in-out left;transition:.6s ease-in-out left}.carousel-inner>.item>a>img,.carousel-inner>.item>img{line-height:1}@media all and (transform-3d),(-webkit-transform-3d){.carousel-inner>.item{-webkit-transition:-webkit-transform .6s ease-in-out;-o-transition:-o-transform .6s ease-in-out;transition:transform .6s ease-in-out;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-perspective:1000px;perspective:1000px}.carousel-inner>.item.active.right,.carousel-inner>.item.next{left:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.carousel-inner>.item.active.left,.carousel-inner>.item.prev{left:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.carousel-inner>.item.active,.carousel-inner>.item.next.left,.carousel-inner>.item.prev.right{left:0;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.carousel-inner>.active,.carousel-inner>.next,.carousel-inner>.prev{display:block}.carousel-inner>.active{left:0}.carousel-inner>.next,.carousel-inner>.prev{position:absolute;top:0;width:100%}.carousel-inner>.next{left:100%}.carousel-inner>.prev{left:-100%}.carousel-inner>.next.left,.carousel-inner>.prev.right{left:0}.carousel-inner>.active.left{left:-100%}.carousel-inner>.active.right{left:100%}.carousel-control{position:absolute;top:0;bottom:0;left:0;width:15%;font-size:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6);background-color:rgba(0,0,0,0);filter:alpha(opacity=50);opacity:.5}.carousel-control.left{background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,.0001)));background-image:linear-gradient(to right,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);background-repeat:repeat-x}.carousel-control.right{right:0;left:auto;background-image:-webkit-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.0001)),to(rgba(0,0,0,.5)));background-image:linear-gradient(to right,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);background-repeat:repeat-x}.carousel-control:focus,.carousel-control:hover{color:#fff;text-decoration:none;filter:alpha(opacity=90);outline:0;opacity:.9}.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{position:absolute;top:50%;z-index:5;display:inline-block;margin-top:-10px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{left:50%;margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{right:50%;margin-right:-10px}.carousel-control .icon-next,.carousel-control .icon-prev{width:20px;height:20px;font-family:serif;line-height:1}.carousel-control .icon-prev:before{content:'\\2039'}.carousel-control .icon-next:before{content:'\\203a'}.carousel-indicators{position:absolute;bottom:10px;left:50%;z-index:15;width:60%;padding-left:0;margin-left:-30%;text-align:center;list-style:none}.carousel-indicators li{display:inline-block;width:10px;height:10px;margin:1px;text-indent:-999px;cursor:pointer;background-color:#000\\9;background-color:rgba(0,0,0,0);border:1px solid #fff;border-radius:10px}.carousel-indicators .active{width:12px;height:12px;margin:0;background-color:#fff}.carousel-caption{position:absolute;right:15%;bottom:20px;left:15%;z-index:10;padding-top:20px;padding-bottom:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6)}.carousel-caption .btn{text-shadow:none}@media screen and (min-width:768px){.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{width:30px;height:30px;margin-top:-10px;font-size:30px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{margin-right:-10px}.carousel-caption{right:20%;left:20%;padding-bottom:30px}.carousel-indicators{bottom:20px}}.btn-group-vertical>.btn-group:after,.btn-group-vertical>.btn-group:before,.btn-toolbar:after,.btn-toolbar:before,.clearfix:after,.clearfix:before,.container-fluid:after,.container-fluid:before,.container:after,.container:before,.dl-horizontal dd:after,.dl-horizontal dd:before,.form-horizontal .form-group:after,.form-horizontal .form-group:before,.modal-footer:after,.modal-footer:before,.modal-header:after,.modal-header:before,.nav:after,.nav:before,.navbar-collapse:after,.navbar-collapse:before,.navbar-header:after,.navbar-header:before,.navbar:after,.navbar:before,.pager:after,.pager:before,.panel-body:after,.panel-body:before,.row:after,.row:before{display:table;content:\" \"}.btn-group-vertical>.btn-group:after,.btn-toolbar:after,.clearfix:after,.container-fluid:after,.container:after,.dl-horizontal dd:after,.form-horizontal .form-group:after,.modal-footer:after,.modal-header:after,.nav:after,.navbar-collapse:after,.navbar-header:after,.navbar:after,.pager:after,.panel-body:after,.row:after{clear:both}.center-block{display:block;margin-right:auto;margin-left:auto}.pull-right{float:right!important}.pull-left{float:left!important}.hide{display:none!important}.show{display:block!important}.invisible{visibility:hidden}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.hidden{display:none!important}.affix{position:fixed}@-ms-viewport{width:device-width}.visible-lg,.visible-md,.visible-sm,.visible-xs{display:none!important}.visible-lg-block,.visible-lg-inline,.visible-lg-inline-block,.visible-md-block,.visible-md-inline,.visible-md-inline-block,.visible-sm-block,.visible-sm-inline,.visible-sm-inline-block,.visible-xs-block,.visible-xs-inline,.visible-xs-inline-block{display:none!important}@media (max-width:767px){.visible-xs{display:block!important}table.visible-xs{display:table!important}tr.visible-xs{display:table-row!important}td.visible-xs,th.visible-xs{display:table-cell!important}}@media (max-width:767px){.visible-xs-block{display:block!important}}@media (max-width:767px){.visible-xs-inline{display:inline!important}}@media (max-width:767px){.visible-xs-inline-block{display:inline-block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm{display:block!important}table.visible-sm{display:table!important}tr.visible-sm{display:table-row!important}td.visible-sm,th.visible-sm{display:table-cell!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-block{display:block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline{display:inline!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline-block{display:inline-block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md{display:block!important}table.visible-md{display:table!important}tr.visible-md{display:table-row!important}td.visible-md,th.visible-md{display:table-cell!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-block{display:block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline{display:inline!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline-block{display:inline-block!important}}@media (min-width:1200px){.visible-lg{display:block!important}table.visible-lg{display:table!important}tr.visible-lg{display:table-row!important}td.visible-lg,th.visible-lg{display:table-cell!important}}@media (min-width:1200px){.visible-lg-block{display:block!important}}@media (min-width:1200px){.visible-lg-inline{display:inline!important}}@media (min-width:1200px){.visible-lg-inline-block{display:inline-block!important}}@media (max-width:767px){.hidden-xs{display:none!important}}@media (min-width:768px) and (max-width:991px){.hidden-sm{display:none!important}}@media (min-width:992px) and (max-width:1199px){.hidden-md{display:none!important}}@media (min-width:1200px){.hidden-lg{display:none!important}}.visible-print{display:none!important}@media print{.visible-print{display:block!important}table.visible-print{display:table!important}tr.visible-print{display:table-row!important}td.visible-print,th.visible-print{display:table-cell!important}}.visible-print-block{display:none!important}@media print{.visible-print-block{display:block!important}}.visible-print-inline{display:none!important}@media print{.visible-print-inline{display:inline!important}}.visible-print-inline-block{display:none!important}@media print{.visible-print-inline-block{display:inline-block!important}}@media print{.hidden-print{display:none!important}}") || true) && "_ec3bb52a";
// load gentelella css in the global scope (keep this comment)
(require('insert-css')(".left_col{background:#2A3F54}.nav-sm .container.body .col-md-3.left_col{width:70px;padding:0;z-index:9999;position:absolute}.nav-sm .container.body .col-md-3.left_col.menu_fixed{position:fixed;height:100%}.nav-sm .container.body .col-md-3.left_col .mCSB_container,.nav-sm .container.body .col-md-3.left_col .mCustomScrollBox{overflow:visible}.nav-sm .hidden-small{visibility:hidden}.nav-sm .container.body .right_col{padding:10px 20px;margin-left:70px;z-index:2}.nav-sm .navbar.nav_title{width:70px}.nav-sm .navbar.nav_title a span{display:none}.nav-sm .navbar.nav_title a i{font-size:27px;margin:13px 0 0 3px}.site_title i{border:1px solid #EAEAEA;padding:5px 6px;border-radius:50%}.nav-sm .main_container .top_nav{display:block;margin-left:70px;z-index:2}.nav-sm .nav.side-menu li a{text-align:center !important;font-weight:400;font-size:10px;padding:10px 5px}.nav-sm .nav.child_menu li.active,.nav-sm .nav.side-menu li.active-sm{border-right:5px solid #1ABB9C}.nav-sm ul.nav.child_menu ul,.nav-sm .nav.side-menu li.active-sm ul ul{position:static;width:200px;background:none}.nav-sm>.nav.side-menu>li.active-sm>a{color:#1ABB9C !important}.nav-sm .nav.side-menu li a i.toggle-up{display:none !important}.nav-sm .nav.side-menu li a i{font-size:25px !important;text-align:center;width:100% !important;margin-bottom:5px}.nav-sm ul.nav.child_menu{left:100%;position:absolute;top:0;width:210px;z-index:4000;background:#3E5367;display:none}.nav-sm ul.nav.child_menu li{padding:0 10px}.nav-sm ul.nav.child_menu li a{text-align:left !important}.nav-sm .profile{display:none}.menu_section{margin-bottom:35px}.menu_section h3{padding-left:23px;color:#fff;text-transform:uppercase;letter-spacing:.5px;font-weight:bold;font-size:11px;margin-bottom:0;margin-top:0;text-shadow:1px 1px #000}.menu_section>ul{margin-top:10px}.profile_pic{width:35%;float:left}.img-circle.profile_img{width:70%;background:#fff;margin-left:15%;z-index:1000;position:inherit;margin-top:20px;border:1px solid rgba(52,73,94,0.44);padding:4px}.profile_info{padding:25px 10px 10px;width:65%;float:left}.profile_info span{font-size:13px;line-height:30px;color:#BAB8B8}.profile_info h2{font-size:14px;color:#ECF0F1;margin:0;font-weight:300}.profile.img_2{text-align:center}.profile.img_2 .profile_pic{width:100%}.profile.img_2 .profile_pic .img-circle.profile_img{width:50%;margin:10px 0 0}.profile.img_2 .profile_info{padding:15px 10px 0;width:100%;margin-bottom:10px;float:left}.main_menu span.fa{float:right;text-align:center;margin-top:5px;font-size:10px;min-width:inherit;color:#C4CFDA}.active a span.fa{text-align:right !important;margin-right:4px}.nav-sm .menu_section{margin:0}.nav-sm span.fa,.nav-sm .menu_section h3{display:none}.nav-sm li li span.fa{display:inline-block}.nav_menu{float:left;background:#EDEDED;border-bottom:1px solid #D9DEE4;margin-bottom:10px;width:100%;position:relative}@media (min-width: 480px){.nav_menu{position:static}}.nav-md .container.body .col-md-3.left_col{width:230px;padding:0;position:absolute;display:-ms-flexbox;display:flex;z-index:9999}.nav-md .container.body .col-md-3.left_col.menu_fixed{height:100%;position:fixed}body .container.body .right_col{background:#F7F7F7}.nav-md .container.body .right_col{padding:10px 20px 0;margin-left:230px}.nav_title{width:230px;float:left;background:#2A3F54;border-radius:0;height:57px}@media (max-width: 991px){.nav-md .container.body .right_col,.nav-md .container.body .top_nav{width:100%;margin:0}.nav-md .container.body .col-md-3.left_col{display:none}.nav-md .container.body .right_col{width:100%;padding-right:0}.right_col{padding:10px !important}}@media (max-width: 1200px){.x_title h2{width:62%;font-size:17px}.tile,.graph{zoom:85%;height:inherit}}@media (max-width: 1270px) and (min-width: 192px){.x_title h2 small{display:none}}.left_col .mCSB_scrollTools{width:6px}.left_col .mCSB_dragger{max-height:400px !important}.blue{color:#3498DB}.purple{color:#9B59B6}.green{color:#1ABB9C}.aero{color:#9CC2CB}.red{color:#E74C3C}.dark{color:#34495E}.border-blue{border-color:#3498DB !important}.border-purple{border-color:#9B59B6 !important}.border-green{border-color:#1ABB9C !important}.border-aero{border-color:#9CC2CB !important}.border-red{border-color:#E74C3C !important}.border-dark{border-color:#34495E !important}.bg-white{background:#fff !important;border:1px solid #fff !important;color:#73879C}.bg-green{background:#1ABB9C !important;border:1px solid #1ABB9C !important;color:#fff}.bg-red{background:#E74C3C !important;border:1px solid #E74C3C !important;color:#fff}.bg-blue{background:#3498DB !important;border:1px solid #3498DB !important;color:#fff}.bg-orange{background:#F39C12 !important;border:1px solid #F39C12 !important;color:#fff}.bg-purple{background:#9B59B6 !important;border:1px solid #9B59B6 !important;color:#fff}.bg-blue-sky{background:#50C1CF !important;border:1px solid #50C1CF !important;color:#fff}.container{width:100%;padding:0}.navbar-nav>li>a,.navbar-brand,.navbar-nav>li>a{color:#fff !important}.top_nav .nav>li>a:focus,.top_nav .nav>li>a:hover,.top_nav .nav .open>a,.top_nav .nav .open>a:focus,.top_nav .nav .open>a:hover{background:#D9DEE4}body{color:#73879C;background:#2A3F54;font-family:\"Helvetica Neue\", Roboto, Arial, \"Droid Sans\", sans-serif;font-size:13px;font-weight:400;line-height:1.471}.main_container .top_nav{display:block;margin-left:230px}.no-padding{padding:0 !important}.page-title{width:100%;height:65px;padding:10px 0}.page-title .title_left{width:45%;float:left;display:block}.page-title .title_left h3{margin:9px 0}.page-title .title_right{width:55%;float:left;display:block}.page-title .title_right .pull-right{margin:10px 0}.fixed_height_320{height:320px}.fixed_height_390{height:390px}.fixed_height_200{height:200px}.overflow_hidden{overflow:hidden}.progress-bar-dark{background-color:#34495E !important}.progress-bar-gray{background-color:#BDC3C7 !important}table.no-margin .progress{margin-bottom:0}.main_content{padding:10px 20px}.col-md-55{width:50%;margin-bottom:10px}@media (min-width: 768px){.col-md-55{width:20%}}@media (min-width: 992px){.col-md-55{width:20%}}@media (min-width: 1200px){.col-md-55{width:20%}}@media (min-width: 192px) and (max-width: 1270px){table.tile_info span.right{margin-right:7px;float:left}}.center-margin{margin:0 auto;float:none !important}.col-md-55,.col-xs-1,.col-sm-1,.col-md-1,.col-lg-1,.col-xs-2,.col-sm-2,.col-md-2,.col-lg-2,.col-xs-3,.col-sm-3,.col-md-3,.col-lg-3,.col-xs-4,.col-sm-4,.col-md-4,.col-lg-4,.col-xs-5,.col-sm-5,.col-md-5,.col-lg-5,.col-xs-6,.col-sm-6,.col-md-6,.col-lg-6,.col-xs-7,.col-sm-7,.col-md-7,.col-lg-7,.col-xs-8,.col-sm-8,.col-md-8,.col-lg-8,.col-xs-9,.col-sm-9,.col-md-9,.col-lg-9,.col-xs-10,.col-sm-10,.col-md-10,.col-lg-10,.col-xs-11,.col-sm-11,.col-md-11,.col-lg-11,.col-xs-12,.col-sm-12,.col-md-12,.col-lg-12{position:relative;min-height:1px;float:left;padding-right:10px;padding-left:10px}.row{margin-right:-10px;margin-left:-10px}.grid_slider .col-md-6{padding:0 40px}h1,.h1,h2,.h2,h3,.h3{margin-top:10px;margin-bottom:10px}a{color:#5A738E;text-decoration:none}a,a:visited,a:focus,a:active,:visited,:focus,:active,.btn:focus,.btn:active:focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn.active.focus{outline:0}a:hover,a:focus{text-decoration:none}.navbar{margin-bottom:0}.navbar-header{background:#34495E}.navbar-right{margin-right:0}.top_nav .navbar-right{margin:0;width:70%;float:right}.top_nav .navbar-right li{display:inline-block;float:right;position:static}@media (min-width: 480px){.top_nav .navbar-right li{position:relative}}.top_nav .dropdown-menu li{width:100%}.top_nav .dropdown-menu li a{width:100%;padding:12px 20px}.top_nav li a i{font-size:15px}.navbar-static-top{position:fixed;top:0;width:100%}.sidebar-header{border-bottom:0;margin-top:46px}.sidebar-header:first-of-type{margin-top:0}.nav.side-menu>li{position:relative;display:block;cursor:pointer}.nav.side-menu>li>a{margin-bottom:6px}.nav.side-menu>li>a:hover{color:#F2F5F7 !important}.nav.side-menu>li>a:hover,.nav>li>a:focus{text-decoration:none;background:transparent}.nav.child_menu{display:none}.nav.child_menu li:hover,.nav.child_menu li.active{background-color:rgba(255,255,255,0.06)}.nav.child_menu li{padding-left:36px}.nav-md ul.nav.child_menu li:before{background:#425668;bottom:auto;content:\"\";height:8px;left:23px;margin-top:15px;position:absolute;right:auto;width:8px;z-index:1;border-radius:50%}.nav-md ul.nav.child_menu li:after{border-left:1px solid #425668;bottom:0;content:\"\";left:27px;position:absolute;top:0}.nav.side-menu>li>a,.nav.child_menu>li>a{color:#E7E7E7;font-weight:500}.nav.child_menu li li:hover,.nav.child_menu li li.active{background:none}.nav.child_menu li li a:hover,.nav.child_menu li li a.active{color:#fff}.nav>li>a{position:relative;display:block;padding:13px 15px 12px}.nav.side-menu>li.current-page,.nav.side-menu>li.active{border-right:5px solid #1ABB9C}.nav li.current-page{background:rgba(255,255,255,0.05)}.nav li li li.current-page{background:none}.nav li li.current-page a{color:#fff}.nav.side-menu>li.active>a{text-shadow:rgba(0,0,0,0.25) 0 -1px 0;background:linear-gradient(#334556, #2C4257),#2A3F54;box-shadow:rgba(0,0,0,0.25) 0 1px 0,inset rgba(255,255,255,0.16) 0 1px 0}.navbar-brand,.navbar-nav>li>a{font-weight:500;color:#ECF0F1 !important;margin-left:0 !important;line-height:32px}.site_title{text-overflow:ellipsis;overflow:hidden;font-weight:400;font-size:22px;width:100%;color:#ECF0F1 !important;margin-left:0 !important;line-height:59px;display:block;height:55px;margin:0;padding-left:10px}.site_title:hover,.site_title:focus{text-decoration:none}.nav.navbar-nav>li>a{color:#515356 !important}.nav.top_menu>li>a{position:relative;display:block;padding:10px 15px;color:#34495E !important}.nav>li>a:hover,.nav>li>a:focus{background-color:transparent}.top_search{padding:0}.top_search .form-control{border-right:0;box-shadow:inset 0 1px 0px rgba(0,0,0,0.075);border-radius:25px 0px 0px 25px;padding-left:20px;border:1px solid rgba(221,226,232,0.49)}.top_search .form-control:focus{border:1px solid rgba(221,226,232,0.49);border-right:0}.top_search .input-group-btn button{border-radius:0px 25px 25px 0px;border:1px solid rgba(221,226,232,0.49);border-left:0;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);color:#93A2B2;margin-bottom:0 !important}.toggle{float:left;margin:0;padding-top:16px;width:70px}.toggle a{padding:15px 15px 0;margin:0;cursor:pointer}.toggle a i{font-size:26px}.nav.child_menu>li>a{color:rgba(255,255,255,0.75);font-size:12px;padding:9px}.panel_toolbox{float:right;min-width:70px}.panel_toolbox>li{float:left;cursor:pointer}.panel_toolbox>li>a{padding:5px;color:#C5C7CB;font-size:14px}.panel_toolbox>li>a:hover{background:#F5F7FA}.line_30{line-height:30px}.main_menu_side{padding:0}.bs-docs-sidebar .nav>li>a{display:block;padding:4px 6px}footer{background:#fff;padding:15px 20px;display:block}@media (min-width: 768px){footer{margin-left:230px}}.nav-sm footer{margin-left:70px}.footer_fixed footer{position:fixed;left:0px;bottom:0px;width:100%}@media (min-width: 768px){.footer_fixed footer{margin-left:0}}@media (min-width: 768px){.footer_fixed .nav-sm footer{margin-left:0}}.tile-stats.sparkline{padding:10px;text-align:center}.jqstooltip{background:#34495E !important;width:30px !important;height:22px !important;text-decoration:none}.tooltip{display:block !important}.tiles{border-top:1px solid #ccc;margin-top:15px;padding-top:5px;margin-bottom:0}.tile{overflow:hidden}.top_tiles{margin-bottom:0}.top_tiles .tile h2{font-size:30px;line-height:30px;margin:3px 0 7px;font-weight:bold}article.media{width:100%}*,*:before,*:after{box-sizing:border-box}#integration-list{width:100%;margin:0 auto;display:table}#integration-list ul{padding:0;margin:20px 0;color:#555}#integration-list ul>li{list-style:none;border-top:1px solid #ddd;display:block;padding:15px;overflow:hidden}#integration-list ul:last-child{border-bottom:1px solid #ddd}#integration-list ul>li:hover{background:#efefef}.expand{display:block;text-decoration:none;color:#555;cursor:pointer}.expand h2{width:85%;float:left}h2{font-size:18px;font-weight:400}#left,#right{display:table}#sup{display:table-cell;vertical-align:middle;width:80%}.detail a{text-decoration:none;color:#C0392B;border:1px solid #C0392B;padding:6px 10px 5px;font-size:13px;margin-right:7px}.detail{margin:10px 0 10px 0px;display:none;line-height:22px;height:150px}.detail span{margin:0}.right-arrow{width:10px;float:right;font-weight:bold;font-size:20px}.accordion .panel{margin-bottom:5px;border-radius:0;border-bottom:1px solid #efefef}.accordion .panel-heading{background:#F2F5F7;padding:13px;width:100%;display:block}.accordion .panel:hover{background:#F2F5F7}.x_panel{position:relative;width:100%;margin-bottom:10px;padding:10px 17px;display:inline-block;background:#fff;border:1px solid #E6E9ED;-webkit-column-break-inside:avoid;-moz-column-break-inside:avoid;column-break-inside:avoid;opacity:1;transition:all .2s ease}.x_title{border-bottom:2px solid #E6E9ED;padding:1px 5px 6px;margin-bottom:10px}.x_title .filter{width:40%;float:right}.x_title h2{margin:5px 0 6px;float:left;display:block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.x_title h2 small{margin-left:10px}.x_title span{color:#BDBDBD}.x_content{padding:0 5px 6px;position:relative;width:100%;float:left;clear:both;margin-top:5px}.x_content h4{font-size:16px;font-weight:500}legend{padding-bottom:7px}.demo-placeholder{height:280px}.profile_details:nth-child(3n){clear:both}.profile_details .profile_view{display:inline-block;padding:10px 0 0;background:#fff}.profile_details .profile_view .divider{border-top:1px solid #e5e5e5;padding-top:5px;margin-top:5px}.profile_details .profile_view .ratings{margin-bottom:0}.profile_details .profile_view .bottom{background:#F2F5F7;padding:9px 0;border-top:1px solid #E6E9ED}.profile_details .profile_view .left{margin-top:20px}.profile_details .profile_view .left p{margin-bottom:3px}.profile_details .profile_view .right{margin-top:0px;padding:10px}.profile_details .profile_view .img-circle{border:1px solid #E6E9ED;padding:2px}.profile_details .profile_view h2{margin:5px 0}.profile_details .profile_view .ratings{text-align:left;font-size:16px}.profile_details .profile_view .brief{margin:0;font-weight:300}.profile_details .profile_left{background:white}.pagination.pagination-split li{display:inline-block;margin-right:3px}.pagination.pagination-split li a{border-radius:4px;color:#768399;-moz-border-radius:4px;-webkit-border-radius:4px}table.tile h3,table.tile h4,table.tile span{font-weight:bold;vertical-align:middle !important}table.tile th,table.tile td{text-align:center}table.tile th{border-bottom:1px solid #E6ECEE}table.tile td{padding:5px 0}table.tile td ul{text-align:left;padding-left:0}table.tile td ul li{list-style:none;width:100%}table.tile td ul li a{width:100%}table.tile td ul li a big{right:0;float:right;margin-right:13px}table.tile_info{width:100%}table.tile_info td{text-align:left;padding:1px;font-size:15px}table.tile_info td p{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;line-height:28px}table.tile_info td i{margin-right:8px;font-size:17px;float:left;width:18px;line-height:28px}table.tile_info td:first-child{width:83%}td span{line-height:28px}.sidebar-widget{overflow:hidden}.error-number{font-size:90px;line-height:90px;margin:20px 0}.col-middle{margin-top:5%}.mid_center{width:370px;margin:0 auto;text-align:center;padding:10px 20px}h3.degrees{font-size:22px;font-weight:400;text-align:center}.degrees:after{content:\"o\";position:relative;top:-12px;font-size:13px;font-weight:300}.daily-weather .day{font-size:14px;border-top:2px solid rgba(115,135,156,0.36);text-align:center;border-bottom:2px solid rgba(115,135,156,0.36);padding:5px 0}.weather-days .col-sm-2{overflow:hidden;width:16.66666667%}.weather .row{margin-bottom:0}.bulk-actions{display:none}table.countries_list{width:100%}table.countries_list td{padding:0 10px;line-height:30px;border-top:1px solid #eeeeee}.dataTables_paginate a{padding:6px 9px !important;background:#ddd !important;border-color:#ddd !important}.paging_full_numbers a.paginate_active{background-color:rgba(38,185,154,0.59) !important;border-color:rgba(38,185,154,0.59) !important}button.DTTT_button,div.DTTT_button,a.DTTT_button{border:1px solid #E7E7E7 !important;background:#E7E7E7 !important;box-shadow:none !important}table.jambo_table{border:1px solid rgba(221,221,221,0.78)}table.jambo_table thead{background:rgba(52,73,94,0.94);color:#ECF0F1}table.jambo_table tbody tr:hover td{background:rgba(38,185,154,0.07);border-top:1px solid rgba(38,185,154,0.11);border-bottom:1px solid rgba(38,185,154,0.11)}table.jambo_table tbody tr.selected{background:rgba(38,185,154,0.16)}table.jambo_table tbody tr.selected td{border-top:1px solid rgba(38,185,154,0.4);border-bottom:1px solid rgba(38,185,154,0.4)}.dataTables_paginate a{background:#ff0000}.dataTables_wrapper{position:relative;clear:both;zoom:1}.dataTables_processing{position:absolute;top:50%;left:50%;width:250px;height:30px;margin-left:-125px;margin-top:-15px;padding:14px 0 2px 0;border:1px solid #ddd;text-align:center;color:#999;font-size:14px;background-color:white}.dataTables_length{width:40%;float:left}.dataTables_filter{width:50%;float:right;text-align:right}.dataTables_info{width:60%;float:left}.dataTables_paginate{float:right;text-align:right}table.dataTable th.focus,table.dataTable td.focus{outline:2px solid #1ABB9C !important;outline-offset:-1px}.paginate_disabled_previous,.paginate_enabled_previous,.paginate_disabled_next,.paginate_enabled_next{height:19px;float:left;cursor:pointer;color:#111 !important}.paginate_disabled_previous:hover,.paginate_enabled_previous:hover,.paginate_disabled_next:hover,.paginate_enabled_next:hover{text-decoration:none !important}.paginate_disabled_previous:active,.paginate_enabled_previous:active,.paginate_disabled_next:active,.paginate_enabled_next:active{outline:none}.paginate_disabled_previous,.paginate_disabled_next{color:#666 !important}.paginate_disabled_previous,.paginate_enabled_previous{padding-left:23px}.paginate_disabled_next,.paginate_enabled_next{padding-right:23px;margin-left:10px}.paginate_disabled_previous{background:url(\"../images/back_disabled.png\") no-repeat top left}.paginate_enabled_previous{background:url(\"../images/back_enabled.png\") no-repeat top left}.paginate_enabled_previous:hover{background:url(\"../images/back_enabled_hover.png\") no-repeat top left}.paginate_disabled_next{background:url(\"../images/forward_disabled.png\") no-repeat top right}.paginate_enabled_next{background:url(\"../images/forward_enabled.png\") no-repeat top right}.paginate_enabled_next:hover{background:url(\"../images/forward_enabled_hover.png\") no-repeat top right}table.display{margin:0 auto;clear:both;width:100%}table.display thead th{padding:8px 18px 8px 10px;border-bottom:1px solid black;font-weight:bold;cursor:pointer}table.display tfoot th{padding:3px 18px 3px 10px;border-top:1px solid black;font-weight:bold}table.display tr.heading2 td{border-bottom:1px solid #aaa}table.display td{padding:3px 10px}table.display td.center{text-align:center}table.display thead th:active,table.display thead td:active{outline:none}.dataTables_scroll{clear:both}.dataTables_scrollBody{*margin-top:-1px;-webkit-overflow-scrolling:touch}.top .dataTables_info{float:none}.clear{clear:both}.dataTables_empty{text-align:center}tfoot input{margin:0.5em 0;width:100%;color:#444}tfoot input.search_init{color:#999}td.group{background-color:#d1cfd0;border-bottom:2px solid #A19B9E;border-top:2px solid #A19B9E}td.details{background-color:#d1cfd0;border:2px solid #A19B9E}.example_alt_pagination div.dataTables_info{width:40%}.paging_full_numbers{width:400px;height:22px;line-height:22px}.paging_full_numbers a:active{outline:none}.paging_full_numbers a:hover{text-decoration:none}.paging_full_numbers a.paginate_button,.paging_full_numbers a.paginate_active{border:1px solid #aaa;-webkit-border-radius:5px;-moz-border-radius:5px;padding:2px 5px;margin:0 3px;cursor:pointer}.paging_full_numbers a.paginate_button{background-color:#ddd}.paging_full_numbers a.paginate_button:hover{background-color:#ccc;text-decoration:none !important}.paging_full_numbers a.paginate_active{background-color:#99B3FF}table.display tr.even.row_selected td{background-color:#B0BED9}table.display tr.odd.row_selected td{background-color:#9FAFD1}div.box{height:100px;padding:10px;overflow:auto;border:1px solid #8080FF;background-color:#E5E5FF}ul.msg_list li{background:#f7f7f7;padding:5px;display:-ms-flexbox;display:flex;margin:6px 6px 0;width:96% !important}ul.msg_list li:last-child{margin-bottom:6px;padding:10px}ul.msg_list li a{padding:3px 5px !important}ul.msg_list li a .image img{border-radius:2px 2px 2px 2px;-webkit-border-radius:2px 2px 2px 2px;float:left;margin-right:10px;width:11%}ul.msg_list li a .time{font-size:11px;font-style:italic;font-weight:bold;position:absolute;right:35px}ul.msg_list li a .message{display:block !important;font-size:11px}.dropdown-menu.msg_list span{white-space:normal}.dropdown-menu{border:medium none;box-shadow:none;display:none;float:left;font-size:12px;left:0;list-style:none outside none;padding:0;position:absolute;text-shadow:none;top:100%;z-index:9998;border:1px solid #D9DEE4;border-top-left-radius:0;border-top-right-radius:0}.dropdown-menu>li>a{color:#5A738E}.navbar-nav .open .dropdown-menu{position:absolute;background:#fff;margin-top:0;border:1px solid #D9DEE4;-webkit-box-shadow:none;right:0;left:auto;width:220px}.navbar-nav .open .dropdown-menu.msg_list{width:300px}.info-number .badge{font-size:10px;font-weight:normal;line-height:13px;padding:2px 6px;position:absolute;right:2px;top:8px}ul.to_do{padding:0}ul.to_do li{background:#f3f3f3;border-radius:3px;position:relative;padding:7px;margin-bottom:5px;list-style:none}ul.to_do p{margin:0}.dashboard-widget{background:#f6f6f6;border-top:5px solid #79C3DF;border-radius:3px;padding:5px 10px 10px}.dashboard-widget .dashboard-widget-title{font-weight:normal;border-bottom:1px solid #c1cdcd;margin:0 0 10px 0;padding-bottom:5px;padding-left:40px;line-height:30px}.dashboard-widget .dashboard-widget-title i{font-size:100%;margin-left:-35px;margin-right:10px;color:#33a1c9;padding:3px 6px;border:1px solid #abd9ea;border-radius:5px;background:#fff}ul.quick-list{width:45%;padding-left:0;display:inline-block}ul.quick-list li{padding-left:10px;list-style:none;margin:0;padding-bottom:6px;padding-top:4px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}ul.quick-list li i{padding-right:10px;color:#757679}.dashboard-widget-content{padding-top:9px}.dashboard-widget-content .sidebar-widget{width:50%;display:inline-block;vertical-align:top;background:#fff;border:1px solid #abd9ea;border-radius:5px;text-align:center;float:right;padding:2px;margin-top:10px}.widget_summary{width:100%;display:-ms-inline-flexbox;display:inline-flex}.widget_summary .w_left{float:left;text-align:left}.widget_summary .w_center{float:left}.widget_summary .w_right{float:left;text-align:right}.widget_summary .w_right span{font-size:20px}.w_20{width:20%}.w_25{width:25%}.w_55{width:55%}h5.graph_title{text-align:left;margin-left:10px}h5.graph_title i{margin-right:10px;font-size:17px}span.right{float:right;font-size:14px !important}.tile_info a{text-overflow:ellipsis}.sidebar-footer{bottom:0px;clear:both;display:block;padding:5px 0 0 0;position:fixed;width:230px;background:#2A3F54}.sidebar-footer a{padding:7px 0 3px;text-align:center;width:25%;font-size:17px;display:block;float:left;background:#172D44}.sidebar-footer a:hover{background:#425567}.tile_count{margin-bottom:20px;margin-top:20px}.tile_count .tile_stats_count{border-bottom:1px solid #D9DEE4;padding:0 10px 0 20px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;position:relative}@media (min-width: 992px){.tile_count .tile_stats_count{margin-bottom:10px;border-bottom:0;padding-bottom:10px}}.tile_count .tile_stats_count:before{content:\"\";position:absolute;left:0;height:65px;border-left:2px solid #ADB2B5;margin-top:10px}@media (min-width: 992px){.tile_count .tile_stats_count:first-child:before{border-left:0}}.tile_count .tile_stats_count .count{font-size:30px;line-height:47px;font-weight:600}@media (min-width: 768px){.tile_count .tile_stats_count .count{font-size:40px}}@media (min-width: 992px) and (max-width: 1100px){.tile_count .tile_stats_count .count{font-size:30px}}.tile_count .tile_stats_count span{font-size:12px}@media (min-width: 768px){.tile_count .tile_stats_count span{font-size:13px}}.tile_count .tile_stats_count .count_bottom i{width:12px}.dashboard_graph{background:#fff;padding:7px 10px}.dashboard_graph .col-md-9,.dashboard_graph .col-md-3{padding:0}a.user-profile{color:#5E6974 !important}.user-profile img{width:29px;height:29px;border-radius:50%;margin-right:10px}ul.top_profiles{height:330px;width:100%}ul.top_profiles li{margin:0;padding:3px 5px}ul.top_profiles li:nth-child(odd){background-color:#eee}.media .profile_thumb{border:1px solid;width:50px;height:50px;margin:5px 10px 5px 0;border-radius:50%;padding:9px 12px}.media .profile_thumb i{font-size:30px}.media .date{background:#ccc;width:52px;margin-right:10px;border-radius:10px;padding:5px}.media .date .month{margin:0;text-align:center;color:#fff}.media .date .day{text-align:center;color:#fff;font-size:27px;margin:0;line-height:27px;font-weight:bold}.event .media-body a.title{font-weight:bold}.event .media-body p{margin-bottom:0}h4.graph_title{margin:7px;text-align:center}.fontawesome-icon-list .fa-hover a:hover{background-color:#ddd;color:#fff;text-decoration:none}.fontawesome-icon-list .fa-hover a{display:block;line-height:32px;height:32px;padding-left:10px;border-radius:4px}.fontawesome-icon-list .fa-hover a:hover .fa{font-size:28px;vertical-align:-6px}.fontawesome-icon-list .fa-hover a .fa{width:32px;font-size:16px;display:inline-block;text-align:right;margin-right:10px}.main_menu .fa{width:26px;opacity:.99;display:inline-block;font-family:FontAwesome;font-style:normal;font-weight:normal;font-size:18px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.tile-stats{position:relative;display:block;margin-bottom:12px;border:1px solid #E4E4E4;-webkit-border-radius:5px;overflow:hidden;padding-bottom:5px;-webkit-background-clip:padding-box;-moz-border-radius:5px;-moz-background-clip:padding;border-radius:5px;background-clip:padding-box;background:#FFF;transition:all 300ms ease-in-out}.tile-stats:hover .icon i{animation-name:tansformAnimation;animation-duration:.5s;animation-iteration-count:1;color:rgba(58,58,58,0.41);animation-timing-function:ease;animation-fill-mode:forwards;-webkit-animation-name:tansformAnimation;-webkit-animation-duration:.5s;-webkit-animation-iteration-count:1;-webkit-animation-timing-function:ease;-webkit-animation-fill-mode:forwards;-moz-animation-name:tansformAnimation;-moz-animation-duration:.5s;-moz-animation-iteration-count:1;-moz-animation-timing-function:ease;-moz-animation-fill-mode:forwards}.tile-stats .icon{width:20px;height:20px;color:#BAB8B8;position:absolute;right:53px;top:22px;z-index:1}.tile-stats .icon i{margin:0;font-size:60px;line-height:0;vertical-align:bottom;padding:0}.tile-stats .count{font-size:38px;font-weight:bold;line-height:1.65857}.tile-stats .count,.tile-stats h3,.tile-stats p{position:relative;margin:0;margin-left:10px;z-index:5;padding:0}.tile-stats h3{color:#BAB8B8}.tile-stats p{margin-top:5px;font-size:12px}.tile-stats>.dash-box-footer{position:relative;text-align:center;margin-top:5px;padding:3px 0;color:#fff;color:rgba(255,255,255,0.8);display:block;z-index:10;background:rgba(0,0,0,0.1);text-decoration:none}.tile-stats>.dash-box-footer:hover{color:#fff;background:rgba(0,0,0,0.15)}.tile-stats>.dash-box-footer:hover{color:#fff;background:rgba(0,0,0,0.15)}table.tile_info{padding:10px 15px}table.tile_info span.right{margin-right:0;float:right;position:absolute;right:4%}.tile:hover{text-decoration:none}.tile_header{border-bottom:transparent;padding:7px 15px;margin-bottom:15px;background:#E7E7E7}.tile_head h4{margin-top:0;margin-bottom:5px}.tiles-bottom{padding:5px 10px;margin-top:10px;background:rgba(194,194,194,0.3);text-align:left}a.star{color:#428bca !important}.mail_content{background:none repeat scroll 0 0 #FFFFFF;border-radius:4px;margin-top:20px;min-height:500px;padding:10px 11px;width:100%}.list-btn-mail{margin-bottom:15px}.list-btn-mail.active{border-bottom:1px solid #39B3D7;padding:0 0 14px}.list-btn-mail>i{float:left;font-size:18px;font-style:normal;width:33px}.list-btn-mail>.cn{background:none repeat scroll 0 0 #39B3D7;border-radius:12px;color:#FFFFFF;float:right;font-style:normal;padding:0 5px}.button-mail{margin:0 0 15px !important;text-align:left;width:100%}.buttons,button,.btn{margin-bottom:5px;margin-right:5px}.btn-group-vertical .btn,.btn-group .btn{margin-bottom:0;margin-right:0}.mail_list_column{border-left:1px solid #DBDBDB}.mail_view{border-left:1px solid #DBDBDB}.mail_list{width:100%;border-bottom:1px solid #DBDBDB;margin-bottom:2px;display:inline-block}.mail_list .left{width:5%;float:left;margin-right:3%}.mail_list .right{width:90%;float:left}.mail_list h3{font-size:15px;font-weight:bold;margin:0px 0 6px}.mail_list h3 small{float:right;color:#ADABAB;font-size:11px;line-height:20px}.mail_list .badge{padding:3px 6px;font-size:8px;background:#BAB7B7}@media (max-width: 767px){.mail_list{margin-bottom:5px;display:inline-block}}.mail_heading h4{font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px;margin-top:20px}.attachment{margin-top:30px}.attachment ul{width:100%;list-style:none;padding-left:0;display:inline-block;margin-bottom:30px}.attachment ul li{float:left;width:150px;margin-right:10px;margin-bottom:10px}.attachment ul li img{height:150px;border:1px solid #ddd;padding:5px;margin-bottom:10px}.attachment ul li span{float:right}.attachment .file-name{float:left}.attachment .links{width:100%;display:inline-block}.compose{padding:0;position:fixed;bottom:0;right:0;background:#fff;border:1px solid #D9DEE4;border-right:0;border-bottom:0;border-top-left-radius:5px;z-index:9999;display:none}.compose .compose-header{padding:5px;background:#169F85;color:#fff;border-top-left-radius:5px}.compose .compose-header .close{text-shadow:0 1px 0 #ffffff;line-height:.8}.compose .compose-body .editor.btn-toolbar{margin:0}.compose .compose-body .editor-wrapper{height:100%;min-height:50px;max-height:180px;border-radius:0;border-left:none;border-right:none;overflow:auto}.compose .compose-footer{padding:10px}.editor.btn-toolbar{zoom:1;background:#F7F7F7;margin:5px 2px;padding:3px 0;border:1px solid #EFEFEF}.input-group{margin-bottom:10px}.ln_solid{border-top:1px solid #e5e5e5;color:#ffffff;background-color:#ffffff;height:1px;margin:20px 0}span.section{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}.form-control{border-radius:0;width:100%}.form-horizontal .control-label{padding-top:8px}.form-control:focus{border-color:#CCD0D7;box-shadow:none !important}legend{font-size:18px;color:inherit}.form-horizontal .form-group{margin-right:0;margin-left:0}.form-control-feedback{margin-top:8px;height:23px;color:#bbb;line-height:24px;font-size:15px}.form-control-feedback.left{border-right:1px solid #ccc;left:13px}.form-control-feedback.right{border-left:1px solid #ccc;right:13px}.form-control.has-feedback-left{padding-left:45px}.form-control.has-feedback-right{padding-right:45px}.form-group{margin-bottom:10px}.validate{margin-top:10px}.invalid-form-error-message{margin-top:10px;padding:5px}.invalid-form-error-message.filled{border-left:2px solid #E74C3C}p.parsley-success{color:#468847;background-color:#DFF0D8;border:1px solid #D6E9C6}p.parsley-error{color:#B94A48;background-color:#F2DEDE;border:1px solid #EED3D7}ul.parsley-errors-list{list-style:none;color:#E74C3C;padding-left:0}input.parsley-error,textarea.parsley-error,select.parsley-error{background:#FAEDEC;border:1px solid #E85445}.btn-group .parsley-errors-list{display:none}.bad input,.bad select,.bad textarea{border:1px solid #CE5454;box-shadow:0 0 4px -2px #CE5454;position:relative;left:0;-moz-animation:.7s 1 shake linear;-webkit-animation:0.7s 1 shake linear}.item input,.item textarea{transition:0.42s}.item .alert{float:left;margin:0 0 0 20px;padding:3px 10px;color:#FFF;border-radius:3px 4px 4px 3px;background-color:#CE5454;max-width:170px;white-space:pre;position:relative;left:-15px;opacity:0;z-index:1;transition:0.15s ease-out}.item .alert::after{content:'';display:block;height:0;width:0;border-color:transparent #CE5454 transparent transparent;border-style:solid;border-width:11px 7px;position:absolute;left:-13px;top:1px}.item.bad .alert{left:0;opacity:1}.inl-bl{display:inline-block}.well .markup{background:#fff;color:#777;position:relative;padding:45px 15px 15px;margin:15px 0 0 0;background-color:#fff;border-radius:0 0 4px 4px;box-shadow:none}.well .markup::after{content:\"Example\";position:absolute;top:15px;left:15px;font-size:12px;font-weight:bold;color:#bbb;text-transform:uppercase;letter-spacing:1px}.autocomplete-suggestions{border:1px solid #e4e4e4;background:#F4F4F4;cursor:default;overflow:auto}.autocomplete-suggestion{padding:2px 5px;font-size:1.2em;white-space:nowrap;overflow:hidden}.autocomplete-selected{background:#f0f0f0}.autocomplete-suggestions strong{font-weight:normal;color:#3399ff;font-weight:bolder}.btn{border-radius:3px}a.btn-success,a.btn-primary,a.btn-warning,a.btn-danger{color:#fff}.btn-success{background:#26B99A;border:1px solid #169F85}.btn-success:hover,.btn-success:focus,.btn-success:active,.btn-success.active,.open .dropdown-toggle.btn-success{background:#169F85}.btn-dark{color:#E9EDEF;background-color:#4B5F71;border-color:#364B5F}.btn-dark:hover,.btn-dark:focus,.btn-dark:active,.btn-dark.active,.open .dropdown-toggle.btn-dark{color:#FFFFFF;background-color:#394D5F;border-color:#394D5F}.btn-round{border-radius:30px}.btn.btn-app{position:relative;padding:15px 5px;margin:0 0 10px 10px;min-width:80px;height:60px;box-shadow:none;border-radius:0;text-align:center;color:#666;border:1px solid #ddd;background-color:#fafafa;font-size:12px}.btn.btn-app>.fa,.btn.btn-app>.glyphicon,.btn.btn-app>.ion{font-size:20px;display:block}.btn.btn-app:hover{background:#f4f4f4;color:#444;border-color:#aaa}.btn.btn-app:active,.btn.btn-app:focus{box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn.btn-app>.badge{position:absolute;top:-3px;right:-10px;font-size:10px;font-weight:400}textarea{padding:10px;vertical-align:top;width:200px}textarea:focus{outline-style:solid;outline-width:2px}.btn_{display:inline-block;padding:3px 9px;margin-bottom:0;font-size:14px;line-height:20px;text-align:center;vertical-align:middle;cursor:pointer;color:#333333;text-shadow:0 1px 1px rgba(255,255,255,0.75);background-color:#f5f5f5;background-image:linear-gradient(to bottom, #fff, #e6e6e6);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe6e6e6', GradientType=0);border-color:#e6e6e6 #e6e6e6 #bfbfbf;border-color:rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.25);filter:progid:DXImageTransform.Microsoft.gradient(enabled=false);border:1px solid #cccccc;border-bottom-color:#b3b3b3;border-radius:4px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.05)}.bs-glyphicons{margin:0 -10px 20px;overflow:hidden}.bs-glyphicons-list{padding-left:0;list-style:none}.bs-glyphicons li{float:left;width:25%;height:115px;padding:10px;font-size:10px;line-height:1.4;text-align:center;background-color:#f9f9f9;border:1px solid #fff}.bs-glyphicons .glyphicon{margin-top:5px;margin-bottom:10px;font-size:24px}.bs-glyphicons .glyphicon-class{display:block;text-align:center;word-wrap:break-word}.bs-glyphicons li:hover{color:#fff;background-color:#1ABB9C}@media (min-width: 768px){.bs-glyphicons{margin-right:0;margin-left:0}.bs-glyphicons li{width:12.5%;font-size:12px}}.tagsinput{border:1px solid #CCC;background:#FFF;padding:6px 6px 0;width:300px;overflow-y:auto}span.tag{-moz-border-radius:2px;-webkit-border-radius:2px;display:block;float:left;padding:5px 9px;text-decoration:none;background:#1ABB9C;color:#F1F6F7;margin-right:5px;font-weight:500;margin-bottom:5px;font-family:helvetica}span.tag a{color:#F1F6F7 !important}.tagsinput span.tag a{font-weight:bold;color:#82ad2b;text-decoration:none;font-size:11px}.tagsinput input{width:80px;margin:0px;font-family:helvetica;font-size:13px;border:1px solid transparent;padding:3px;background:transparent;color:#000;outline:0px}.tagsinput div{display:block;float:left}.tags_clear{clear:both;width:100%;height:0px}.not_valid{background:#FBD8DB !important;color:#90111A !important}ul.bar_tabs{overflow:visible;background:#F5F7FA;height:25px;margin:21px 0 14px;padding-left:14px;position:relative;z-index:1;width:100%;border-bottom:1px solid #E6E9ED}ul.bar_tabs>li{border:1px solid #E6E9ED;color:#333 !important;margin-top:-17px;margin-left:8px;background:#fff;border-bottom:none;border-radius:4px 4px 0 0}ul.bar_tabs>li.active{border-right:6px solid #D3D6DA;border-top:0;margin-top:-15px}ul.bar_tabs>li a{padding:10px 17px;background:#F5F7FA;margin:0;border-top-right-radius:0}ul.bar_tabs>li a:hover{border:1px solid transparent}ul.bar_tabs>li.active a{border-bottom:none}ul.bar_tabs.right{padding-right:14px}ul.bar_tabs.right li{float:right}a:focus{outline:none}ul.timeline li{position:relative;border-bottom:1px solid #e8e8e8;clear:both}.timeline .block{margin:0;border-left:3px solid #e8e8e8;overflow:visible;padding:10px 15px;margin-left:105px}.timeline.widget{min-width:0;max-width:inherit}.timeline.widget .block{margin-left:5px}.timeline .tags{position:absolute;top:15px;left:0;width:84px}.timeline .tag{display:block;height:30px;font-size:13px;padding:8px}.timeline .tag span{display:block;overflow:hidden;width:100%;white-space:nowrap;text-overflow:ellipsis}.tag{line-height:1;background:#1ABB9C;color:#fff !important}.tag:after{content:\" \";height:30px;width:0;position:absolute;left:100%;top:0;margin:0;pointer-events:none;border-top:14px solid transparent;border-bottom:14px solid transparent;border-left:11px solid #1ABB9C}.timeline h2.title{position:relative;font-size:16px;margin:0}.timeline h2.title:before{content:\"\";position:absolute;left:-23px;top:3px;display:block;width:14px;height:14px;border:3px solid #d2d3d2;border-radius:14px;background:#f9f9f9}.timeline .byline{padding:.25em 0}.byline{-webkit-font-smoothing:antialiased;font-style:italic;font-size:.9375em;line-height:1.3;color:#aab6aa}ul.social li{border:0}.social-sidebar,.social-body{float:right}.social-sidebar{background:#EDEDED;width:22%}.social-body{border:1px solid #ccc;width:78%}.thumb img{width:50px;height:50px;border-radius:50%}.chat .thumb img{width:27px;height:27px;border-radius:50%}.chat .status{float:left;margin:16px 0 0 -16px;font-size:14px;font-weight:bold;width:12px;height:12px;display:block;border:2px solid #FFF;z-index:12312;border-radius:50%}.chat .status.online{background:#1ABB9C}.chat .status.away{background:#F39C12}.chat .status.offline{background:#ccc}.chat .media-body{padding-top:5px}.dashboard_graph .x_title{padding:5px 5px 7px}.dashboard_graph .x_title h3{margin:0;font-weight:normal}.chart{position:relative;display:inline-block;width:110px;height:110px;margin-top:5px;margin-bottom:5px;text-align:center}.chart canvas{position:absolute;top:0;left:0}.percent{display:inline-block;line-height:110px;z-index:2;font-size:18px}.percent:after{content:'%';margin-left:0.1em;font-size:.8em}.angular{margin-top:100px}.angular .chart{margin-top:0}.widget{min-width:250px;max-width:310px}.widget_tally_box .btn-group button{text-align:center}.widget_tally_box .btn-group button{color:inherit;font-weight:500;background-color:#f5f5f5;border:1px solid #e7e7e7}ul.widget_tally,ul.widget_tally li{width:100%}ul.widget_tally li{padding:2px 10px;border-bottom:1px solid #ECECEC;padding-bottom:4px}ul.widget_tally .month{width:70%;float:left}ul.widget_tally .count{width:30%;float:left;text-align:right}.pie_bg{border-bottom:1px solid rgba(101,204,182,0.16);padding-bottom:15px;border-radius:4px;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe6e6e6', GradientType=0);filter:progid:DXImageTransform.Microsoft.gradient(enabled=false);padding-bottom:10px;box-shadow:0 4px 6px -6px #222}.widget_tally_box .flex{display:-ms-flexbox;display:flex}ul.widget_profile_box{width:100%;height:42px;padding:3px;background:#ececec;margin-top:40px;margin-left:1px}ul.widget_profile_box li:first-child{width:25%;float:left}ul.widget_profile_box li:first-child a{float:left}ul.widget_profile_box li:last-child{width:25%;float:right}ul.widget_profile_box li:last-child a{float:right}ul.widget_profile_box li a{font-size:22px;text-align:center;width:35px;height:35px;border:1px solid rgba(52,73,94,0.44);display:block;border-radius:50%;padding:0px}ul.widget_profile_box li a:hover{color:#1ABB9C !important;border:1px solid #26b99a}ul.widget_profile_box li .profile_img{width:85px;height:85px;margin:0;margin-top:-28px}.widget_tally_box p,.widget_tally_box span{text-align:center}.widget_tally_box .name{text-align:center;margin:25px}.widget_tally_box .name_title{text-align:center;margin:5px}.widget_tally_box ul.legend{margin:0}.widget_tally_box ul.legend p,.widget_tally_box ul.legend span{text-align:left}.widget_tally_box ul.legend li .icon{font-size:20px;float:left;width:14px}.widget_tally_box ul.legend li .name{font-size:14px;margin:5px 0 0 14px;text-overflow:ellipsis;float:left}.widget_tally_box ul.legend p{display:inline-block;margin:0}.widget_tally_box ul.verticle_bars li{height:140px;width:23%}.widget .verticle_bars li .progress.vertical.progress_wide{width:65%}ul.count2{width:100%;margin-left:1px;border:1px solid #ddd;border-left:0;border-right:0;padding:10px 0}ul.count2 li{width:30%;text-align:center}ul.count2 li h3{font-weight:400;margin:0}ul.count2 li span{font-weight:300}.divider{border-bottom:1px solid #ddd;margin:10px}.divider-dashed{border-top:1px dashed #e7eaec;background-color:#ffffff;height:1px;margin:10px 0}ul.messages{padding:0;list-style:none}ul.messages li,.tasks li{border-bottom:1px dotted #e6e6e6;padding:8px 0}ul.messages li img.avatar,img.avatar{height:32px;width:32px;float:left;display:inline-block;border-radius:2px;padding:2px;background:#f7f7f7;border:1px solid #e6e6e6}ul.messages li .message_date{float:right;text-align:right}ul.messages li .message_wrapper{margin-left:50px;margin-right:40px}ul.messages li .message_wrapper h4.heading{font-weight:600;margin:0;cursor:pointer;margin-bottom:10px;line-height:100%}ul.messages li .message_wrapper blockquote{padding:0px 10px;margin:0;border-left:5px solid #eee}ul.user_data li{margin-bottom:6px}ul.user_data li p{margin-bottom:0}ul.user_data li .progress{width:90%}.project_progress .progress{margin-bottom:3px !important;margin-top:5px}.projects .list-inline{margin:0}.profile_title{background:#F5F7FA;border:0;padding:7px 0;display:-ms-flexbox;display:flex}ul.stats-overview{border-bottom:1px solid #e8e8e8;padding-bottom:10px;margin-bottom:10px}ul.stats-overview li{display:inline-block;text-align:center;padding:0 15px;width:30%;font-size:14px;border-right:1px solid #e8e8e8}ul.stats-overview li:last-child{border-right:0}ul.stats-overview li .name{font-size:12px}ul.stats-overview li .value{font-size:14px;font-weight:bold;display:block}ul.stats-overview li:first-child{padding-left:0}ul.project_files li{margin-bottom:5px}ul.project_files li a i{width:20px}.project_detail p{margin-bottom:10px}.project_detail p.title{font-weight:bold;margin-bottom:0}.avatar img{border-radius:50%;max-width:45px}.pricing{background:#fff}.pricing .title{background:#1ABB9C;height:110px;color:#fff;padding:15px 0 0;text-align:center}.pricing .title h2{text-transform:capitalize;font-size:18px;border-radius:5px 5px 0 0;margin:0;font-weight:400}.pricing .title h1{font-size:30px;margin:12px}.pricing .title span{background:rgba(51,51,51,0.28);padding:2px 5px}.pricing_features{background:#FAFAFA;padding:20px 15px;min-height:230px;font-size:13.5px}.pricing_features ul li{margin-top:10px}.pricing_footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;text-align:center;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.pricing_footer p{font-size:13px;padding:10px 0 2px;display:block}.ui-ribbon-container{position:relative}.ui-ribbon-container .ui-ribbon-wrapper{position:absolute;overflow:hidden;width:85px;height:88px;top:-3px;right:-3px}.ui-ribbon-container.ui-ribbon-primary .ui-ribbon{background-color:#5b90bf}.ui-ribbon-container .ui-ribbon{position:relative;display:block;text-align:center;font-size:15px;font-weight:700;color:#fff;transform:rotate(45deg);padding:7px 0;left:-5px;top:15px;width:120px;line-height:20px;background-color:#555;box-shadow:0 0 3px rgba(0,0,0,0.3)}.ui-ribbon-container.ui-ribbon-primary .ui-ribbon:after,.ui-ribbon-container.ui-ribbon-primary .ui-ribbon:before{border-top:2px solid #5b90bf}.ui-ribbon-container .ui-ribbon:before{left:0;bottom:-1px}.ui-ribbon-container .ui-ribbon:before{right:0}.ui-ribbon-container .ui-ribbon:after,.ui-ribbon-container .ui-ribbon:before{position:absolute;content:\" \";line-height:0;border-top:2px solid #555;border-left:2px solid transparent;border-right:2px solid transparent}.thumbnail .image{height:120px;overflow:hidden}.caption{padding:9px 5px;background:#F7F7F7}.caption p{margin-bottom:5px}.thumbnail{height:190px;overflow:hidden}.view{overflow:hidden;position:relative;text-align:center;box-shadow:1px 1px 2px #e6e6e6;cursor:default}.view .mask,.view .content{position:absolute;width:100%;overflow:hidden;top:0;left:0}.view img{display:block;position:relative}.view .tools{text-transform:uppercase;color:#fff;text-align:center;position:relative;font-size:17px;padding:3px;background:rgba(0,0,0,0.35);margin:43px 0 0 0}.mask.no-caption .tools{margin:90px 0 0 0}.view .tools a{display:inline-block;color:#FFF;font-size:18px;font-weight:400;padding:0 4px}.view p{font-family:Georgia, serif;font-style:italic;font-size:12px;position:relative;color:#fff;padding:10px 20px 20px;text-align:center}.view a.info{display:inline-block;text-decoration:none;padding:7px 14px;background:#000;color:#fff;text-transform:uppercase;box-shadow:0 0 1px #000}.view-first img{transition:all 0.2s linear}.view-first .mask{opacity:0;background-color:rgba(0,0,0,0.5);transition:all 0.4s ease-in-out}.view-first .tools{transform:translateY(-100px);opacity:0;transition:all 0.2s ease-in-out}.view-first p{transform:translateY(100px);opacity:0;transition:all 0.2s linear}.view-first:hover img{transform:scale(1.1)}.view-first:hover .mask{opacity:1}.view-first:hover .tools,.view-first:hover p{opacity:1;transform:translateY(0px)}.view-first:hover p{transition-delay:0.1s}/*!\n * bootstrap-vertical-tabs - v1.2.1\n * https://dbtek.github.io/bootstrap-vertical-tabs\n * 2014-11-07\n * Copyright (c) 2014 İsmail Demirbilek\n * License: MIT\n */.tabs-left,.tabs-right{border-bottom:none;padding-top:2px}.tabs-left{border-right:1px solid #F7F7F7}.tabs-right{border-left:1px solid #F7F7F7}.tabs-left>li,.tabs-right>li{float:none;margin-bottom:2px}.tabs-left>li{margin-right:-1px}.tabs-right>li{margin-left:-1px}.tabs-left>li.active>a,.tabs-left>li.active>a:hover,.tabs-left>li.active>a:focus{border-bottom-color:#F7F7F7;border-right-color:transparent}.tabs-right>li.active>a,.tabs-right>li.active>a:hover,.tabs-right>li.active>a:focus{border-bottom:1px solid #F7F7F7;border-left-color:transparent}.tabs-left>li>a{border-radius:4px 0 0 4px;margin-right:0;display:block;background:#F7F7F7;text-overflow:ellipsis;overflow:hidden}.tabs-right>li>a{border-radius:0 4px 4px 0;margin-right:0;background:#F7F7F7;text-overflow:ellipsis;overflow:hidden}.sideways{margin-top:50px;border:none;position:relative}.sideways>li{height:20px;width:120px;margin-bottom:100px}.sideways>li>a{border-bottom:1px solid #ddd;border-right-color:transparent;text-align:center;border-radius:4px 4px 0px 0px}.sideways>li.active>a,.sideways>li.active>a:hover,.sideways>li.active>a:focus{border-bottom-color:transparent;border-right-color:#ddd;border-left-color:#ddd}.sideways.tabs-left{left:-50px}.sideways.tabs-right{right:-50px}.sideways.tabs-right>li{transform:rotate(90deg)}.sideways.tabs-left>li{transform:rotate(-90deg)}.avatar-view{display:block;border:3px solid #fff;border-radius:5px;box-shadow:0 0 5px rgba(0,0,0,0.15);cursor:pointer;overflow:hidden}.avatar-body{padding-right:15px;padding-left:15px}.avatar-upload{overflow:hidden}.avatar-upload label{display:block;float:left;clear:left;width:100px}.avatar-upload input{display:block;margin-left:110px}.avater-alert{margin-top:10px;margin-bottom:10px}.avatar-wrapper{height:364px;width:100%;margin-top:15px;box-shadow:inset 0 0 5px rgba(0,0,0,0.25);background-color:#fcfcfc;overflow:hidden}.avatar-wrapper img{display:block;height:auto;max-width:100%}.avatar-preview{float:left;margin-top:15px;margin-right:15px;border:1px solid #eee;border-radius:4px;background-color:#fff;overflow:hidden}.avatar-preview:hover{border-color:#ccf;box-shadow:0 0 5px rgba(0,0,0,0.15)}.avatar-preview img{width:100%}.preview-lg{height:184px;width:184px;margin-top:15px}.preview-md{height:100px;width:100px}.preview-sm{height:50px;width:50px}@media (min-width: 992px){.avatar-preview{float:none}}.avatar-btns{margin-top:30px;margin-bottom:15px}.avatar-btns .btn-group{margin-right:5px}.loading{display:none;position:absolute;top:0;right:0;bottom:0;left:0;background:#fff url(\"../images/loading.gif\") no-repeat center center;opacity:.75;filter:alpha(opacity=75);z-index:20140628}.morris-hover{position:absolute;z-index:1000}.morris-hover.morris-default-style{padding:6px;color:#666;background:rgba(243,242,243,0.8);border:solid 2px rgba(195,194,196,0.8);font-family:sans-serif;font-size:12px;text-align:center}.morris-hover.morris-default-style .morris-hover-row-label{font-weight:bold;margin:0.25em 0}.morris-hover.morris-default-style .morris-hover-point{white-space:nowrap;margin:0.1em 0}.price{font-size:40px;font-weight:400;color:#26B99A;margin:0}.prod_title{border-bottom:1px solid #DFDFDF;padding-bottom:5px;margin:30px 0;font-size:20px;font-weight:400}.product-image img{width:90%}.prod_color li{margin:0 10px}.prod_color li p{margin-bottom:0}.prod_size li{padding:0}.prod_color .color{width:25px;height:25px;border:2px solid rgba(51,51,51,0.28) !important;padding:2px;border-radius:50px}.product_gallery a{width:100px;height:100px;float:left;margin:10px;border:1px solid #e5e5e5}.product_gallery a img{width:100%;margin-top:15px}.product_price{margin:20px 0;padding:5px 10px;background-color:#FFFFFF;text-align:left;border:2px dashed #E0E0E0}.price-tax{font-size:18px}.product_social{margin:20px 0}.product_social ul li a i{font-size:35px}.login{background:#F7F7F7}.login .fa-paw{font-size:26px}a.hiddenanchor{display:none}.login_wrapper{right:0px;margin:0px auto;margin-top:5%;max-width:350px;position:relative}.registration_form,.login_form{position:absolute;top:0px;width:100%}.registration_form{z-index:21;opacity:0;width:100%}.login_form{z-index:22}#signup:target ~ .login_wrapper .registration_form,#signin:target ~ .login_wrapper .login_form{z-index:22;animation-name:fadeInLeft;animation-delay:.1s}#signup:target ~ .login_wrapper .login_form,#signin:target ~ .login_wrapper .registration_form{animation-name:fadeOutLeft}.animate{-webkit-animation-duration:0.5s;-webkit-animation-timing-function:ease;-webkit-animation-fill-mode:both;-moz-animation-duration:0.5s;-moz-animation-timing-function:ease;-moz-animation-fill-mode:both;-o-animation-duration:0.5s;-o-animation-timing-function:ease;-o-animation-fill-mode:both;-ms-animation-duration:0.5s;-ms-animation-timing-function:ease;-ms-animation-fill-mode:both;animation-duration:0.5s;animation-timing-function:ease;animation-fill-mode:both}.login_box{padding:20px;margin:auto}.left{float:left}.alignleft{float:left;margin-right:15px}.alignright{float:right;margin-left:15px}.clearfix:after,form:after{content:\".\";display:block;height:0;clear:both;visibility:hidden}.login_content{margin:0 auto;padding:25px 0 0;position:relative;text-align:center;text-shadow:0 1px 0 #fff;min-width:280px}.login_content a,.login_content .btn-default:hover{text-decoration:none}.login_content a:hover{text-decoration:underline}.login_content h1{font:normal 25px Helvetica, Arial, sans-serif;letter-spacing:-0.05em;line-height:20px;margin:10px 0 30px}.login_content h1:before,.login_content h1:after{content:\"\";height:1px;position:absolute;top:10px;width:27%}.login_content h1:after{background:#7e7e7e;background:linear-gradient(left, #7e7e7e 0%, #fff 100%);right:0}.login_content h1:before{background:#7e7e7e;background:linear-gradient(right, #7e7e7e 0%, #fff 100%);left:0}.login_content h1:before,.login_content h1:after{content:\"\";height:1px;position:absolute;top:10px;width:20%}.login_content h1:after{background:#7e7e7e;background:linear-gradient(left, #7e7e7e 0%, #fff 100%);right:0}.login_content h1:before{background:#7e7e7e;background:linear-gradient(right, #7e7e7e 0%, #fff 100%);left:0}.login_content form{margin:20px 0;position:relative}.login_content form input[type=\"text\"],.login_content form input[type=\"email\"],.login_content form input[type=\"password\"]{border-radius:3px;-ms-box-shadow:0 1px 0 #fff,0 -2px 5px rgba(0,0,0,0.08) inset;-o-box-shadow:0 1px 0 #fff,0 -2px 5px rgba(0,0,0,0.08) inset;box-shadow:0 1px 0 #fff,0 -2px 5px rgba(0,0,0,0.08) inset;border:1px solid #c8c8c8;color:#777;margin:0 0 20px;width:100%}.login_content form input[type=\"text\"]:focus,.login_content form input[type=\"email\"]:focus,.login_content form input[type=\"password\"]:focus{-ms-box-shadow:0 0 2px #ed1c24 inset;-o-box-shadow:0 0 2px #ed1c24 inset;box-shadow:0 0 2px #A97AAD inset;background-color:#fff;border:1px solid #A878AF;outline:none}#username{background-position:10px 10px !important}#password{background-position:10px -53px !important}.login_content form div a{font-size:12px;margin:10px 15px 0 0}.reset_pass{margin-top:10px !important}.login_content div .reset_pass{margin-top:13px !important;margin-right:39px;float:right}.separator{border-top:1px solid #D8D8D8;margin-top:10px;padding-top:10px}.button{background:#f7f9fa;background:linear-gradient(top, #f7f9fa 0%, #f0f0f0 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f9fa', endColorstr='#f0f0f0', GradientType=0);-ms-box-shadow:0 1px 2px rgba(0,0,0,0.1) inset;-o-box-shadow:0 1px 2px rgba(0,0,0,0.1) inset;box-shadow:0 1px 2px rgba(0,0,0,0.1) inset;border-radius:0 0 5px 5px;border-top:1px solid #CFD5D9;padding:15px 0}.login_content form input[type=\"submit\"],#content form .submit{float:left;margin-left:38px}.button a{background:url(http://cssdeck.com/uploads/media/items/8/8bcLQqF.png) 0 -112px no-repeat;color:#7E7E7E;font-size:17px;padding:2px 0 2px 40px;text-decoration:none;transition:all 0.3s ease}.button a:hover{background-position:0 -135px;color:#00aeef}header{width:100%}#nprogress{pointer-events:none}#nprogress .bar{background:#29d;position:fixed;z-index:1031;top:0;left:0;width:100%;height:2px}#nprogress .peg{display:block;position:absolute;right:0px;width:100px;height:100%;box-shadow:0 0 10px #29d, 0 0 5px #29d;opacity:1.0;transform:rotate(3deg) translate(0px, -4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:solid 2px transparent;border-top-color:#29d;border-left-color:#29d;border-radius:50%;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .spinner,.nprogress-custom-parent #nprogress .bar{position:absolute}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.editor-wrapper{min-height:250px;background-color:white;border-collapse:separate;border:1px solid #ccc;padding:4px;box-sizing:content-box;box-shadow:rgba(0,0,0,0.07451) 0px 1px 1px 0px inset;border-top-right-radius:3px;border-bottom-right-radius:3px;border-bottom-left-radius:3px;border-top-left-radius:3px;overflow:scroll;outline:none}.voiceBtn{width:20px;color:transparent;background-color:transparent;transform:scale(2, 2);-webkit-transform:scale(2, 2);-moz-transform:scale(2, 2);border:transparent;cursor:pointer;box-shadow:none;-webkit-box-shadow:none}div[data-role=\"editor-toolbar\"]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.dropdown-menu a{cursor:pointer}.select2-container--default .select2-selection--single,.select2-container--default .select2-selection--multiple{background-color:#fff;border:1px solid #ccc;border-radius:0;min-height:38px}.select2-container--default .select2-selection--single .select2-selection__rendered{color:#73879C;padding-top:5px}.select2-container--default .select2-selection--multiple .select2-selection__rendered{padding-top:3px}.select2-container--default .select2-selection--single .select2-selection__arrow{height:36px}.select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .select2-selection--multiple .select2-selection__clear{margin-top:2px;border:none;border-radius:0;padding:3px 5px}.select2-container--default.select2-container--focus .select2-selection--multiple{border:1px solid #ccc}.switchery{width:32px;height:20px}.switchery>small{width:20px;height:20px}fieldset{border:none;margin:0;padding:0}.cropper .img-container,.cropper .img-preview{background-color:#f7f7f7;width:100%;text-align:center}.cropper .img-container{min-height:200px;max-height:516px;margin-bottom:20px}@media (min-width: 768px){.cropper .img-container{min-height:516px}}.cropper .img-container>img{max-width:100%}.cropper .docs-preview{margin-right:-15px}.cropper .img-preview{float:left;margin-right:10px;margin-bottom:10px;overflow:hidden}.cropper .img-preview>img{max-width:100%}.cropper .preview-lg{width:263px;height:148px}.cropper .preview-md{width:139px;height:78px}.cropper .preview-sm{width:69px;height:39px}.cropper .preview-xs{width:35px;height:20px;margin-right:0}.cropper .docs-data>.input-group{margin-bottom:10px}.cropper .docs-data>.input-group>label{min-width:80px}.cropper .docs-data>.input-group>span{min-width:50px}.cropper .docs-buttons>.btn,.cropper .docs-buttons>.btn-group,.cropper .docs-buttons>.form-control{margin-right:5px;margin-bottom:10px}.cropper .docs-toggles>.btn,.cropper .docs-toggles>.btn-group,.cropper .docs-toggles>.dropdown{margin-bottom:10px}.cropper .docs-tooltip{display:block;margin:-6px -12px;padding:6px 12px}.cropper .docs-tooltip>.icon{margin:0 -3px;vertical-align:top}.cropper .tooltip-inner{white-space:normal}.cropper .btn-upload .tooltip-inner,.cropper .btn-toggle .tooltip-inner{white-space:nowrap}.cropper .btn-toggle{padding:6px}.cropper .btn-toggle>.docs-tooltip{margin:-6px;padding:6px}@media (max-width: 400px){.cropper .btn-group-crop{margin-right:-15px !important}.cropper .btn-group-crop>.btn{padding-left:5px;padding-right:5px}.cropper .btn-group-crop .docs-tooltip{margin-left:-5px;margin-right:-5px;padding-left:5px;padding-right:5px}}.cropper .docs-options .dropdown-menu{width:100%}.cropper .docs-options .dropdown-menu>li{padding:3px 20px}.cropper .docs-options .dropdown-menu>li:hover{background-color:#f7f7f7}.cropper .docs-options .dropdown-menu>li>label{display:block}.cropper .docs-cropped .modal-body{text-align:center}.cropper .docs-cropped .modal-body>img,.cropper .docs-cropped .modal-body>canvas{max-width:100%}.cropper .docs-diagram .modal-dialog{max-width:352px}.cropper .docs-cropped canvas{max-width:100%}.form_wizard .stepContainer{display:block;position:relative;margin:0;padding:0;border:0 solid #CCC;overflow-x:hidden}.wizard_horizontal ul.wizard_steps{display:table;list-style:none;position:relative;width:100%;margin:0 0 20px}.wizard_horizontal ul.wizard_steps li{display:table-cell;text-align:center}.wizard_horizontal ul.wizard_steps li a,.wizard_horizontal ul.wizard_steps li:hover{display:block;position:relative;-moz-opacity:1;filter:alpha(opacity=100);opacity:1;color:#666}.wizard_horizontal ul.wizard_steps li a:before{content:\"\";position:absolute;height:4px;background:#ccc;top:20px;width:100%;z-index:4;left:0}.wizard_horizontal ul.wizard_steps li a.disabled .step_no{background:#ccc}.wizard_horizontal ul.wizard_steps li a .step_no{width:40px;height:40px;line-height:40px;border-radius:100px;display:block;margin:0 auto 5px;font-size:16px;text-align:center;position:relative;z-index:5}.wizard_horizontal ul.wizard_steps li a.selected:before,.step_no{background:#34495E;color:#fff}.wizard_horizontal ul.wizard_steps li a.done:before,.wizard_horizontal ul.wizard_steps li a.done .step_no{background:#1ABB9C;color:#fff}.wizard_horizontal ul.wizard_steps li:first-child a:before{left:50%}.wizard_horizontal ul.wizard_steps li:last-child a:before{right:50%;width:50%;left:auto}.wizard_verticle .stepContainer{width:80%;float:left;padding:0 10px}.actionBar{width:100%;border-top:1px solid #ddd;padding:10px 5px;text-align:right;margin-top:10px}.actionBar .buttonDisabled{cursor:not-allowed;pointer-events:none;opacity:.65;filter:alpha(opacity=65);box-shadow:none}.actionBar a{margin:0 3px}.wizard_verticle .wizard_content{width:80%;float:left;padding-left:20px}.wizard_verticle ul.wizard_steps{display:table;list-style:none;position:relative;width:20%;float:left;margin:0 0 20px}.wizard_verticle ul.wizard_steps li{display:list-item;text-align:center}.wizard_verticle ul.wizard_steps li a{height:80px}.wizard_verticle ul.wizard_steps li a:first-child{margin-top:20px}.wizard_verticle ul.wizard_steps li a,.wizard_verticle ul.wizard_steps li:hover{display:block;position:relative;-moz-opacity:1;filter:alpha(opacity=100);opacity:1;color:#666}.wizard_verticle ul.wizard_steps li a:before{content:\"\";position:absolute;height:100%;background:#ccc;top:20px;width:4px;z-index:4;left:49%}.wizard_verticle ul.wizard_steps li a.disabled .step_no{background:#ccc}.wizard_verticle ul.wizard_steps li a .step_no{width:40px;height:40px;line-height:40px;border-radius:100px;display:block;margin:0 auto 5px;font-size:16px;text-align:center;position:relative;z-index:5}.wizard_verticle ul.wizard_steps li a.selected:before,.step_no{background:#34495E;color:#fff}.wizard_verticle ul.wizard_steps li a.done:before,.wizard_verticle ul.wizard_steps li a.done .step_no{background:#1ABB9C;color:#fff}.wizard_verticle ul.wizard_steps li:first-child a:before{left:49%}.wizard_verticle ul.wizard_steps li:last-child a:before{left:49%;left:auto;width:0}.form_wizard .loader{display:none}.form_wizard .msgBox{display:none}.progress{border-radius:0}.progress-bar-info{background-color:#3498DB}.progress-bar-success{background-color:#26B99A}.progress_summary .progress{margin:5px 0 12px !important}.progress_summary .row{margin-bottom:5px}.progress_summary .row .col-xs-2{padding:0}.progress_summary .more_info span{text-align:right;float:right}.progress_summary .data span{text-align:right;float:right}.progress_summary p{margin-bottom:3px;width:100%}.progress_title .left{float:left;text-align:left}.progress_title .right{float:right;text-align:right;font-weight:300}.progress.progress_sm{border-radius:0;margin-bottom:18px;height:10px !important}.progress.progress_sm .progress-bar{height:10px !important}.dashboard_graph p{margin:0 0 4px}ul.verticle_bars{width:100%}ul.verticle_bars li{width:23%;height:200px;margin:0}.progress.vertical.progress_wide{width:35px}.alert-success{color:#ffffff;background-color:rgba(38,185,154,0.88);border-color:rgba(38,185,154,0.88)}.alert-info{color:#E9EDEF;background-color:rgba(52,152,219,0.88);border-color:rgba(52,152,219,0.88)}.alert-warning{color:#E9EDEF;background-color:rgba(243,156,18,0.88);border-color:rgba(243,156,18,0.88)}.alert-danger,.alert-error{color:#E9EDEF;background-color:rgba(231,76,60,0.88);border-color:rgba(231,76,60,0.88)}.ui-pnotify.dark .ui-pnotify-container{color:#E9EDEF;background-color:rgba(52,73,94,0.88);border-color:rgba(52,73,94,0.88)}.custom-notifications{position:fixed;margin:15px;right:0;float:right;width:400px;z-index:4000;bottom:0}ul.notifications{float:right;display:block;margin-bottom:7px;padding:0;width:100%}.notifications li{float:right;margin:3px;width:36px;box-shadow:3px 3px 3px rgba(0,0,0,0.3)}.notifications li:last-child{margin-left:0}.notifications a{display:block;text-align:center;text-decoration:none;text-transform:uppercase;padding:9px 8px}.tabbed_notifications .text{padding:5px 15px;height:140px;border-radius:7px;box-shadow:6px 6px 6px rgba(0,0,0,0.3)}.tabbed_notifications div p{display:inline-block}.tabbed_notifications h2{font-weight:bold;text-transform:uppercase;width:80%;float:left;height:20px;text-overflow:ellipsis;overflow:hidden;display:block}.tabbed_notifications .close{padding:5px;color:#E9EDEF;float:right;opacity:1}.daterangepicker.dropdown-menu{font-size:13px;padding:0;overflow:hidden}.daterangepicker.picker_1{background:#34495E;color:#ECF0F1}.daterangepicker.picker_1 table.table-condensed thead tr:first-child{background:#1ABB9C}.daterangepicker table.table-condensed thead tr:first-child th{line-height:28px;text-align:center}.daterangepicker.picker_1 table.table-condensed thead tr{background:#213345}.daterangepicker table.table-condensed thead tr{line-height:14px}.daterangepicker table.table-condensed tbody tr:first-child td{padding-top:10px}.daterangepicker table.table-condensed th:first-child,.daterangepicker table.table-condensed td:first-child{padding-left:12px}.daterangepicker table.table-condensed th:last-child,.daterangepicker table.table-condensed td:last-child{padding-right:12px}.table-condensed>thead>tr>th,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>tbody>tr>td,.table-condensed>tfoot>tr>td{padding:5px 7px;text-align:center}.daterangepicker table.table-condensed tbody tr:last-child td{padding-bottom:10px}.daterangepicker.picker_2 table.table-condensed thead tr:first-child{color:inherit}.daterangepicker.picker_2 table.table-condensed thead tr{color:#1ABB9C}.daterangepicker.picker_3 table.table-condensed thead tr:first-child{background:#1ABB9C;color:#ECF0F1}.daterangepicker.picker_4 table.table-condensed tbody td{background:#ECF0F1;color:#34495E;border:1px solid #fff;padding:4px 7px}.daterangepicker.picker_4 table.table-condensed tbody td.active{background:#536A7F;color:#fff}.daterangepicker.picker_4 table.table-condensed thead tr:first-child{background:#34495E;color:#ECF0F1}.xdisplay_input{width:240px;overflow:hidden;padding:0}.xdisplay{background-color:#fff;background-clip:padding-box;border:1px solid #ccc;margin-bottom:20px;border:1px solid rgba(0,0,0,0.15);border-radius:4px;width:230px;overflow:hidden;box-shadow:0 6px 12px rgba(0,0,0,0.175)}.daterangepicker.opensright .ranges,.daterangepicker.opensright .calendar,.daterangepicker.openscenter .ranges,.daterangepicker.openscenter .calendar{float:right}.daterangepicker table{width:100%;margin:0}.daterangepicker td,.daterangepicker th{text-align:center;width:20px;height:20px;cursor:pointer;white-space:nowrap}.daterangepicker td.off{color:#999}.daterangepicker td.disabled{color:#999}.daterangepicker td.available:hover,.daterangepicker th.available:hover{background:#eee;color:#34495E}.daterangepicker td.in-range{background:#E4E7EA;border-radius:0}.daterangepicker td.available+td.start-date{border-radius:4px 0 0 4px}.daterangepicker td.in-range+td.end-date{border-radius:0 4px 4px 0}.daterangepicker td.start-date.end-date{border-radius:4px !important}.daterangepicker td.active,.daterangepicker td.active:hover{background-color:#536A7F;color:#fff}.daterangepicker td.week,.daterangepicker th.week{font-size:80%;color:#ccc}.daterangepicker select.monthselect,.daterangepicker select.yearselect{font-size:12px;padding:1px;height:auto;margin:0;cursor:default;height:30px;border:1px solid #ADB2B5;line-height:30px;border-radius:0px !important}.daterangepicker select.monthselect{margin-right:2%;width:56%}.daterangepicker select.yearselect{width:40%}.daterangepicker select.hourselect,.daterangepicker select.minuteselect,.daterangepicker select.ampmselect{width:50px;margin-bottom:0}.daterangepicker_start_input{float:left}.daterangepicker_end_input{float:left;padding-left:11px}.daterangepicker th.month{width:auto}.daterangepicker .daterangepicker_start_input label,.daterangepicker .daterangepicker_end_input label{color:#333;display:block;font-size:11px;font-weight:normal;height:20px;line-height:20px;margin-bottom:2px;text-shadow:#fff 1px 1px 0px;text-transform:uppercase;width:74px}.daterangepicker .ranges input{font-size:11px}.daterangepicker .ranges .input-mini{background-color:#eee;border:1px solid #ccc;border-radius:4px;color:#555;display:block;font-size:11px;height:30px;line-height:30px;vertical-align:middle;margin:0 0 10px 0;padding:0 6px;width:74px}.daterangepicker .ranges .input-mini:hover{cursor:pointer}.daterangepicker .ranges ul{list-style:none;margin:0;padding:0}.daterangepicker .ranges li{font-size:13px;background:#f5f5f5;border:1px solid #f5f5f5;color:#536A7F;padding:3px 12px;margin-bottom:8px;border-radius:5px;cursor:pointer}.daterangepicker .ranges li.active,.daterangepicker .ranges li:hover{background:#536A7F;border:1px solid #536A7F;color:#fff}.daterangepicker .calendar{display:none;max-width:270px}.daterangepicker.show-calendar .calendar{display:block}.daterangepicker .calendar.single .calendar-date{border:none}.daterangepicker.single .ranges,.daterangepicker.single .calendar{float:none}.daterangepicker .ranges{width:160px;text-align:left;margin:4px}.daterangepicker .ranges .range_inputs>div{float:left}.daterangepicker .ranges .range_inputs>div:nth-child(2){padding-left:11px}.daterangepicker.opensleft .ranges,.daterangepicker.opensleft .calendar{float:left;margin:4px}.daterangepicker .icon{width:20px;height:20px;display:inline-block;vertical-align:middle}.fc-state-default{background:#f5f5f5;color:#73879C}.fc-state-down,.fc-state-active{color:#333;background:#ccc}.dropzone{min-height:300px;border:1px solid #e5e5e5}") || true) && "_1feeca68";

const mainCss = (require('insert-css')("._e27ffd65 {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n}\n._e27ffd65 .login {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n}\n._e27ffd65 .checkboxRow {\n    width: 20px;\n}\n\n._e27ffd65 .toolbarRefreshButton {\n    text-align: right;\n}\n\n._e27ffd65 .user-chat-bubble {\n    border-radius: 1.3em 1.3em 0 1.3em;\n    color: #fff;\n    height: 35px;\n    background-color: #0084ff;\n    width: auto;\n    font-size: 14px;\n    text-align: right;\n    margin: 1px 0;\n    padding: 6px 12px;\n    overflow: hidden;\n    clear: right;\n    float: right;\n    word-wrap: break-word;\n}\n\n._e27ffd65 .reply-container {\n    clear: both;\n}\n\n._e27ffd65 .reply-body {\n    color: #000;\n    width: auto;\n    font-size: 14px;\n    padding: 6px 12px;\n    word-wrap: break-word;\n    outline: none;\n}\n\n._e27ffd65 .reply-template-generic .reply-body {\n    border: 1px solid #cbcbcb;\n    border-bottom: none;\n}\n\n._e27ffd65 .reply-title,\n._e27ffd65 .reply-subtitle {\n    display: block;\n    border: none;\n    width: 100%;\n    padding-left: 0;\n    outline: none;\n    resize: none;\n}\n\n._e27ffd65 .reply-title {\n    font-weight: 700;\n}\n._e27ffd65 .reply-template-button .reply-subtitle,\n._e27ffd65 .reply-template-text .reply-subtitle,\n._e27ffd65 .chat-bubble {\n    border-radius: 1.3em 1.3em 1.3em 0;\n    min-height: 35px;\n    background: none;\n    background-color: #f1f0f0;\n    color: #000;\n    font-size: 14px;\n    margin: 1px 0;\n    padding: 6px 12px;\n    clear: left;\n    float: left;\n    word-wrap: break-word;\n}\n._e27ffd65 .reply-footer {\n    clear: both;\n    border: 1px solid #cbcbcb;\n    overflow: hidden;\n}\n\n._e27ffd65 .reply-template-button .reply-footer {\n    border-radius: 1.3em;\n}\n\n._e27ffd65 .reply-template-generic .reply-footer {\n    border-radius: 0 0 1.3em 1.3em;\n}\n\n._e27ffd65 .reply-button {\n    margin-top: -1px;\n    text-align: center;\n    color: blue !important;\n    font-size: 14px;\n    width: 100%;\n    padding: 6px 12px;\n    border: none;\n    border-top: 1px solid #cbcbcb;\n    text-transform: uppercase;\n    background: none;\n}\n\n._e27ffd65 .reply-template-text .reply-button {\n    border: 1px solid #cbcbcb;\n}") || true) && "_e27ffd65";

var mainView = (() => html`
<div class=${ mainCss }>
    ${ fontAwesome }
    <div id="mainContent"></div>
</div>`);

const formLabels = {
    cancelButton: 'Cancelar',
    submitButton: 'Enviar'
};

var messages = {
    login: {
        title: 'Entrada',
        subtitle: 'Para acessar a Torre de Controle é necessário identificar-se.',
        fbSignInButton: 'Acessar com Facebook'
    },
    sidebar: {
        home: 'Início',
        channels: 'Canais',
        ecommerce: 'Comércio',
        intents: 'Frases',
        replies: 'Respostas',
        mutedChats: 'Assistentes silenciadas',
        admins: 'Equipe',
        debug: 'Depuração'
    },
    footer: {
        appName: version => `• Control Tower v${ version } •`,
        viewSource: 'ver código-fonte'
    },
    signInToggle: {
        signIn: 'Entrar',
        signOut: 'Sair'
    },
    home: {
        title: 'Início',
        description: 'Escolha qual assistente configurar'
    },
    channels: {
        title: 'Configurar Canais',
        facebook: {
            title: 'Facebook Messenger',
            description: {
                trackOrder: `
                    Selecione uma página para ser o contato de
                    Facebook Messenger com o qual as pessoas farão consultas de
                    rastreio de pedidos via chat.
                `
            },
            page: 'Página',
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    ecommerce: {
        title: 'Integração com APIs de E-commerce',
        vtex: {
            title: 'VTEX Store',
            description: {
                trackOrder: `
                    Informe os dados da VTEX Store a ser usada para consultar o
                    status de pedidos.
                `
            },
            apiToken: 'API Token',
            apiKey: 'API Key',
            apiAccountName: 'API Account Name',
            apiEnvironment: 'API Environment',
            appKey: 'App Key',
            appToken: 'App Token',
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    intents: {
        title: 'Reconhecimento de Frases',
        faq: {
            title: 'Perguntas Frequentes',
            description: `
                Cadastre abaixo alguns temas de perguntas que sua assistente pode
                responder por você. Um tema é um conjunto de perguntas cuja resposta
				é a mesma. 
            `,
            intentList: 'Temas',
            addIntentOption: 'Novo tema',
            existingIntents: 'Temas cadastrados',
            intentName: 'Tema',
            newUterranceTitle: 'Nova Pergunta',
            addUtteranceButton: 'Adicionar Pergunta',
            utterances: 'Perguntas',
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    replies: {
        title: 'Editar Respostas',
        ecommerce: {
            title: 'E-commerce',
            description: `
                Selecione abaixo uma das respostas para editar seu texto.
            `,
            reply: 'Resposta',
            selectAReply: 'Selecione uma resposta',
            replyTitles: {
                start: 'Menu Inicial',
                exchange: 'Trocas',
                menu: 'Menu',
                deactivate: 'Transferir para um humano',
                faqId: 'Dúvida: número do pedido',
                faqReceipt: 'Dúvida: nota fiscal',
                faqReturn: 'Dúvida: trocas e devoluções',
                help: 'Ajuda (Menu SAC)',
                trackOrder: {
                    title: 'Rastreamento de Pedidos',
                    hasNoOrderId: 'Sem número de pedido',
                    hasOrderId: 'Com número de pedido',
                    userLoggedWelcome: 'Boas vindas (usuário recorrente)',
                    localOrders: 'Seleção de pedido',
                    apiCall: 'Status do pedido'
                },
                thankUser: 'Agradecimento',
                apiHandler: {
                    title: 'Erros',
                    wrongNumber: 'Número de pedido inválido',
                    systemError: 'Sistema fora do ar'
                },
                fallback: 'Resposta não compreendida, transferência',
                askForAMoment: 'Espere um momento',
                buttons: {
                    title: 'Botões',
                    trackOrder: 'Rastrear meu pedido',
                    exchange: 'Política de Trocas (link)',
                    humanFallback: 'Falar com um humano',
                    returns: 'Trocas/Devoluções (link)',
                    receipt: 'Saiba mais, nota fiscal (link)',
                    menu: 'Voltar ao menu',
                    deactivate: 'Desativar a assistente (falar com humano)',
                    select: 'Selecionar',
                    hasNoOrderId: 'Não sei meu número de pedido'
                }
            },
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    mutedChats: {
        title: 'Assistentes silenciadas',
        list: {
            title: 'Conversas',
            description: {
                withChats: `
                A lista abaixo é de conversas onde a função assistente
                não conseguiu resolver a tarefa sozinha e foi silenciada
                para que uma pessoa pudesse intervir.
                `,
                withoutChats: `
                    Não existem assistentes silenciadas no momento.
                    Use o botão acima para atualizar a lista.
                `
            },
            submit: 'Reativar Selecionadas'
        }
    },
    debug: {
        title: 'Depuração'
    },
    admins: {
        title: 'Equipe de admnistração',
        team: {
            title: 'Integrantes',
            name: 'Nome',
            email: 'Email'
        },
        invite: {
            title: 'Aumentar a equipe',
            instructions: ['Para convidar uma nova pessoa para a equipe de ' + 'admnistração, compartilhe o endereço do convite ' + 'e o código com ela.', 'Para invalidar um convite clique no botão "Gerar nova chave".'],
            url: 'Endereço',
            inviteCode: 'Código do convite',
            newKey: 'Gerar nova chave'
        }
    },
    invite: {
        title: 'Você foi convidado',
        subtitle: id => `para admnistrar o assistente ${ id }`,
        description: 'Digite o código de convite abaixo para aceitar',
        submitButton: 'Aceitar',
        ignoreButton: 'Ignorar'
    }
};

const click = (send, action) => e => {
    e.preventDefault();
    send(action);
};

var loginComponent = ((labels, classes, send) => html`
<form>
    <h1>${ labels.title }</h1>
    <p class=${ classes.subtitle }>${ labels.subtitle }</p>
    <button
        class=${ classes.button }
        onclick=${ click(send, 'fbsession:signIn') }}
    >
        ${ labels.fbSignInButton }
    </button>
</form>
`);

const classes = {
    subtitle: 'lead',
    button: 'btn btn-primary'
};
var loginView = ((state, prev, send) => html`
<div class="login">
    <div class="login_wrapper">
        <div class="login_form">
            <section class="login_content">
                ${ loginComponent(messages.login, classes, send) }
            </section>
        </div>
    </div>
</div>`);

const click$1 = (send, key) => e => {
    e.preventDefault();
    const pathname = `/${ key }`;
    send('ui:selectSection', key);
    send('location:set', { pathname });
};

var menuComponent = ((uiState, classes, send) => html`
<ul class=${ classes.list }>
${ uiState.menu.map(key => !uiState.enabledSections.includes(key) ? null : html`
    <li class=${ key === uiState.selectedSection ? classes.active : '' }>
        <a onclick=${ click$1(send, key) }">
            <i class=${ classes.icons[key] }></i>
            ${ messages.sidebar[key] }
        </a>
    </li>
`) }
</ul>`);

var signInToggle$1 = ((isLogged, send) => html`
<button
    onclick=${ () => send('fbsession:signInToggle', { isLogged }) }
>
    ${ isLogged ? messages.signInToggle.signOut : messages.signInToggle.signIn }
</button>`);

var footerComponent = ((labels, customerState, appState, send) => html`
<div>
    ${ signInToggle$1(customerState.isLogged, send) }
    ${ labels.appName(appState.version) }
    <a href="${ appState.homepage }">${ labels.viewSource }</a>
</div>`);

const dashboardCss = (require('insert-css')("._a7c34925 .right_col {\n    min-height: 600px;\n}") || true) && "_a7c34925";
const menuClasses = {
    list: 'nav side-menu',
    active: 'active',
    icons: {
        home: 'fa fa-home',
        channels: 'fa fa-whatsapp',
        ecommerce: 'fa fa-shopping-cart',
        intents: 'fa fa-quote-right',
        replies: 'fa fa-comments-o',
        mutedChats: 'fa fa-user-times',
        admins: 'fa fa-key',
        debug: 'fa fa-terminal'
    }
};

var dashboardView = (content => (state, prev, send) => {
    if (!state.customer.isLogged) {
        return content(state, prev, send);
    }
    return html`
<div class="nav-sm ${ dashboardCss }">
    <div class="container body">
        <div class="main_container">
            <div class="col-md-3 left_col">
                <div class="left_col scroll-view">
                    <div class="main_menu_side hidden-print main_menu">
                        ${ menuComponent(state.ui, menuClasses, send) }
                    </div>
                </div>
            </div>
            <div class="right_col">
                ${ content(state, prev, send) }
            </div>
            <footer>
                <div class="pull-right">
                    ${ footerComponent(messages.footer, state.customer, state.app, send) }
                </div>
                <div class="clearfix"></div>
            </footer>
        </div>
    </div>
</div>
`;
});

var homeContent = ((state, prev, send) => {
    const onChange = e => {
        send('api:getBot', { botId: e.target.value });
        send('ui:selectBot', e.target.value);
    };
    const selectBox = state.customer.bots.length > 1 ? html`
        <div>
            <h2>${ messages.home.description }</h2>
            <select onchange=${ onChange }>
                <option>
                    Selecione
                </option>
                ${ state.customer.bots.map(botId => html`
                    <option selected=${ state.ui.selectedBot === botId }>
                        ${ botId }
                    </option>
                `) }
            </select>
        </div>` : null;
    return html`
<div>
    <h1>${ messages.home.title }</h1>
    ${ selectBox }
</div>
`;
});

var updateBotFormComponent = ((fields, isUpdating, classes, messages, onSubmit) => html`
<form class=${ classes.form } onsubmit=${ onSubmit }>
    ${ fields }
    <div class=${ classes.separator }></div>
    <div class=${ classes.formGroup }>
        <div class=${ classes.buttonGroup }>
            <button type="reset" class=${ classes.cancelButton }
            >${ messages.cancel }</button>
            <button type="submit" class=${ classes.submitButton }
                ${ isUpdating ? 'disabled' : '' }
            >${ messages.submit }</button>
        </div>
    </div>
</form>
`);

var pageListComponent = ((pages, selectedPage, classes, selectId) => html`
<select name=${ selectId } class=${ classes.input }>
    ${ pages.map(page => html`
        <option
            ${ selectedPage.pageId === page.id ? 'selected' : '' }
        >
            ${ page.name }
        </option>
    `) }
</select>`);

var pageListFormComponent = ((pages, selectedPage, isUpdating, classes, messages, onSubmit) => {
    const fields = html`
        <div class=${ classes.formGroup }>
            <label class=${ classes.label }>
            ${ messages.page }
            </label>
            <div class=${ classes.inputContainer }>
                ${ pageListComponent(pages, selectedPage, classes, 'select') }
            </div>
        </div>
    `;
    return updateBotFormComponent(fields, isUpdating, classes, messages, onSubmit);
});

const formClasses = {
    form: 'form-horizontal form-label-left',
    formGroup: 'form-group',
    table: 'table table-striped jambo_table',
    selectedTableRow: 'selected',
    tableCheckboxRow: 'checkboxRow',
    label: 'control-label col-md-3 col-sm-3 col-xs-12',
    inputContainer: 'col-md-9 col-sm-9 col-xs-12',
    input: 'form-control',
    separator: 'ln_solid',
    buttonGroup: 'col-md-9 col-sm-9 col-xs-12 col-md-offset-3',
    cancelButton: 'btn btn-primary',
    submitButton: 'btn btn-success'
};

const panel = (form, title, description, navbarRightContent) => html`
    <div class="col-md-6">
        <div class="x_panel">
            <div class="x_title nav">
                <h2>${ title }</h2>
                <div class="navbar-right panel_toolbox">
                    ${ navbarRightContent }
                </div>
            </div>
            <div class="x_content">
                <p>
                    ${ description }
                </p>
                ${ form }
            </div>
        </div>
    </div>
`;

// const view = (form, messages, navbarRightContent) => html`
const view = (title, panels) => html`
<div>
    <div class="title-left">
        <h3>${ title }</h3>
    </div>
    <div class="row">
        ${ panels }
    </div>
</div>
`;

const createSubmit = (bot, pages, send) => e => {
    e.preventDefault();
    const newPage = pages[e.target.select.selectedIndex];
    send('api:updateBot', {
        botId: bot.id,
        ownerId: bot.customerId,
        facebookPage: newPage
    });
    return send('bot:setFacebookPage', newPage);
};

var channelsContent = ((state, prev, send) => {
    const pages = state.ui.facebookPages;
    const currentPage = state.bot.facebook;
    const isUpdating = state.api.updatingBot;
    const onSubmit = createSubmit(state.bot, pages, send);
    const form = pageListFormComponent(pages, currentPage, isUpdating, formClasses, messages.channels.facebook, onSubmit);
    const panels = [panel(form, messages.channels.facebook.title, messages.channels.facebook.description.trackOrder)];
    return view(messages.channels.title, panels);
});

var vtexFormComponent = ((isUpdating, values, classes, messages, onSubmit) => {
    const fieldNames = ['apiToken', 'apiKey', 'apiAccountName', 'apiEnvironment'];
    const fields = fieldNames.map(name => html`
        <div class=${ classes.formGroup }>
            <label class=${ classes.label }>
                ${ messages[name] }
            </label>
            <div class=${ classes.inputContainer }>
                <input
                    name=${ name }
                    value=${ values[name] || '' }
                    class=${ classes.input }
                >
            </div>
        </div>
    `);
    return updateBotFormComponent(fields, isUpdating, classes, messages, onSubmit);
});

const createSubmit$1 = (bot, send) => e => {
    e.preventDefault();
    const fieldNames = ['apiToken', 'apiKey', 'apiAccountName', 'apiEnvironment'];
    const update = fieldNames.reduce((prev, name) => Object.assign(prev, {
        [name]: e.target[name].value
    }), {});
    send('api:updateBot', {
        botId: bot.id,
        ownerId: bot.customerId,
        vtex: update
    });
    return send('bot:setVtexStore', update);
};

var ecommerceContent = ((state, prev, send) => {
    const isUpdating = state.api.updatingBot;
    const values = state.bot.vtex;
    const onSubmit = createSubmit$1(state.bot, send);
    const form = vtexFormComponent(isUpdating, values, formClasses, messages.ecommerce.vtex, onSubmit);
    const panels = [panel(form, messages.ecommerce.vtex.title, messages.ecommerce.vtex.description.trackOrder)];
    return view(messages.ecommerce.title, panels);
});

var intentsFormComponent = ((state, send, classes, messages, isUpdating = false, onSubmit = null) => {
    const nonDefaultIntents = state.intents.names.filter(name => name !== 'none');
    const selectedIntent = state.intents.selectedIntent;
    const utterances = state.intents.utterances[selectedIntent] || [];
    const onIntentSelected = e => {
        send('intents:selectIntent', e.target.value);
    };
    const intentOptions = html`
        <select
            name="intentSelect"
            value=${ selectedIntent }
            class=${ classes.input }
            onchange=${ onIntentSelected }
        >
            <option value="none">
                ${ messages.addIntentOption }
            </option>
            <optgroup label=${ messages.existingIntents }>
                ${ nonDefaultIntents.map(intentName => html`
                    <option
                        selected=${ selectedIntent === intentName }
                    >${ intentName }</option>
                `) }
            </optgroup>
        </select>
    `;
    const intentNameField = selectedIntent === 'none' ? html`
            <div class=${ classes.formGroup }>
                <label class=${ classes.label }>
					${ messages.intentName }
				</label>
                <div class=${ classes.inputContainer }>
					<input name="intentName">
                </div>
            </div>` : null;
    const newUtterance = html`
		<div>
			<h4>${ messages.newUterranceTitle }</h4>
            <input name="newUtterance" class=${ classes.input }>
		</div>
	`;
    const existingUtterances = html`
        <div>
            <h4>${ messages.utterances }</h4>
            <div>
                ${ utterances.map(value => html`
                    <div class=${ classes.formGroup }>
                        <div class=${ classes.inputContainer }>
                            <input
                                class=${ classes.input }
                                value=${ value }
                                readonly
                            />
                        </div>
                    </div>`) }
            </div>
        </div>
    `;
    const intentForm = selectedIntent === 'none' ? null : html`
        <div>
            <div class=${ classes.separator }></div>
            ${ newUtterance }
            ${ utterances.length ? existingUtterances : null }
        </div>`;
    const fields = html`
        <div>
            <div class=${ classes.formGroup }>
                <label class=${ classes.label }>
                    ${ messages.intentList }
                </label>
                <div class=${ classes.inputContainer }>
                    ${ intentOptions }
                </div>
			</div>
			${ intentNameField }
			${ intentForm }
        </div>
    `;
    return updateBotFormComponent(fields, isUpdating, classes, messages, onSubmit);
});

var intentsContent = ((state, prev, send) => {
    const onSubmit = e => {
        e.preventDefault();
        console.log('new intent or new utterance', e.target);
        if (e.target.intentName && e.target.intentName.value) {
            // new intent
            send('sage:createIntent', e.target.intentName.value);
        }
        if (e.target.newUtterance && e.target.newUtterance.value) {
            console.log(e.target.newUtterance.value);
            // new utterance
            send('sage:createUtterance', {
                utterance: e.target.newUtterance.value,
                intent: e.target.intentSelect.value
            });
            send('replies:setSampleQuestion', {
                utterance: e.target.newUtterance.value,
                intent: e.target.intentSelect.value
            });
        }
    };
    const content = intentsFormComponent(state, send, formClasses, messages.intents.faq, false, onSubmit);
    const panels = [panel(content, messages.intents.faq.title, messages.intents.faq.description)];
    return view(messages.intents.title, panels);
});

const buildOptions = (selectedKey, list, keyPrefix) => Object.keys(list).map(key => {
    if (key === 'title') {
        return null;
    }
    const fullKey = (keyPrefix || '') + key;
    const isSelected = fullKey === selectedKey;
    const value = list[key];
    const isChildList = typeof value === 'object' && value.title;
    return isChildList ? html`
            <optgroup label=${ value.title || '' }>
                ${ buildOptions(selectedKey, value, `${ key }.`) }
            </optgroup>` : html`
        <option
            ${ isSelected ? 'selected' : '' }
            value=${ fullKey }
        >
            ${ value }
        </option>
    `;
});

const genericTemplate = (selectedReplyKey, selectedReply = { text: '' }, replies, utterances, classes) => {
    const sampleQuestion = selectedReply.sampleQuestion;
    var _selectedReply$templa = selectedReply.template;
    const template = _selectedReply$templa === undefined ? null : _selectedReply$templa;
    const title = selectedReply.title;
    const subtitle = selectedReply.subtitle;
    const text = selectedReply.text;
    const buttons = selectedReply.buttons;
    const other = objectWithoutProperties(selectedReply, ['sampleQuestion', 'template', 'title', 'subtitle', 'text', 'buttons']);

    const isButton = selectedReplyKey.split('.')[0] === 'buttons';
    const sampleQuestionBalloon = !sampleQuestion && !utterances[selectedReplyKey] ? null : html`
    <p class=${ classes.sampleQuestion }>
        ${ sampleQuestion || utterances[selectedReplyKey][0] }
    </p>`;
    const titleInput = !title ? null : html`
        <input class=${ classes.title } name="title" value=${ title } />`;
    const subtitleOrText = subtitle || text;
    const subtitleInput = subtitleOrText === undefined || isButton ? null : html`
        <textarea class=${ classes.subtitle } name="subtitle" key=${ selectedReplyKey }
        value=${ subtitleOrText }>${ subtitleOrText }</textarea>`;
    const answer = template !== 'generic' ? subtitleInput : html`
        <div class=${ classes.body }>
            ${ titleInput }
            ${ subtitleInput }
        </div>
    `;
    const singleButton = !isButton ? null : html`
        <input
            class=${ classes.button }
            name="text"
            value=${ subtitleOrText }
        />`;
    const buttonsList = buttons ? html`
        <div class=${ classes.footer }>
            ${ buttons.map(key => html`
                <button disabled class=${ classes.button }>
                    ${ replies.buttons[key].text }
                </button>
            `) }
        </div>` : singleButton;
    const otherInput = Object.keys(other).map(key => html`
        <label>
            ${ key }
            <input name=${ key } value=${ other[key] } />
        </label>
    `);
    return html`
<div>
    ${ sampleQuestionBalloon }
    <div class=${ classes.container }>
        <div class=${ template ? classes.template[template] : classes.template.none }>
            ${ answer }
            ${ buttonsList }
        </div>
    </div>
    ${ otherInput }
</div>
    `;
};

// const replyTitles = messages.replyTitles;

var repliesFormComponent = ((replyTitles, selectedReplyKey, replies, selectedReply, utterances, classes, messages, isLoading, onChange, onSubmit) => {
    const fields = html`
<div>
    <div class=${ classes.formGroup }>
        <label class=${ classes.label }>
            ${ messages.reply }
        </label>
        <div class=${ classes.inputContainer }>
            <select class=${ classes.input } value=${ selectedReplyKey } onchange=${ onChange }>
                <option>${ messages.selectAReply }</option>
                ${ buildOptions(selectedReplyKey, replyTitles) }
            </select>
        </div>
    </div>
    <div class="ln_solid"></div>
    <div class=${ classes.formGroup }>
        ${ selectedReplyKey ? genericTemplate(selectedReplyKey, selectedReply, replies, utterances, classes.reply) : null }
    </div>
</div>
    `;
    return updateBotFormComponent(fields, isLoading, classes, messages, onSubmit);
});

const createOnChange = send => e => {
    e.preventDefault();
    send('ui:selectReply', e.target.value);
    return send('location:set', { pathname: '/replies' });
};

const createOnSubmit = (selectedReplyKey, selectedReply = {}, bot, send) => e => {
    e.preventDefault();
    const fieldNames = ['title', 'text', 'subtitle', 'logo', 'url'];
    let updates = {};
    fieldNames.forEach(fieldName => {
        if (!e.target[fieldName]) {
            return null;
        }
        return Object.assign(updates, { [fieldName]: e.target[fieldName].value });
    });
    updates = Object.assign(selectedReply, updates);
    send('replies:setReply', { [selectedReplyKey]: updates });
    return send('replies:sendReplies', bot);
};

const replyClasses = {
    sampleQuestion: 'user-chat-bubble',
    title: 'reply-title',
    subtitle: 'reply-subtitle',
    body: 'reply-body',
    footer: 'reply-footer',
    button: 'reply-button',
    container: 'reply-container col-md-8 col-sm-8 col-xs-12',
    template: {
        button: 'reply-template-button',
        generic: 'reply-template-generic',
        none: 'reply-template-text'
    }
};

const classes$1 = Object.assign({}, formClasses, { reply: replyClasses });
var repliesContent = ((state, prev, send) => {
    const selectedReplyKey = state.ui.selectedReply;
    const selectedReply = selectedReplyKey ? ramda.path(state.ui.selectedReply.split('.'), state.replies) : null;
    const replyTitles = state.intents.names.filter(name => name !== 'none').reduce((previous, name) => Object.assign(previous, { [name]: name }), {});
    const onChange = createOnChange(send);
    const onSubmit = createOnSubmit(selectedReplyKey, selectedReply, state.bot, send);
    const content = repliesFormComponent(replyTitles, selectedReplyKey, state.replies, selectedReply, state.intents.utterances, classes$1, messages.replies.ecommerce, state.api.loadingBot || state.api.updatingBot, onChange, onSubmit);
    const panels = [panel(content, messages.replies.ecommerce.title, messages.replies.ecommerce.description)];
    return view(messages.replies.title, panels);
});

const createRowClickHandler = (index, isSelected, select, deselect) => e => {
    e.preventDefault();
    return isSelected ? deselect(index) : select(index);
};

const createSelectAll = (isAllSelected, dataSet, select, deselect) => e => {
    e.preventDefault();
    dataSet.forEach((item, index) => isAllSelected ? deselect(index) : select(index));
};

const tableRow = (row, index, selectedRows, classes, onRowSelected, onRowDeselected) => {
    const isSelected = selectedRows.includes(index);
    const trClass = isSelected ? classes.selectedTableRow : '';
    const checked = isSelected ? 'checked' : '';
    const clickHandler = createRowClickHandler(index, isSelected, onRowSelected, onRowDeselected);
    return html`
        <tr class=${ trClass } onclick=${ clickHandler }>
            <td>
                <input type="checkbox" ${ checked }></input>
            </td>
            ${ row.map(cell => html`
                <td>${ cell }</td>
            `) }
        </tr>
    `;
};

const createTable = (headers, dataSet, selectedRows, classes, isAllSelected, selectAll, onRowSelected, onRowDeselected) => html`
<table
    cellpadding="0" cellspacing="0" border="0"
    class=${ classes.table }
>
    <thead>
        <tr>
            <th class=${ classes.tableCheckboxRow }>
                <input
                    type="checkbox" ${ isAllSelected ? 'checked' : '' }
                    onclick=${ selectAll }></input>
            </th>
        ${ headers.map(name => html`
            <th>${ name }</th>
        `) }
        </tr>
    </thead>
    <tbody>
        ${ dataSet.map((row, index) => tableRow(row, index, selectedRows, classes, onRowSelected, onRowDeselected)) }
    </tbody>
</table>
`;

var mutedBotListFormComponent = ((headers, dataSet, selectedRows, isUpdating, classes, messages, onRowSelected, onRowDeselected, onSubmit) => {
    const isAllSelected = selectedRows.length && selectedRows.length === dataSet.length;
    const selectAll = createSelectAll(isAllSelected, dataSet, onRowSelected, onRowDeselected);
    return html`
<form class=${ classes.form } onsubmit=${ onSubmit }>
    <div class=${ classes.formGroup }>
        ${ !dataSet.length ? null : createTable(headers, dataSet, selectedRows, classes, isAllSelected, selectAll, onRowSelected, onRowDeselected) }
    </div>
    <div class=${ classes.separator }></div>
    <div class=${ classes.formGroup }>
        <div class=${ classes.buttonGroup }>
            <button type="submit" class=${ classes.submitButton }
                ${ isUpdating || !selectedRows.length ? 'disabled' : '' }
            >${ messages.submit }</button>
        </div>
    </div>
</form>
    `;
});

const toolbarRight = (isLoading, onRefreshClick) => html`
<div class="toolbarRefreshButton">
    <button
        class="btn btn-primary"
        ${ isLoading ? 'disabled' : '' }
        onclick=${ onRefreshClick }
    >
        <i class="fa fa-repeat"></i>
    </button>
</div>
`;

const preventDefaultWrap = cb => e => {
    e.preventDefault();return cb();
};

var mutedChatsContent = ((state, prev, send) => {
    const headers = ['Name'];
    const selectedRows = state.ui.selectedMutedUsers;
    const dataSet = state.users.filteredByMutedBot.map(user => [user.name]);
    const isEmpty = !dataSet.length;
    const description = isEmpty ? messages.mutedChats.list.description.withoutChats : messages.mutedChats.list.description.withChats;
    const onRowSelected = rowIndex => send('ui:selectMutedUser', rowIndex);
    const onRowDeselected = rowIndex => send('ui:deselectMutedUser', rowIndex);
    const onRefreshClick = preventDefaultWrap(() => send('api:getMutedChats', state.bot));
    const onSubmit = preventDefaultWrap(() => {
        send('api:unMuteChats', {
            ids: state.users.filteredByMutedBot.filter((item, index) => selectedRows.includes(index)).map(item => item.id),
            botId: state.bot.id
        });
    });

    const navbarRightContent = toolbarRight(state.api.loadingUsers, onRefreshClick);
    const content = isEmpty ? null : mutedBotListFormComponent(headers, dataSet, selectedRows, state.api.loadingUsers, formClasses, messages.mutedChats.list, onRowSelected, onRowDeselected, onSubmit);
    const panels = [panel(content, messages.mutedChats.list.title, description, navbarRightContent)];
    return view(messages.mutedChats.title, panels);
});

var adminsContent = ((state, prev, send) => {
    const adminList = html`<div>
        <table class=${ formClasses.table }>
            <thead>
                <tr>
                    <td>${ messages.admins.team.name }</td>
                    <td>${ messages.admins.team.email }</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${ state.customer.name }</td>
                    <td>${ state.customer.email }</td>
                </tr>
            </tbody>
        </table>
    </div>`;
    const formValues = {
        url: `${ window.location.href }?bot=${ state.bot.id }&owner=${ state.bot.customerId }`,
        inviteCode: state.bot.inviteCode
    };
    const inviteFields = Object.keys(formValues).map(name => html`
        <div class=${ formClasses.formGroup }>
            <label class=${ formClasses.label }>
                ${ messages.admins.invite[name] }
            </label>
            <div class=${ formClasses.inputContainer }>
                <input
                    name=${ name }
                    value=${ formValues[name] || '' }
                    class=${ formClasses.input }
                    readonly
                >
            </div>
        </div>
    `);
    const onSubmit = e => {
        e.preventDefault();
        send('api:updateBot', { botId: state.bot.id, inviteCode: 'new' });
    };
    const inviteAdmin = html`
    <form class=${ formClasses.form } onsubmit=${ onSubmit }>
        ${ messages.admins.invite.instructions.map(instruction => html`
            <p>${ instruction }</p>
        `) }
        ${ inviteFields }
        <div class=${ formClasses.separator }></div>
        <div class=${ formClasses.formGroup }>
            <div class=${ formClasses.buttonGroup }>
                <button
                    type="submit"
                    class=${ formClasses.submitButton }
                    disabled=${ state.api.updatingBot }
                >${ messages.admins.invite.newKey }</button>
            </div>
        </div>
    </form>
    `;
    const panels = [panel(adminList, messages.admins.team.title), panel(inviteAdmin, messages.admins.invite.title)];
    return view(messages.admins.title, panels);
});

var invitationContent = ((state, prev, send) => {
    const onSubmit = e => {
        e.preventDefault();
        send('api:acceptInvite', {
            inviteCode: e.target.inviteCode.value,
            ownerId: state.invite.ownerId,
            botId: state.invite.botId
        });
    };
    const ignoreClick = () => {
        send('invite:ignore');
    };
    const errorOutput = !state.invite.error ? null : html`
        <div>
            <h4>Error:${ state.invite.error.message }</h4>
            <p>${ JSON.stringify(state.invite.error) }</p>
        </div>
    `;
    return html`
<div class="login">
    <div class="login_wrapper">
        <form class="login_form" onsubmit=${ onSubmit }>
            <h1>${ messages.invite.title }</h1>
            <h2>${ messages.invite.subtitle(state.invite.botId) }</h2>
            <p>${ messages.invite.description }</p>
            <input name="inviteCode"/>
            <input
                type="submit"
                disabled=${ state.api.updatingBot }
                value=${ messages.invite.submitButton }
            />
            <input
                type="button"
                value=${ messages.invite.ignoreButton }
                onclick=${ ignoreClick }
            />
            ${ errorOutput }
        </form>
    </div>
</div>`;
});

var debugContent = (state => html`
<div>
    <h1>Controltower API</h1>
<code><pre>${ JSON.stringify(state.api, ' ', 2) }</pre></code>
    <h1>Sage API</h1>
<code><pre>${ JSON.stringify(state.sage, ' ', 2) }</pre></code>
    <h1>Customer</h1>
<code><pre>${ JSON.stringify(state.customer, ' ', 2) }</pre></code>
    <h1>Bot</h1>
<code><pre>${ JSON.stringify(state.bot, ' ', 2) }</pre></code>
    <h1>Users</h1>
<code><pre>${ JSON.stringify(state.users, ' ', 2) }</pre></code>
    <h1>Replies</h1>
<code><pre>${ JSON.stringify(state.replies, ' ', 2) }</pre></code>
</div>
`);

// config
// models
// views
const app = choo({ history: false, href: false });
app.model(appModel);
app.model(uiModel);
app.model(customerModel);
app.model(botModel);
app.model(repliesModel);
app.model(intentsModel);
app.model(usersModel);
app.model(inviteModel);
app.model(createApiModel(config.controltower));
app.model(createSageModel(config.sage));
app.model(createFbSessionModel(config.facebook));

const defaultAnonView = loginView;
const authWrapper = (loggedView, anonView = defaultAnonView) => (state, prev, send) => state.customer.isLogged ? loggedView(state, prev, send) : anonView(state, prev, send);

const viewWrapper = ramda.pipe(authWrapper, dashboardView);
const homeView = viewWrapper(homeContent);
const channelsView = viewWrapper(channelsContent);
const ecommerceView = viewWrapper(ecommerceContent);
const intentsView = viewWrapper(intentsContent);
const repliesView = viewWrapper(repliesContent);
const mutedChatsView = viewWrapper(mutedChatsContent);
const adminsView = viewWrapper(adminsContent);
const invitationView = invitationContent;
const debugView = viewWrapper(debugContent);

const rootView = homeView;
app.router([['/', rootView], ['/controltower', rootView], ['/home', homeView], ['/channels', channelsView], ['/ecommerce', ecommerceView], ['/intents', intentsView], ['/replies', repliesView], ['/mutedChats', mutedChatsView], ['/admins', adminsView], ['/invite', invitationView], ['/debug', debugView]]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(mainView());
const mainWrapper = document.getElementById('mainContent');
mainWrapper.appendChild(tree);
