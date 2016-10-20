'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _qs = require('sheet-router/qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            const qsData = (0, _qs2.default)(data);
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

exports.default = inviteModel;
module.exports = exports['default'];