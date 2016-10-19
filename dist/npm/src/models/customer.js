'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

exports.default = customerModel;
module.exports = exports['default'];