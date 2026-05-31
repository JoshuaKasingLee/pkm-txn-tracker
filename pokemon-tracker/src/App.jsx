import { useMemo, useState } from 'react'
import './App.css'
import tradesData from './data/trades.json'
import {
  calculateProfit,
  netCashFlow,
  totalProfit,
  totalSold,
  totalSpent,
} from './utils/calculations.js'
import Filters from './components/Filters.jsx'
import Summary from './components/Summary.jsx'
import TradesTable from './components/TradesTable.jsx'

const DEFAULT_SORT = { key: 'profit', direction: 'desc' }
const initialFilters = { search: '', status: 'all', profit: 'all' }

const isActiveTrade = (trade) =>
  Boolean(
    trade.item.trim() ||
      trade.buyDate ||
      trade.buySource ||
      trade.notes ||
      trade.buyPrice !== 0 ||
      trade.sellPrice !== null,
  )

const filterTrades = (trades, filters) => {
  const query = filters.search.trim().toLowerCase()
  return trades.filter((trade) => {
    if (!isActiveTrade(trade)) {
      return false
    }

    if (query && !trade.item.toLowerCase().includes(query)) {
      return false
    }

    if (filters.status === 'sold' && trade.sellPrice === null) {
      return false
    }

    if (filters.status === 'unsold' && trade.sellPrice !== null) {
      return false
    }

    const profit = calculateProfit(trade)
    if (filters.profit === 'profitable' && profit <= 0) {
      return false
    }

    if (filters.profit === 'loss' && profit >= 0) {
      return false
    }

    return true
  })
}

const sortTrades = (trades, sortConfig) => {
  const sorted = [...trades]
  const order = sortConfig.direction === 'asc' ? 1 : -1

  return sorted.sort((a, b) => {
    let aValue = ''
    let bValue = ''

    if (sortConfig.key === 'profit') {
      aValue = calculateProfit(a)
      bValue = calculateProfit(b)
    } else if (sortConfig.key === 'buyDate') {
      aValue = a.buyDate
      bValue = b.buyDate
    } else if (sortConfig.key === 'sellDate') {
      aValue = a.sellDate ?? (sortConfig.direction === 'asc' ? '9999-12-31' : '0000-01-01')
      bValue = b.sellDate ?? (sortConfig.direction === 'asc' ? '9999-12-31' : '0000-01-01')
    } else if (sortConfig.key === 'item') {
      aValue = a.item.toLowerCase()
      bValue = b.item.toLowerCase()
    }

    if (aValue < bValue) return -1 * order
    if (aValue > bValue) return 1 * order
    return a.id - b.id
  })
}

function App() {
  const [filters, setFilters] = useState(initialFilters)
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT)

  const activeTrades = useMemo(
    () => tradesData.filter(isActiveTrade),
    [],
  )

  const visibleTrades = useMemo(
    () => sortTrades(filterTrades(activeTrades, filters), sortConfig),
    [activeTrades, filters, sortConfig],
  )

  const metrics = useMemo(
    () => ({
      totalProfit: totalProfit(visibleTrades),
      totalSpent: totalSpent(visibleTrades),
      totalSold: totalSold(visibleTrades),
      netCashFlow: netCashFlow(visibleTrades),
    }),
    [visibleTrades],
  )

  const handleSortChange = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'desc' ? 'asc' : 'desc',
        }
      }

      return {
        key,
        direction: key === 'profit' ? 'desc' : 'asc',
      }
    })
  }

  return (
    <div className="app-shell">
      <header className="app-top">
        <div>
          <p className="eyebrow">Pokémon Trade Tracker</p>
          <h1>Track buy & sell performance</h1>
          <p className="hero-copy">
            A lightweight static dashboard for monitoring item spends, sales,
            and profit at a glance. Edit your trades manually in
            <code>src/data/trades.json</code>.
          </p>
        </div>
      </header>

      <Summary metrics={metrics} />
      <Filters
        filters={filters}
        onChange={setFilters}
        sortKey={sortConfig.key}
        onSortChange={handleSortChange}
      />
      <TradesTable trades={visibleTrades} sortConfig={sortConfig} onSort={handleSortChange} />
    </div>
  )
}

export default App
