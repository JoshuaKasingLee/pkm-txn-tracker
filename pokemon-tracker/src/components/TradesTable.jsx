import { calculateProfit, formatCurrency } from '../utils/calculations'

function TradesTable({ trades, sortConfig, onSort, page = 1, perPage = 10, totalCount = 0, onPageChange = () => {} }) {
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕'
    return sortConfig.direction === 'desc' ? '↓' : '↑'
  }

  return (
    <section className="table-card">
      <div className="table-header">
        <h2>Trades</h2>
        <p>{trades.length} trade{trades.length === 1 ? '' : 's'} displayed</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => onSort('item')}>
                Item name <span>{renderSortIndicator('item')}</span>
              </th>
              <th onClick={() => onSort('buyPrice')}>
                Buy price <span>{renderSortIndicator('buyPrice')}</span>
              </th>
              <th onClick={() => onSort('sellPrice')}>
                Sell price <span>{renderSortIndicator('sellPrice')}</span>
              </th>
              <th onClick={() => onSort('profit')}>
                Profit <span>{renderSortIndicator('profit')}</span>
              </th>
              <th onClick={() => onSort('buyDate')}>
                Buy date <span>{renderSortIndicator('buyDate')}</span>
              </th>
              <th onClick={() => onSort('sellDate')}>
                Sell date <span>{renderSortIndicator('sellDate')}</span>
              </th>
              <th onClick={() => onSort('buySource')}>
                Buy source <span>{renderSortIndicator('buySource')}</span>
              </th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const profit = calculateProfit(trade)
              return (
                <tr key={trade.id}>
                  <td>{trade.item || '—'}</td>
                  <td>{formatCurrency(trade.buyPrice)}</td>
                  <td>{trade.sellPrice !== null ? formatCurrency(trade.sellPrice) : '—'}</td>
                  <td className={`profit ${trade.sellPrice !== null ? (profit >= 0 ? 'positive' : 'negative') : 'unsold'}`}>
                    {trade.sellPrice !== null ? formatCurrency(profit) : '—'}
                  </td>
                  <td>{trade.buyDate || '—'}</td>
                  <td>{trade.sellDate ?? '—'}</td>
                  <td>{trade.buySource || '—'}</td>
                  <td>{trade.notes || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
        <div className="table-pagination">
          <div className="pagination-controls">
            <button
              className="secondary-button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <div className="page-info">
              Page {page} of {Math.max(1, Math.ceil(totalCount / perPage))}
            </div>
            <button
              className="secondary-button"
              onClick={() => onPageChange(Math.min(Math.max(1, Math.ceil(totalCount / perPage)), page + 1))}
              disabled={page >= Math.max(1, Math.ceil(totalCount / perPage))}
            >
              Next
            </button>
          </div>
        </div>
    </section>
  )
}

export default TradesTable
