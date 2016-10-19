'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.panel = exports.view = exports.formClasses = undefined;

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const panel = (form, title, description, navbarRightContent) => _html2.default`
    <div class="col-md-6">
        <div class="x_panel">
            <div class="x_title nav">
                <h2>${ title }</h2>
                <div class="navbar-right panel_toolbox">
                    ${ navbarRightContent }
                </div>
            </div>
            <div class="x_content">
                <p>
                    ${ description }
                </p>
                ${ form }
            </div>
        </div>
    </div>
`;

// const view = (form, messages, navbarRightContent) => html`
const view = (title, panels) => _html2.default`
<div>
    <div class="title-left">
        <h3>${ title }</h3>
    </div>
    <div class="row">
        ${ panels }
    </div>
</div>
`;

exports.formClasses = formClasses;
exports.view = view;
exports.panel = panel;