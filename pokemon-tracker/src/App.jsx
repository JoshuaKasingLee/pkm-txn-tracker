import { useMemo, useState, useEffect } from 'react'
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

const DEFAULT_SORT = { key: 'none', direction: 'desc' }
const initialFilters = { search: '', status: 'all', source: 'all' }

const isRetail = (buySource) => {
  return buySource.toLowerCase().includes('retail')
}

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

    if (filters.source === 'retail' && !isRetail(trade.buySource)) {
      return false
    }

    if (filters.source === 'non-retail' && isRetail(trade.buySource)) {
      return false
    }

    return true
  })
}

const sortTrades = (trades, sortConfig) => {
  if (sortConfig.key === 'none') {
    return [...trades]
  }

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
    } else if (sortConfig.key === 'sellPrice') {
      aValue = a.sellPrice ?? (sortConfig.direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
      bValue = b.sellPrice ?? (sortConfig.direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
    } else if (sortConfig.key === 'sellDate') {
      aValue = a.sellDate ?? (sortConfig.direction === 'asc' ? '9999-12-31' : '0000-01-01')
      bValue = b.sellDate ?? (sortConfig.direction === 'asc' ? '9999-12-31' : '0000-01-01')
    } else if (sortConfig.key === 'buyPrice') {
      aValue = a.buyPrice
      bValue = b.buyPrice
    } else if (sortConfig.key === 'item') {
      aValue = a.item.toLowerCase()
      bValue = b.item.toLowerCase()
    } else if (sortConfig.key === 'buySource') {
      aValue = a.buySource.toLowerCase()
      bValue = b.buySource.toLowerCase()
    }

    if (aValue < bValue) return -1 * order
    if (aValue > bValue) return 1 * order
    return a.id - b.id
  })
}

function App() {
  const [filters, setFilters] = useState(initialFilters)
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT)
  const [page, setPage] = useState(1)
  const perPage = 20

  const activeTrades = useMemo(
    () => tradesData.filter(isActiveTrade),
    [],
  )

  const visibleTrades = useMemo(
    () => sortTrades(filterTrades(activeTrades, filters), sortConfig),
    [activeTrades, filters, sortConfig],
  )

  useEffect(() => {
    // reset to first page when filters or sort change
    setPage(1)
  }, [filters, sortConfig])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(visibleTrades.length / perPage))
    if (page > totalPages) setPage(totalPages)
  }, [visibleTrades, page])

  const paginatedTrades = useMemo(() => {
    const start = (page - 1) * perPage
    return visibleTrades.slice(start, start + perPage)
  }, [visibleTrades, page])

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
          <h1>Josh's Pokémon Portfolio</h1>
        </div>
      </header>

      <Summary metrics={metrics} />
      <Filters filters={filters} onChange={setFilters} />
      <TradesTable
        trades={paginatedTrades}
        sortConfig={sortConfig}
        onSort={handleSortChange}
        page={page}
        perPage={perPage}
        totalCount={visibleTrades.length}
        onPageChange={setPage}
      />
    </div>
  )
}

export default App
