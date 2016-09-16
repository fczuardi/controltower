const html = require('choo/html');

const formClasses = {
    form: 'form-horizontal form-label-left',
    formGroup: 'form-group',
    table: 'table table-striped jambo_table',
    selectedTableRow: 'selected',
    tableCheckboxRow: 'checkboxRow',
    label: 'control-label col-md-3 col-sm-3 col-xs-12',
    inputContainer: 'col-md-9 col-sm-9 col-xs-12',
    input: 'form-control',
    separator: 'ln_solid',
    buttonGroup: 'col-md-9 col-sm-9 col-xs-12 col-md-offset-3',
    cancelButton: 'btn btn-primary',
    submitButton: 'btn btn-success'
};

const view = (form, messages) => html`
<div>
    <div class="title-left">
        <h3>${messages.title}</h3>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="x_panel">
                <div class="x_title nav">
                    <h2>${messages.subtitle}</h2>
                </div>
                <div class="x_content">
                    <p>
                        ${messages.description}
                    </p>
                    ${form}
                </div>
            </div>
        </div>
    </div>
</div>
`;

module.exports = {
    formClasses,
    view
};
