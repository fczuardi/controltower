'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const click = (send, action) => e => {
    e.preventDefault();
    send(action);
};

exports.default = (labels, classes, send) => _html2.default`
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
`;

module.exports = exports['default'];