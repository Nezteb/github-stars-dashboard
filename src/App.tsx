import React, { useMemo, useState } from 'react'
import { useBlockLayout, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table'
import styled from 'styled-components'
import stars from '../scripts/stars.json';

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
      accessor: "fullname"
    },
    {
      Header: "Description",
      accessor: "description"
    },
    {
      Header: "Language",
      accessor: "language"
    },
    {
      Header: "Labels",
      accessor: "labels"
    },
    {
      Header: "Stars",
      accessor: "stargazers_count"
    },
    {
      Header: "URL",
      accessor: "html_url"
    },
    {
      Header: "Homepage",
      accessor: "homepage"
    },
    {
      Header: "Starred At",
      accessor: "starred_at"
    }
  ], []);

  const tableInstance = useTable(
    { columns, data },
    useSortBy,
    useBlockLayout,
    useResizeColumns,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    //rows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance

  return (
    <Styles>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
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
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
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
              headerGroups.map(headerGroup => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()} className="tr">
                  {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                      // Apply the header cell props
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                        {// Render the header
                          column.render('Header')}
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
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
              page.map((row) => {
                // Prepare the row for display
                prepareRow(row)
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()} className="tr">
                    {// Loop over the rows cells
                      row.cells.map(cell => {
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
