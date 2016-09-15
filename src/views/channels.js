const html = require('choo/html');
const pageListFormComponent = require('../components/pageListForm');

import messages from '../../locales/ptBr';

const pageListClasses = {
    form: 'form-horizontal form-label-left',
    formGroup: 'form-group',
    label: 'control-label col-md-3 col-sm-3 col-xs-12',
    pageList: 'col-md-9 col-sm-9 col-xs-12',
    select: 'form-control',
    separator: 'ln_solid',
    buttonGroup: 'col-md-9 col-sm-9 col-xs-12 col-md-offset-3',
    cancelButton: 'btn btn-primary',
    submitButton: 'btn btn-success'
};

module.exports = state => html`
<div>
    <div class="title-left">
        <h3>${messages.channels.title}</h3>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="x_panel">
                <div class="x_title nav">
                    <h2>${messages.channels.facebook.title}</h2>
                </div>
                <div class="x_content">
                    <p>
                        ${messages.channels.facebook.description.ecommerce}
                    </p>
                    ${pageListFormComponent(
                        state.ui.facebookPages,
                        pageListClasses,
                        messages.channels.facebook
                    )}
                </div>
            </div>
        </div>
    </div>
</div>
`;
