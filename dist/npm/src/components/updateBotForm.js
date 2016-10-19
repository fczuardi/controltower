'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (fields, isUpdating, classes, messages, onSubmit) => _html2.default`
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
`;

module.exports = exports['default'];