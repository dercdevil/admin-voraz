import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTable, useSortBy, useFilters, usePagination} from 'react-table'
import { matchSorter}  from 'match-sorter'
import { Button } from 'react-bootstrap'

const Styles = styled.div`
  padding: 1rem;

  .button-pagination{
    margin-right: 10px;
  }

  .inputPage{
    display: inline-block;
    width: 150px;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .inputPageFilter{
    display: inline-block;
    width: 80%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .pagination {
    padding: 0.5rem;
    display: flex;
    justify-content: center;
  }

  .table_responsive_eddit{
    overflow-x: auto;
  }
`

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
      placeholder={`Buscar en ${count} registros...`}
      className="inputPageFilter"
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

function DataTable({ columns, data, menuTop, headerColor, headerFontColor }) {
  // Use the state and functions returned from useTable to build your UI

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  )

  // Render the UI for your table

  return (
    <div className="table-responsive">
      {menuTop ? (
        <div className="pagination">
          <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </Button>{' '}
          <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </Button>{' '}
          <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </Button>{' '}
          <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </Button>{' '}
          <span>
            Página{' '}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>{' '}
          </span>
          <span className="ml-3">
            | <span className="ml-2">Ir a la Página:{' '}</span>
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              className="inputPage"
              onChange={(e) => {
                if(e.target.value > pageOptions.length){
                  e.target.value = 1
                }
              }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
            className="inputPage"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>

      ) : ''}
      <table {...getTableProps()} className="table table-bordered">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-center">
              {headerGroup.headers.map(column => (

                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ backgroundColor: headerColor ? headerColor : "rgb(218, 236, 242)", color: headerFontColor ? headerFontColor : "black" }}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="text-center">
          {page.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
      <div className="pagination">
        <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Button>{' '}
        <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Button>{' '}
        <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>{' '}
        <Button size="sm" style={{height:'40px'}} className="button-pagination" variant="secondary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </Button>{' '}
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
        <span className="ml-3">
          | <span className="ml-2">Ir a la Página:{' '}</span>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            className="inputPage"
            onChange={(e) => {
              if(e.target.value > pageOptions.length){
                e.target.value = 1
              }
            }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
          className="inputPage"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>

  )
}

const Table = ({data,columns,menuTop,headerColor,headerFontColor}) => {

  return (
    <Styles>
      <DataTable data={data} columns={columns} menuTop={menuTop} headerFontColor={headerFontColor} headerColor={headerColor}  />
    </Styles>
  )
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns : PropTypes.array.isRequired,
  menuTop: PropTypes.bool,
  headerColor: PropTypes.string,
  headerFontColor: PropTypes.string,
}

export default Table
