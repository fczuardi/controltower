import html from 'choo/html';
const pageListComponent = require('../components/pageList');

export default (pages, classes, messages) => html`
<form class=${classes.form}>
    <div class=${classes.formGroup}>
        <label class=${classes.label}>
            ${messages.page}
        </label>
        ${pageListComponent(pages, classes)}
    </div>
    <div class=${classes.separator}></div>
    <div class=${classes.formGroup}>
        <div class=${classes.buttonGroup}>
            <button class=${classes.cancelButton}>${messages.cancel}</button>
            <button class=${classes.submitButton}>${messages.submit}</button>
        </div>
    </div>
</form>
`;
