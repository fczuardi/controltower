'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _updateBotForm = require('./updateBotForm');

var _updateBotForm2 = _interopRequireDefault(_updateBotForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (state, send, classes, messages, isUpdating = false, onSubmit = null) => {
    const nonDefaultIntents = state.intents.names.filter(name => name !== 'none');
    const selectedIntent = state.intents.selectedIntent;
    const utterances = state.intents.utterances[selectedIntent] || [];
    const onIntentSelected = e => {
        send('intents:selectIntent', e.target.value);
    };
    const intentOptions = _html2.default`
        <select
            name="intentSelect"
            value=${ selectedIntent }
            class=${ classes.input }
            onchange=${ onIntentSelected }
        >
            <option value="none">
                ${ messages.addIntentOption }
            </option>
            <optgroup label=${ messages.existingIntents }>
                ${ nonDefaultIntents.map(intentName => _html2.default`
                    <option
                        selected=${ selectedIntent === intentName }
                    >${ intentName }</option>
                `) }
            </optgroup>
        </select>
    `;
    const intentNameField = selectedIntent === 'none' ? _html2.default`
            <div class=${ classes.formGroup }>
                <label class=${ classes.label }>
					${ messages.intentName }
				</label>
                <div class=${ classes.inputContainer }>
					<input name="intentName">
                </div>
            </div>` : null;
    const newUtterance = _html2.default`
		<div>
			<h4>${ messages.newUterranceTitle }</h4>
            <input name="newUtterance" class=${ classes.input }>
		</div>
	`;
    const existingUtterances = _html2.default`
        <div>
            <h4>${ messages.utterances }</h4>
            <div>
                ${ utterances.map(value => _html2.default`
                    <div class=${ classes.formGroup }>
                        <div class=${ classes.inputContainer }>
                            <input
                                class=${ classes.input }
                                value=${ value }
                                readonly
                            />
                        </div>
                    </div>`) }
            </div>
        </div>
    `;
    const intentForm = selectedIntent === 'none' ? null : _html2.default`
        <div>
            <div class=${ classes.separator }></div>
            ${ newUtterance }
            ${ utterances.length ? existingUtterances : null }
        </div>`;
    const fields = _html2.default`
        <div>
            <div class=${ classes.formGroup }>
                <label class=${ classes.label }>
                    ${ messages.intentList }
                </label>
                <div class=${ classes.inputContainer }>
                    ${ intentOptions }
                </div>
			</div>
			${ intentNameField }
			${ intentForm }
        </div>
    `;
    return (0, _updateBotForm2.default)(fields, isUpdating, classes, messages, onSubmit);
};

module.exports = exports['default'];