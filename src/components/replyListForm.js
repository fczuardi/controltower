import html from 'choo/html';
import updateBotFormComponent from './updateBotForm';

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
        <option ${isSelected ? 'selected' : ''}>
            ${value}
        </option>
    `;
});

export default (selectedKey, classes, messages, isLoading, onSubmit) => {
    const fields = html`
<div class=${classes.formGroup}>
    <label class=${classes.label}>
        ${messages.reply}
    </label>
    <div class=${classes.inputContainer}>
        <select class=${classes.input}>
            ${buildOptions(selectedKey, messages.replyTitles)}
        </select>
    </div>
    <div>
        TBD
    </div>
</div>
    `;
    return updateBotFormComponent(
        fields, isLoading, classes, messages, onSubmit
    );
};
