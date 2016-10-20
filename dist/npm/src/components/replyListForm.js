'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _updateBotForm = require('./updateBotForm');

var _updateBotForm2 = _interopRequireDefault(_updateBotForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const buildOptions = (selectedKey, list, keyPrefix) => Object.keys(list).map(key => {
    if (key === 'title') {
        return null;
    }
    const fullKey = (keyPrefix || '') + key;
    const isSelected = fullKey === selectedKey;
    const value = list[key];
    const isChildList = typeof value === 'object' && value.title;
    return isChildList ? _html2.default`
            <optgroup label=${ value.title || '' }>
                ${ buildOptions(selectedKey, value, `${ key }.`) }
            </optgroup>` : _html2.default`
        <option
            ${ isSelected ? 'selected' : '' }
            value=${ fullKey }
        >
            ${ value }
        </option>
    `;
});

const genericTemplate = (selectedReplyKey, selectedReply = { text: '' }, replies, utterances, classes) => {
    const sampleQuestion = selectedReply.sampleQuestion;
    var _selectedReply$templa = selectedReply.template;
    const template = _selectedReply$templa === undefined ? null : _selectedReply$templa;
    const title = selectedReply.title;
    const subtitle = selectedReply.subtitle;
    const text = selectedReply.text;
    const buttons = selectedReply.buttons;

    const other = _objectWithoutProperties(selectedReply, ['sampleQuestion', 'template', 'title', 'subtitle', 'text', 'buttons']);

    const isButton = selectedReplyKey.split('.')[0] === 'buttons';
    const sampleQuestionBalloon = !sampleQuestion && !utterances[selectedReplyKey] ? null : _html2.default`
    <p class=${ classes.sampleQuestion }>
        ${ sampleQuestion || utterances[selectedReplyKey][0] }
    </p>`;
    const titleInput = !title ? null : _html2.default`
        <input class=${ classes.title } name="title" value=${ title } />`;
    const subtitleOrText = subtitle || text;
    const subtitleFieldName = template === 'generic' ? 'subtitle' : 'text';
    const subtitleInput = !subtitleOrText || isButton ? null : _html2.default`
        <textarea 
            class=${ classes.subtitle } 
            name=${ subtitleFieldName }
            key=${ selectedReplyKey }
            value=${ subtitleOrText }
        >${ subtitleOrText }</textarea>`;
    const answer = template !== 'generic' ? subtitleInput : _html2.default`
        <div class=${ classes.body }>
            ${ titleInput }
            ${ subtitleInput }
        </div>
    `;
    const singleButton = !isButton ? null : _html2.default`
        <input
            class=${ classes.button }
            name="text"
            value=${ subtitleOrText }
        />`;
    const buttonsList = buttons ? _html2.default`
        <div class=${ classes.footer }>
            ${ buttons.map(key => _html2.default`
                <button disabled class=${ classes.button }>
                    ${ replies.buttons[key].text }
                </button>
            `) }
        </div>` : singleButton;
    const otherInput = Object.keys(other).map(key => _html2.default`
        <label>
            ${ key }
            <input name=${ key } value=${ other[key] } />
        </label>
    `);
    return _html2.default`
<div>
    ${ sampleQuestionBalloon }
    <div class=${ classes.container }>
        <div class=${ template ? classes.template[template] : classes.template.none }>
            ${ answer }
            ${ buttonsList }
        </div>
    </div>
    ${ otherInput }
</div>
    `;
};

// const replyTitles = messages.replyTitles;

exports.default = (replyTitles, selectedReplyKey, replies, selectedReply, utterances, classes, messages, isLoading, onChange, onSubmit) => {
    const fields = _html2.default`
<div>
    <div class=${ classes.formGroup }>
        <label class=${ classes.label }>
            ${ messages.reply }
        </label>
        <div class=${ classes.inputContainer }>
            <select
                value=${ selectedReplyKey }
                class=${ classes.input }
                onchange=${ onChange }
            >
                ${ buildOptions(selectedReplyKey, messages.replyTitles) }
            </select>
        </div>
    </div>
    <div class="ln_solid"></div>
    <div class=${ classes.formGroup } data-replyKey=${ selectedReplyKey }>
        ${ selectedReplyKey ? genericTemplate(selectedReplyKey, selectedReply, replies, utterances, classes.reply) : null }
    </div>
</div>
    `;
    return (0, _updateBotForm2.default)(fields, isLoading, classes, messages, onSubmit);
};

module.exports = exports['default'];