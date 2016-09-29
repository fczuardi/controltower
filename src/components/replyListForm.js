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

const genericTemplate = (selectedReplyKey, selectedReply, replies, classes) => {
    const {
        sampleQuestion, template = null,
        title, subtitle, text, buttons, ...other
    } = selectedReply;
    const isButton = selectedReplyKey.split('.')[0] === 'buttons';
    const sampleQuestionBalloon = !sampleQuestion ? null : html`
    <p class=${classes.sampleQuestion}>
        ${sampleQuestion}
    </p>`;
    const titleInput = !title ? null : html`
        <input class=${classes.title} name="title" value=${title} />`;
    const subtitleOrText = subtitle || text;
    const subtitleInput = (!subtitleOrText || isButton) ? null
        : html`
        <textarea class=${classes.subtitle} name="subtitle">
            ${subtitleOrText}
        </textarea>`;
    const answer = (template !== 'generic') ? subtitle : html`
        <div class=${classes.body}>
            ${titleInput}
            ${subtitleInput}
        </div>
    `;
    const singleButton = !isButton ? null : html`
        <input
            class=${classes.button}
            name="buttonTitle"
            value=${subtitleOrText}
        />`;
    const buttonsList = buttons
        ? html`
        <div class=${classes.footer}>
            ${buttons.map(key => html`
                <button disabled class=${classes.button}>
                    ${replies.buttons[key].text}
                </button>
            `)}
        </div>`
        : singleButton;
    const otherInput = Object.keys(other).map(key => html`
        <label>
            ${key}
            <input name=${key} value=${other[key]} />
        </label>
    `);
    return html`
<div>
    ${sampleQuestionBalloon}
    <div class=${classes.container}>
        <div class=${template ? classes.template[template] : classes.template.none}>
            ${answer}
            ${buttonsList}
        </div>
    </div>
    ${otherInput}
</div>
    `;
};

export default (
    selectedReplyKey, replies, selectedReply,
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
                ${buildOptions(selectedReplyKey, messages.replyTitles)}
            </select>
        </div>
    </div>
    <div class="ln_solid"></div>
    <div class=${classes.formGroup}>
        ${genericTemplate(selectedReplyKey, selectedReply, replies, classes.reply)}
    </div>
</div>
    `;
    return updateBotFormComponent(
        fields, isLoading, classes, messages, onSubmit
    );
};
