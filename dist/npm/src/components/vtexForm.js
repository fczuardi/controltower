'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _updateBotForm = require('./updateBotForm');

var _updateBotForm2 = _interopRequireDefault(_updateBotForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (isUpdating, values, classes, messages, onSubmit) => {
    const fieldNames = ['apiToken', 'apiKey', 'apiAccountName', 'apiEnvironment'];
    const fields = fieldNames.map(name => _html2.default`
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
    return (0, _updateBotForm2.default)(fields, isUpdating, classes, messages, onSubmit);
};

module.exports = exports['default'];