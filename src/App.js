// @ts-nocheck
// TODO: REMOVE THIS NO CHECK AND ACTUALLY USE TYPES...
import React, { useMemo } from 'react';
import { useBlockLayout, usePagination, useResizeColumns, useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import styled from 'styled-components';
import { matchSorter } from 'match-sorter';
import stars from '../scripts/stars.json';
import "regenerator-runtime/runtime.js";
function App() {
    const data = useMemo(() => stars, []);
    const columns = useMemo(() => [
        {
            Header: "Name",
            accessor: "fullname",
            filter: 'fuzzyText'
        },
        {
            Header: "Description",
            accessor: "description",
            filter: 'fuzzyText'
        },
        {
            Header: "Language",
            accessor: "language",
            filter: 'fuzzyText'
        },
        {
            Header: "Labels",
            accessor: "labels",
            filter: 'fuzzyText'
        },
        {
            Header: "Stars",
            accessor: "stargazers_count",
            Filter: NumberRangeColumnFilter,
            filter: 'between',
        },
        {
            Header: "URL",
            accessor: "html_url",
            filter: 'fuzzyText'
        },
        {
            Header: "Homepage",
            accessor: "homepage",
            filter: 'fuzzyText'
        },
        {
            Header: "Starred At",
            accessor: "starred_at",
            filter: 'fuzzyText'
        }
    ], []);
    const filterTypes = React.useMemo(() => ({
        // Add a new fuzzyTextFilterFn filter type.
        fuzzyText: fuzzyTextFilterFn,
        // Or, override the default text filter to use
        // "startWith"
        text: (rows, id, filterValue) => {
            return rows.filter((row) => {
                const rowValue = row.values[id];
                return rowValue !== undefined
                    ? String(rowValue)
                        .toLowerCase()
                        .startsWith(String(filterValue).toLowerCase())
                    : true;
            });
        },
    }), []);
    const defaultColumn = React.useMemo(() => ({
        // Let's set up our default Filter UI
        Filter: DefaultColumnFilter,
    }), []);
    const tableInstance = useTable({
        columns,
        data,
        defaultColumn,
        filterTypes
    }, useBlockLayout, useResizeColumns, useFilters, useGlobalFilter, useSortBy, usePagination);
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, 
    // Paging
    page, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, state, visibleColumns, preGlobalFilteredRows, setGlobalFilter, } = tableInstance;
    return (React.createElement(Styles, null,
        React.createElement("div", { className: "pagination" },
            React.createElement("button", { onClick: () => gotoPage(0), disabled: !canPreviousPage }, '<<'),
            ' ',
            React.createElement("button", { onClick: () => previousPage(), disabled: !canPreviousPage }, '<'),
            ' ',
            React.createElement("button", { onClick: () => nextPage(), disabled: !canNextPage }, '>'),
            ' ',
            React.createElement("button", { onClick: () => gotoPage(pageCount - 1), disabled: !canNextPage }, '>>'),
            ' ',
            React.createElement("span", null,
                "Page",
                ' ',
                React.createElement("strong", null,
                    state.pageIndex + 1,
                    " of ",
                    pageOptions.length),
                ' '),
            React.createElement("span", null,
                "| Go to page:",
                ' ',
                React.createElement("input", { type: "number", defaultValue: state.pageIndex + 1, onChange: e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        gotoPage(page);
                    } })),
            ' ',
            React.createElement("select", { value: state.pageSize, onChange: e => {
                    setPageSize(Number(e.target.value));
                } }, [10, 20, 30, 40, 50].map(pageSize => (React.createElement("option", { key: pageSize, value: pageSize },
                "Show ",
                pageSize))))),
        React.createElement("p", null),
        React.createElement("table", { ...getTableProps(), className: "table" },
            React.createElement("thead", null,
                headerGroups.map((headerGroup) => (
                // Apply the header row props
                React.createElement("tr", { ...headerGroup.getHeaderGroupProps(), className: "tr" }, // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                // Apply the header cell props
                React.createElement("th", { ...column.getHeaderProps(column.getSortByToggleProps()), className: "th" },
                    column.render('Header'),
                    React.createElement("div", null, column.canFilter ? column.render('Filter') : null),
                    React.createElement("span", null, column.isSorted
                        ? column.isSortedDesc
                            ? ' (desc)'
                            : ' (asc)'
                        : ''),
                    React.createElement("div", { ...column.getResizerProps(), className: `resizer ${column.isResizing ? 'isResizing' : ''}`, onClick: (e) => { e.preventDefault(); e.stopPropagation(); } }))))))),
                React.createElement("tr", null,
                    React.createElement("th", { colSpan: visibleColumns.length, style: {
                            textAlign: 'left',
                        } },
                        React.createElement(GlobalFilter, { preGlobalFilteredRows: preGlobalFilteredRows, globalFilter: state.globalFilter, setGlobalFilter: setGlobalFilter })))),
            React.createElement("tbody", { ...getTableBodyProps() }, // Loop over the table rows
            page.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                // Apply the row props
                React.createElement("tr", { ...row.getRowProps(), className: "tr" }, // Loop over the rows cells
                row.cells.map((cell) => {
                    // Apply the cell props
                    return (React.createElement("td", { ...cell.getCellProps(), className: "td" }, // Render the cell contents
                    cell.render('Cell')));
                })));
            })))));
}
// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
    return rows.filter(row => {
        const rowValue = row.values[id];
        return rowValue >= filterValue;
    });
}
// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number';
// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined);
    }, 200);
    return (React.createElement("span", null,
        "Search:",
        ' ',
        React.createElement("input", { value: value || "", onChange: e => {
                setValue(e.target.value);
                onChange(e.target.value);
            }, placeholder: `${count} records...` })));
}
// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter }, }) {
    const count = preFilteredRows.length;
    return (React.createElement("input", { value: filterValue || '', onChange: e => {
            setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }, placeholder: `Search ${count} records...`, onClick: (e) => { e.preventDefault(); e.stopPropagation(); } }));
}
// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id }, }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);
    // Render a multi-select box
    return (React.createElement("select", { value: filterValue, onChange: e => {
            setFilter(e.target.value || undefined);
        } },
        React.createElement("option", { value: "" }, "All"),
        options.map((option, i) => (React.createElement("option", { key: i, value: option }, option)))));
}
// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id }, }) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        preFilteredRows.forEach((row) => {
            min = Math.min(row.values[id], min);
            max = Math.max(row.values[id], max);
        });
        return [min, max];
    }, [id, preFilteredRows]);
    return (React.createElement("div", { style: {
            display: 'flex',
        } },
        React.createElement("input", { value: filterValue[0] || '', type: "number", onChange: e => {
                const val = e.target.value;
                setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
            }, placeholder: `Min (${min})`, style: {
                width: '100%',
            }, onClick: (e) => { e.preventDefault(); e.stopPropagation(); } }),
        "to",
        React.createElement("input", { value: filterValue[1] || '', type: "number", onChange: e => {
                const val = e.target.value;
                setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
            }, placeholder: `Max (${max})`, style: {
                width: '100%',
            }, onClick: (e) => { e.preventDefault(); e.stopPropagation(); } })));
}
function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;
const Styles = styled.div `
  padding: 1rem;

  .table {
    overflow: auto;
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      word-break:break-all;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      ${'' /* In this example we use an absolutely position resizer,
 so this is required. */}
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`;
export default App;
