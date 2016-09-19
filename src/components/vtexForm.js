import html from 'choo/html';
import updateBotFormComponent from './updateBotForm';

export default (isUpdating, values, classes, messages, onSubmit) => {
    const fieldNames = [
        'apiToken',
        'apiKey',
        'apiAccountName',
        'apiEnvironment',
        'appKey',
        'appToken'
    ];
    const fields = fieldNames.map(name => html`
        <div class=${classes.formGroup}>
            <label class=${classes.label}>
                ${messages[name]}
            </label>
            <div class=${classes.inputContainer}>
                <input
                    name=${name}
                    value=${values[name] || ''}
                    class=${classes.input}
                >
            </div>
        </div>
    `);
    return updateBotFormComponent(
        fields, isUpdating, classes, messages, onSubmit
    );
};
