import html from 'choo/html';
import updateBotFormComponent from './updateBotForm';
import { path } from 'ramda';

const buildOptions = (selectedKey, list, keyPrefix) => Object.keys(list).map(key => {
    if (key === 'title') {
        return null;
    }
    const fullKey = (keyPrefix || '') + key;
    const isSelected = (fullKey === selectedKey);
    const value = list[key];
    const isChildList = typeof value === 'object' && value.title;
    return isChildList
        ? html`
            <optgroup label=${value.title || ''}>
                ${buildOptions(selectedKey, value, `${key}.`)}
            </optgroup>`
        : html`
        <option
            ${isSelected ? 'selected' : ''}
            value=${fullKey}
        >
            ${value}
        </option>
    `;
});

export default (selectedKey, replies, classes, messages, isLoading, onChange, onSubmit) => {
    const selectedReply = path(selectedKey.split('.'), replies);
    const fields = html`
<div class=${classes.formGroup}>
    <label class=${classes.label}>
        ${messages.reply}
    </label>
    <div class=${classes.inputContainer}>
        <select class=${classes.input} onchange=${onChange}>
            ${buildOptions(selectedKey, messages.replyTitles)}
        </select>
    </div>
    <div>
        <pre>
            ${JSON.stringify(selectedReply)}
        </pre>
    </div>
</div>
    `;
    return updateBotFormComponent(
        fields, isLoading, classes, messages, onSubmit
    );
};
