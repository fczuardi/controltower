'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = state => _html2.default`
<div>
    <h1>Controltower API</h1>
<code><pre>${ JSON.stringify(state.api, ' ', 2) }</pre></code>
    <h1>Sage API</h1>
<code><pre>${ JSON.stringify(state.sage, ' ', 2) }</pre></code>
    <h1>Intents</h1>
<code><pre>${ JSON.stringify(state.intents, ' ', 2) }</pre></code>
    <h1>Customer</h1>
<code><pre>${ JSON.stringify(state.customer, ' ', 2) }</pre></code>
    <h1>Bot</h1>
<code><pre>${ JSON.stringify(state.bot, ' ', 2) }</pre></code>
    <h1>Users</h1>
<code><pre>${ JSON.stringify(state.users, ' ', 2) }</pre></code>
    <h1>Replies</h1>
<code><pre>${ JSON.stringify(state.replies, ' ', 2) }</pre></code>
</div>
`;

module.exports = exports['default'];