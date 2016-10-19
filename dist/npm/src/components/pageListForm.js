'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _updateBotForm = require('./updateBotForm');

var _updateBotForm2 = _interopRequireDefault(_updateBotForm);

var _pageList = require('./pageList');

var _pageList2 = _interopRequireDefault(_pageList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (pages, selectedPage, isUpdating, classes, messages, onSubmit) => {
    const fields = _html2.default`
        <div class=${ classes.formGroup }>
            <label class=${ classes.label }>
            ${ messages.page }
            </label>
            <div class=${ classes.inputContainer }>
                ${ (0, _pageList2.default)(pages, selectedPage, classes, 'select') }
            </div>
        </div>
    `;
    return (0, _updateBotForm2.default)(fields, isUpdating, classes, messages, onSubmit);
};

module.exports = exports['default'];