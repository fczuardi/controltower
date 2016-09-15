const html = require('choo/html');

module.exports = (fields, isUpdating, classes, messages, onSubmit) => html`
<form class=${classes.form} onsubmit=${onSubmit}>
    ${fields}
    <div class=${classes.separator}></div>
    <div class=${classes.formGroup}>
        <div class=${classes.buttonGroup}>
            <button type="reset" class=${classes.cancelButton}
            >${messages.cancel}</button>
            <button type="submit" class=${classes.submitButton}
                ${isUpdating ? 'disabled' : ''}
            >${messages.submit}</button>
        </div>
    </div>
</form>
`;
