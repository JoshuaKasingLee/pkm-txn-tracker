import { calculateProfit, formatCurrency } from '../utils/calculations'

function TradesTable({ trades, sortConfig, onSort }) {
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
              <th>Buy price</th>
              <th onClick={() => onSort('sellDate')}>
                Sell price / date <span>{renderSortIndicator('sellDate')}</span>
              </th>
              <th onClick={() => onSort('profit')}>
                Profit <span>{renderSortIndicator('profit')}</span>
              </th>
              <th onClick={() => onSort('buyDate')}>
                Buy date <span>{renderSortIndicator('buyDate')}</span>
              </th>
              <th>Sell date</th>
              <th>Buy source</th>
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
                  <td className={`profit ${profit >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(profit)}
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
    </section>
  )
}

export default TradesTable
