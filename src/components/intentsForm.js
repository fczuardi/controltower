import html from 'choo/html';
import updateBotFormComponent from './updateBotForm';

export default (state, send, classes,
        messages, isUpdating = false, onSubmit = null) => {
    const nonDefaultIntents = state.intents.names.filter(
        name => (name !== 'none')
    );
    const selectedIntent = state.intents.selectedIntent;
    const utterances = state.intents.utterances[selectedIntent] || [];
    const onIntentSelected = e => {
        send('intents:selectIntent', e.target.value);
    };
    const intentOptions = html`
        <select
            class=${classes.input}
            onchange=${onIntentSelected}
        >
            <option value="none">
                ${messages.addIntentOption}
            </option>
            <optgroup label=${messages.existingIntents}>
                ${nonDefaultIntents.map(intentName => html`
                    <option
                        selected=${selectedIntent === intentName}
                    >${intentName}</option>
                `)}
            </optgroup>
        </select>
    `;
    const intentNameField = selectedIntent === 'none'
		? html`
            <div class=${classes.formGroup}>
                <label class=${classes.label}>
					${messages.intentName}
				</label>
                <div class=${classes.inputContainer}>
					<input name="intentName">
                </div>
            </div>`
		: null;
    const newUtterance = html`
		<div>
			<h4>${messages.newUterranceTitle}</h4>
            <input name="newUtterance" class=${classes.input}>
		</div>
	`;
    const intentForm = !utterances.length ? null : html`
        <div>
            <div class=${classes.separator}></div>
            ${newUtterance}
            <div>
                <h4>${messages.utterances}</h4>
                <div>
                    ${utterances.map(value => html`
                        <div class=${classes.formGroup}>
                            <div class=${classes.inputContainer}>
                                <input
                                    class=${classes.input}
                                    value=${value}
                                    readonly
                                />
                            </div>
                        </div>`
                    )}
                </div>
            </div>
        </div>`;
    const fields = html`
        <div>
            <div class=${classes.formGroup}>
                <label class=${classes.label}>
                    ${messages.intentList}
                </label>
                <div class=${classes.inputContainer}>
                    ${intentOptions}
                </div>
			</div>
			${intentNameField}
			${intentForm}
        </div>
    `;
    return updateBotFormComponent(
        fields, isUpdating, classes, messages, onSubmit
    );
};
