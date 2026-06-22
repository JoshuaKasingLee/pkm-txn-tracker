import { useMemo, useState } from 'react'
import './App.css'
import tradesData from './data/trades.json'
import {
  calculateProfit,
  netCashFlow,
  totalProfit,
} from './utils/calculations.js'
import Filters from './components/Filters.jsx'
import Summary from './components/Summary.jsx'
import TradesTable from './components/TradesTable.jsx'

const DEFAULT_SORT = { key: 'none', direction: 'desc' }
const initialFilters = { search: '', status: 'all', source: 'all' }

const toFullYear = (year) => (year < 100 ? 2000 + year : year)

const toDateTimestamp = (year, month, day) => {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const timestamp = Date.UTC(year, month - 1, day)
  const parsed = new Date(timestamp)
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null
  }

  return timestamp
}

const parseTradeDate = (date) => {
  if (!date) return null

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number)
    return toDateTimestamp(year, month, day)
  }

  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(date)) {
    const [day, month, year] = date.split('/').map(Number)
    return toDateTimestamp(toFullYear(year), month, day)
  }

  return null
}

const getDateSortValue = (date, direction) => {
  const parsedDate = parseTradeDate(date)
  if (parsedDate !== null) return parsedDate

  return direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
}

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
      aValue = getDateSortValue(a.buyDate, sortConfig.direction)
      bValue = getDateSortValue(b.buyDate, sortConfig.direction)
    } else if (sortConfig.key === 'sellPrice') {
      aValue = a.sellPrice ?? (sortConfig.direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
      bValue = b.sellPrice ?? (sortConfig.direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
    } else if (sortConfig.key === 'sellDate') {
      aValue = getDateSortValue(a.sellDate, sortConfig.direction)
      bValue = getDateSortValue(b.sellDate, sortConfig.direction)
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

  const totalPages = Math.max(1, Math.ceil(visibleTrades.length / perPage))
  const currentPage = Math.min(page, totalPages)

  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * perPage
    return visibleTrades.slice(start, start + perPage)
  }, [visibleTrades, currentPage])

  const metrics = useMemo(
    () => ({
      totalProfit: totalProfit(visibleTrades),
      netCashFlow: netCashFlow(visibleTrades),
    }),
    [visibleTrades],
  )

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }

  const handleSortChange = (key) => {
    setPage(1)
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

  const handlePageChange = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages))
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
      <Filters filters={filters} onChange={handleFiltersChange} />
      <TradesTable
        trades={paginatedTrades}
        sortConfig={sortConfig}
        onSort={handleSortChange}
        page={currentPage}
        perPage={perPage}
        totalCount={visibleTrades.length}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default App
