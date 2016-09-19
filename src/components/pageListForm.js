import html from 'choo/html';
import updateBotFormComponent from './updateBotForm';
import pageListComponent from './pageList';

export default (pages, selectedPage, isUpdating, classes, messages, onSubmit) => {
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
