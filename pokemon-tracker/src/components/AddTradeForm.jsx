import { useState } from 'react'

const initialForm = {
  item: '',
  buyPrice: '',
  sellPrice: '',
  buyDate: '',
  sellDate: '',
  buySource: '',
  notes: '',
}

function AddTradeForm({ onAdd }) {
  const [form, setForm] = useState(initialForm)

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onAdd({
      item: form.item.trim(),
      buyPrice: Number(form.buyPrice) || 0,
      sellPrice: form.sellPrice === '' ? null : Number(form.sellPrice),
      buyDate: form.buyDate,
      sellDate: form.sellDate || null,
      buySource: form.buySource.trim(),
      notes: form.notes.trim(),
    })
    setForm(initialForm)
  }

  return (
    <section className="add-form">
      <div className="table-header">
        <h2>Add new item</h2>
        <p>Enter a new trade row and the app will generate the next ID.</p>
      </div>
      <form className="add-form-grid" onSubmit={handleSubmit}>
        <label>
          Item
          <input
            type="text"
            value={form.item}
            onChange={handleChange('item')}
            placeholder="Item name"
          />
        </label>
        <label>
          Buy price
          <input
            type="number"
            value={form.buyPrice}
            onChange={handleChange('buyPrice')}
            placeholder="0"
            min="0"
          />
        </label>
        <label>
          Sell price
          <input
            type="number"
            value={form.sellPrice}
            onChange={handleChange('sellPrice')}
            placeholder="Leave empty if unsold"
            min="0"
          />
        </label>
        <label>
          Buy date
          <input
            type="date"
            value={form.buyDate}
            onChange={handleChange('buyDate')}
          />
        </label>
        <label>
          Sell date
          <input
            type="date"
            value={form.sellDate}
            onChange={handleChange('sellDate')}
          />
        </label>
        <label>
          Source
          <input
            type="text"
            value={form.buySource}
            onChange={handleChange('buySource')}
            placeholder="Where you bought it"
          />
        </label>
        <label className="notes-field">
          Notes
          <textarea
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Optional notes"
          />
        </label>
        <button type="submit" className="primary-button">
          Add item
        </button>
      </form>
    </section>
  )
}

export default AddTradeForm
