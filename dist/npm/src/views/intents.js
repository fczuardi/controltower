'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _intentsForm = require('../components/intentsForm');

var _intentsForm2 = _interopRequireDefault(_intentsForm);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

var _botSetup = require('../views/botSetup');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (state, prev, send) => {
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
    const content = (0, _intentsForm2.default)(state, send, _botSetup.formClasses, _ptBr2.default.intents.faq, false, onSubmit);
    const panels = [(0, _botSetup.panel)(content, _ptBr2.default.intents.faq.title, _ptBr2.default.intents.faq.description)];
    return (0, _botSetup.view)(_ptBr2.default.intents.title, panels);
};

module.exports = exports['default'];