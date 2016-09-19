import html from 'choo/html';

const createRowClickHandler = (index, isSelected, select, deselect) => e => {
    e.preventDefault();
    return isSelected ? deselect(index) : select(index);
};

const createSelectAll = (isAllSelected, dataSet, select, deselect) => e => {
    e.preventDefault();
    dataSet.forEach((item, index) => (
        isAllSelected ? deselect(index) : select(index)
    ));
};

const tableRow = (row, index, selectedRows, classes, onRowSelected, onRowDeselected) => {
    const isSelected = selectedRows.includes(index);
    const trClass = isSelected ? classes.selectedTableRow : '';
    const checked = isSelected ? 'checked' : '';
    const clickHandler = createRowClickHandler(index, isSelected,
        onRowSelected, onRowDeselected);
    return html`
        <tr class=${trClass} onclick=${clickHandler}>
            <td>
                <input type="checkbox" ${checked}></input>
            </td>
            ${row.map(cell => html`
                <td>${cell}</td>
            `)}
        </tr>
    `;
};

const createTable = (headers, dataSet, selectedRows, classes, isAllSelected,
                            selectAll, onRowSelected, onRowDeselected) => html`
<table
    cellpadding="0" cellspacing="0" border="0"
    class=${classes.table}
>
    <thead>
        <tr>
            <th class=${classes.tableCheckboxRow}>
                <input
                    type="checkbox" ${isAllSelected ? 'checked' : ''}
                    onclick=${selectAll}></input>
            </th>
        ${headers.map(name => html`
            <th>${name}</th>
        `)}
        </tr>
    </thead>
    <tbody>
        ${dataSet.map((row, index) =>
            tableRow(row, index, selectedRows, classes, onRowSelected, onRowDeselected)
        )}
    </tbody>
</table>
`;

export default (
    headers,
    dataSet,
    selectedRows,
    isUpdating,
    classes,
    messages,
    onRowSelected,
    onRowDeselected,
    onSubmit
) => {
    const isAllSelected = selectedRows.length && (selectedRows.length === dataSet.length);
    const selectAll = createSelectAll(isAllSelected, dataSet, onRowSelected, onRowDeselected);
    return html`
<form class=${classes.form} onsubmit=${onSubmit}>
    <div class=${classes.formGroup}>
        ${!dataSet.length ? null : createTable(
            headers, dataSet, selectedRows, classes, isAllSelected,
            selectAll, onRowSelected, onRowDeselected
        )}
    </div>
    <div class=${classes.separator}></div>
    <div class=${classes.formGroup}>
        <div class=${classes.buttonGroup}>
            <button type="submit" class=${classes.submitButton}
                ${(isUpdating || !selectedRows.length) ? 'disabled' : ''}
            >${messages.submit}</button>
        </div>
    </div>
</form>
    `;
};
