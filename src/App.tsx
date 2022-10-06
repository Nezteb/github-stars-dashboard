// @ts-nocheck
// TODO: REMOVE THIS NO CHECK AND ACTUALLY USE TYPES...

import React, { useMemo, useState } from 'react'
import {
  useBlockLayout,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table'
import styled from 'styled-components'
import { matchSorter } from 'match-sorter'
import stars from '../scripts/stars.json';
import "regenerator-runtime/runtime.js";

type Star = {
  starred_at: string,
  fullname: string,
  html_url: string,
  stargazers_count: number,
  labels: string | null,
  homepage: string | null,
  description: string | null,
  language: string | null
}

function App() {
  const data = useMemo((): Star[] => stars, []);

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

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const tableInstance: any = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes
    },
    useBlockLayout,
    useResizeColumns,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // Paging
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = tableInstance

  return (
    <Styles>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <span>Also on <a href="https://airtable.com/shr3LkqGTxaLc4aMw">AirTable</a></span>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {state.pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={state.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
          />
        </span>{' '}
        <select
          value={state.pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <p />
      {// apply the table props
        <table {...getTableProps()} className="table">
          <thead>
            {// Loop over the header rows
              headerGroups.map((headerGroup: any) => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()} className="tr">
                  {// Loop over the headers in each row
                    headerGroup.headers.map((column: any) => (
                      // Apply the header cell props
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                        {// Render the header
                          column.render('Header')}
                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' (desc)'
                              : ' (asc)'
                            : ''}
                        </span>
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                        />
                      </th>
                    ))}
                </tr>
              ))}
            <tr>
              <th
                colSpan={visibleColumns.length}
                style={{
                  textAlign: 'left',
                }}
              >
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </th>
            </tr>
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
              page.map((row: any) => {
                // Prepare the row for display
                prepareRow(row)
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()} className="tr">
                    {// Loop over the rows cells
                      row.cells.map((cell: any) => {
                        // Apply the cell props
                        return (
                          <td {...cell.getCellProps()} className="td">
                            {// Render the cell contents
                              cell.render('Cell')}
                          </td>
                        )
                      })}
                  </tr>
                )
              })}
          </tbody>
        </table>}
    </Styles>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows: any, id: any, filterValue: any) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}: { column: any }) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '100%',
        }}
        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '100%',
        }}
        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows: any, id: any, filterValue: any) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val

const Styles = styled.div`
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
`

export default App
