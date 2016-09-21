import html from 'choo/html';
import updateBotFormComponent from './updateBotForm';

export default (selectedKey, classes, messages, isLoading, onSubmit) => {
    const fields = html`
<div class=${classes.formGroup}>
    <label class=${classes.label}>
        ${messages.reply}
    </label>
    <div class=${classes.inputContainer}>
        <select class=${classes.input}>
            ${Object.keys(messages.replyTitles).map(key => {
                const isSelected = (key === selectedKey);
                return html`
                    <option ${isSelected ? 'selected' : ''}>
                        ${messages.replyTitles[key]}
                    </option>
                `;
            })}
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
