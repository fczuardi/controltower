import html from 'choo/html';
import updateBotFormComponent from './updateBotForm';

export default (state, send, classes, messages, isUpdating = false, onSubmit = null) => {
    const nonDefaultIntents = state.intents.names.filter(name => (name !== 'none'));
    const utterances = state.intents.utterances[state.intents.selectedIntent] || [];
    const onIntentSelected = e => {
        send('intents:selectIntent', e.target.value);
    };
    const intentOptions = html`
        <optgroup label=${messages.existingIntents}>
            ${nonDefaultIntents.map(intentName => html`
                <option>${intentName}</option>
            `)}
        </optgroup>
    `;
    const utteranceField = (value, isMain = false) => html`
        <div class=${classes.formGroup}>
            ${isMain ? html`
            <label class=${classes.label}>
                ${messages.mainUtterance}
            </label>
            ` : null}
            <div class=${classes.inputContainer}>
                <input
                    class=${classes.input}
                    value=${value || ''}
                />
            </div>
        </div>
    `;
    const editUterrances = !utterances.length ? null : html`
        <div>
            ${utteranceField(utterances[0], true)}
            <div class=${classes.separator}></div>
            <h4>${messages.otherUtterances}</h4>
            ${utterances.slice(1).map(value =>
                utteranceField(value)
            )}
        </div>
    `;
    const newIntentOption = html`
        <option value="none">
            ${messages.addIntentOption}
        </option>
    `;
    const fields = html`
        <div>
            <div class=${classes.formGroup}>
                <label class=${classes.label}>
                    ${messages.intentList}
                </label>
                <div class=${classes.inputContainer}>
                    <select
                        class=${classes.input}
                        onchange=${onIntentSelected}
                    >
                        ${newIntentOption}
                        ${intentOptions}
                    </select>
                </div>
                ${editUterrances}
            </div>
        </div>
    `;
    return updateBotFormComponent(
        fields, isUpdating, classes, messages, onSubmit
    );
};
