'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

exports.default = botModel;
module.exports = exports['default'];