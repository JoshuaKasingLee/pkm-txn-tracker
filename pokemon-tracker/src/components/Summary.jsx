import { formatCurrency } from '../utils/calculations'

function Summary({ metrics }) {
  const cards = [
    {
      label: 'Total Profit',
      value: metrics.totalProfit,
      status: metrics.totalProfit >= 0 ? 'positive' : 'negative',
    },
    {
      label: 'Portfolio Size',
      value: metrics.netCashFlow,
    },
  ]

  return (
    <section className="summary-grid" aria-label="Dashboard summary">
      {cards.map((card) => (
        <article key={card.label} className="summary-card">
          <p className="summary-label">{card.label}</p>
          <p className={`summary-value ${card.status || ''}`}>
            {formatCurrency(card.value)}
          </p>
        </article>
      ))}
    </section>
  )
}

export default Summary
