'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createRowClickHandler = (index, isSelected, select, deselect) => e => {
    e.preventDefault();
    return isSelected ? deselect(index) : select(index);
};

const createSelectAll = (isAllSelected, dataSet, select, deselect) => e => {
    e.preventDefault();
    dataSet.forEach((item, index) => isAllSelected ? deselect(index) : select(index));
};

const tableRow = (row, index, selectedRows, classes, onRowSelected, onRowDeselected) => {
    const isSelected = selectedRows.includes(index);
    const trClass = isSelected ? classes.selectedTableRow : '';
    const checked = isSelected ? 'checked' : '';
    const clickHandler = createRowClickHandler(index, isSelected, onRowSelected, onRowDeselected);
    return _html2.default`
        <tr class=${ trClass } onclick=${ clickHandler }>
            <td>
                <input type="checkbox" ${ checked }></input>
            </td>
            ${ row.map(cell => _html2.default`
                <td>${ cell }</td>
            `) }
        </tr>
    `;
};

const createTable = (headers, dataSet, selectedRows, classes, isAllSelected, selectAll, onRowSelected, onRowDeselected) => _html2.default`
<table
    cellpadding="0" cellspacing="0" border="0"
    class=${ classes.table }
>
    <thead>
        <tr>
            <th class=${ classes.tableCheckboxRow }>
                <input
                    type="checkbox" ${ isAllSelected ? 'checked' : '' }
                    onclick=${ selectAll }></input>
            </th>
        ${ headers.map(name => _html2.default`
            <th>${ name }</th>
        `) }
        </tr>
    </thead>
    <tbody>
        ${ dataSet.map((row, index) => tableRow(row, index, selectedRows, classes, onRowSelected, onRowDeselected)) }
    </tbody>
</table>
`;

exports.default = (headers, dataSet, selectedRows, isUpdating, classes, messages, onRowSelected, onRowDeselected, onSubmit) => {
    const isAllSelected = selectedRows.length && selectedRows.length === dataSet.length;
    const selectAll = createSelectAll(isAllSelected, dataSet, onRowSelected, onRowDeselected);
    return _html2.default`
<form class=${ classes.form } onsubmit=${ onSubmit }>
    <div class=${ classes.formGroup }>
        ${ !dataSet.length ? null : createTable(headers, dataSet, selectedRows, classes, isAllSelected, selectAll, onRowSelected, onRowDeselected) }
    </div>
    <div class=${ classes.separator }></div>
    <div class=${ classes.formGroup }>
        <div class=${ classes.buttonGroup }>
            <button type="submit" class=${ classes.submitButton }
                ${ isUpdating || !selectedRows.length ? 'disabled' : '' }
            >${ messages.submit }</button>
        </div>
    </div>
</form>
    `;
};

module.exports = exports['default'];