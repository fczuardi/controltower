const html = require('choo/html');
const pageListComponent = require('../components/pageList');

module.exports = (pages, selectedPage, isUpdating, classes, messages, onSubmit) => html`
<form class=${classes.form} onsubmit=${onSubmit}>
    <div class=${classes.formGroup}>
        <label class=${classes.label}>
            ${messages.page}
        </label>
        ${pageListComponent(pages, selectedPage, classes, 'select')}
    </div>
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
