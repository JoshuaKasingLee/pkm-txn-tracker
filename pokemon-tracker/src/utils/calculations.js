export const calculateProfit = (trade) => (trade.sellPrice ?? 0) - trade.buyPrice

export const totalProfit = (trades) => trades.reduce((sum, trade) => sum + calculateProfit(trade), 0)

export const totalSpent = (trades) => trades.reduce((sum, trade) => sum + trade.buyPrice, 0)

export const totalSold = (trades) => trades.reduce((sum, trade) => sum + (trade.sellPrice ?? 0), 0)

export const netCashFlow = (trades) => totalSold(trades) - totalSpent(trades)

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
