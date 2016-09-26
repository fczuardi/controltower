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
        <option
            ${isSelected ? 'selected' : ''}
            value=${fullKey}
        >
            ${value}
        </option>
    `;
});

const genericTemplate = (selectedReply, replies, classes) => {
    const sampleQuestion = !selectedReply.sampleQuestion ? null : html`
    <p class=${classes.sampleQuestion}>
        ${selectedReply.sampleQuestion}
    </p>`;
    const title = !selectedReply.title ? null : html`
        <input class=${classes.title} name="title" value=${selectedReply.title} />`;
    const text = !selectedReply.text ? null : html`
        <textarea class=${classes.text} name="text">${selectedReply.text}</textarea>`;
    const template = !selectedReply.template ? null : selectedReply.template;
    const answer = (template !== 'generic') ? text : html`
        <div class=${classes.body}>
            ${title}
            ${text}
        </div>
    `;
    const singleButton = typeof selectedReply === 'string'
        ? html`<input class=${classes.button} name="buttonTitle" value=${selectedReply}>`
        : null;
    const buttons = selectedReply.buttons
        ? html`
        <div class=${classes.footer}>
            ${selectedReply.buttons.map(key => html`
                <button disabled class=${classes.button}>${replies.buttons[key]}</button>
            `)}
        </div>`
        : singleButton;
    return html`
<div>
    ${sampleQuestion}
    <div class=${classes.container}>
        <div class=${template ? classes.template[template] : classes.template.none}>
            ${answer}
            ${buttons}
        </div>
    </div>
</div>
    `;
};

export default (
    selectedKey, replies, selectedReply,
    classes, messages, isLoading,
    onChange, onSubmit
) => {
    const fields = html`
<div>
    <div class=${classes.formGroup}>
        <label class=${classes.label}>
            ${messages.reply}
        </label>
        <div class=${classes.inputContainer}>
            <select class=${classes.input} onchange=${onChange}>
                ${buildOptions(selectedKey, messages.replyTitles)}
            </select>
        </div>
    </div>
    <div class="ln_solid"></div>
    <div class=${classes.formGroup}>
        ${genericTemplate(selectedReply, replies, classes.reply)}
    </div>
</div>
    `;
    return updateBotFormComponent(
        fields, isLoading, classes, messages, onSubmit
    );
};
