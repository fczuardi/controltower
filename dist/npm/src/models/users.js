'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

exports.default = usersModel;
module.exports = exports['default'];