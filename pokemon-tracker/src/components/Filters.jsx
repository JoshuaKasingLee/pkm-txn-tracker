function Filters({ filters, onChange, sortKey, onSortChange }) {
  return (
    <section className="filters-panel" aria-label="Filter trades">
      <div className="filters-row">
        <label className="filter-field">
          <span>Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Search item name"
          />
        </label>
        <label className="filter-field">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value })}
          >
            <option value="all">All trades</option>
            <option value="sold">Sold only</option>
            <option value="unsold">Unsold only</option>
          </select>
        </label>
        <label className="filter-field">
          <span>Source</span>
          <select
            value={filters.source}
            onChange={(event) => onChange({ ...filters, source: event.target.value })}
          >
            <option value="all">All sources</option>
            <option value="retail">Retail only</option>
            <option value="non-retail">Non-retail only</option>
          </select>
        </label>
        <label className="filter-field">
          <span>Sort by</span>
          <select value={sortKey} onChange={(event) => onSortChange(event.target.value)}>
            <option value="none">None</option>
            <option value="profit">Profit</option>
            <option value="buyDate">Buy date</option>
            <option value="sellDate">Sell date</option>
            <option value="item">Item name</option>
            <option value="buySource">Buy source</option>
          </select>
        </label>
      </div>
    </section>
  )
}

export default Filters
