const html = require('choo/html');
const updateBotFormComponent = require('./updateBotForm');
const pageListComponent = require('./pageList');

module.exports = (pages, selectedPage, isUpdating, classes, messages, onSubmit) => {
    const fields = html`
        <div class=${classes.formGroup}>
            <label class=${classes.label}>
            ${messages.page}
            </label>
            <div class=${classes.inputContainer}>
                ${pageListComponent(pages, selectedPage, classes, 'select')}
            </div>
        </div>
    `;
    return updateBotFormComponent(
        fields, isUpdating, classes, messages, onSubmit
    );
};
