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

const genericTemplate = (
    selectedReplyKey,
    selectedReply = { text: '' },
    replies,
    utterances,
    classes
) => {
    const {
        sampleQuestion,
        template = null,
        title,
        subtitle,
        text,
        buttons,
        ...other
    } = selectedReply;
    const isTemplateGeneric = template === 'generic';
    const isButton = selectedReplyKey.split('.')[0] === 'buttons';
    const sampleQuestionBalloon = !sampleQuestion && !utterances[selectedReplyKey] ? null : html`
    <p class=${classes.sampleQuestion}>
        ${sampleQuestion || utterances[selectedReplyKey][0]}
    </p>`;
    const titleInput = !title ? null : html`
        <input class=${classes.title} name="title" value=${title} />`;
    const subtitleOrText = isTemplateGeneric ? subtitle : text;
    const subtitleFieldName = isTemplateGeneric ? 'subtitle' : 'text';
    const subtitleInput = (isButton) ? null
        : html`
        <textarea 
            class=${classes.subtitle} 
            name=${subtitleFieldName}
            key=${selectedReplyKey}
            value=${subtitleOrText}
        >${subtitleOrText}</textarea>`;
    const answer = (template !== 'generic') ? subtitleInput : html`
        <div class=${classes.body}>
            ${titleInput}
            ${subtitleInput}
        </div>
    `;
    const singleButton = !isButton ? null : html`
        <input
            class=${classes.button}
            name="text"
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
    replyTitles,
    selectedReplyKey,
    replies,
    selectedReply,
    utterances,
    classes,
    messages,
    isLoading,
    onChange,
    onSubmit
) => {
    const fields = html`
<div>
    <div class=${classes.formGroup}>
        <label class=${classes.label}>
            ${messages.reply}
        </label>
        <div class=${classes.inputContainer}>
            <select
                value=${selectedReplyKey}
                class=${classes.input}
                onchange=${onChange}
            >
                <option>${messages.selectAReply}</option>
                ${buildOptions(selectedReplyKey, replyTitles)}
            </select>
        </div>
    </div>
    <div class="ln_solid"></div>
    <div class=${classes.formGroup} data-replyKey=${selectedReplyKey}>
        ${selectedReplyKey
            ? genericTemplate(selectedReplyKey, selectedReply, replies, utterances, classes.reply)
            : null
        }
    </div>
</div>
    `;
    return updateBotFormComponent(
        fields, isLoading, classes, messages, onSubmit
    );
};
