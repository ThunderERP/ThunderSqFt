import { ReactNode, useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchPlaceholder?: string
  searchKey?: string
  filterOptions?: { label: string; options: string[] }[]
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKey,
  filterOptions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredData = data.filter((item) => {
    if (search && searchKey) {
      const searchValue2 = Object.values(item)
        .map(v => String(v).toLowerCase())
        .join(' ')
      if (!searchValue2.includes(search.toLowerCase())) return false
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== 'All' && !String(value).startsWith('All')) {
        if (String(item[key]).toLowerCase() !== value.toLowerCase()) return false
      }
    }
    return true
  })

  return (
    <div className="bg-paper border border-ink overflow-hidden rounded-none shadow-none">
      {/* Search & Filters Bar */}
      <div className="p-4 border-b border-ink flex items-center gap-4 bg-blueprint-accent/5">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-ink-soft" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-none text-sm focus:outline-none focus:border-blueprint-accent focus:ring-1 focus:ring-blueprint-accent transition-all border border-ink bg-paper text-ink placeholder-ink-soft mono-text"
          />
        </div>
        
        {filterOptions && filterOptions.length > 0 && (
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-ink-soft" />
            {filterOptions.map((filter) => (
              <select
                key={filter.label}
                value={filters[filter.label] || ''}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [filter.label]: e.target.value }))
                }
                className="px-4 py-2 rounded-none border border-ink text-sm text-ink focus:outline-none focus:border-blueprint-accent focus:ring-1 focus:ring-blueprint-accent transition-all bg-paper cursor-pointer font-semibold uppercase tracking-wider"
              >
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-ink bg-ink/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-xs font-bold text-ink uppercase tracking-widest whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/20 bg-paper">
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-blueprint-accent/10 transition-colors group"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-ink mono-text group-hover:text-blueprint-accent transition-colors">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-ink-soft mono-text">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t-2 border-ink text-xs text-ink-soft font-bold uppercase tracking-widest bg-ink/5">
        Showing <span className="mono-text text-ink">{filteredData.length}</span> of <span className="mono-text text-ink">{data.length}</span> records
      </div>
    </div>
  )
}
