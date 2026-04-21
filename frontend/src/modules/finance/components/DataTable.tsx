import { ReactNode, useState } from 'react'
import { Search } from 'lucide-react'

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
      const searchValue = String(item[searchKey] || '').toLowerCase()
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
    <div className="neu-card overflow-hidden">
      {/* Search & Filters Bar */}
      <div className="p-5 border-b border-gray-50/50 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-inset text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        {filterOptions?.map((filter) => (
          <select
            key={filter.label}
            value={filters[filter.label] || ''}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [filter.label]: e.target.value }))
            }
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white cursor-pointer"
          >
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
        Showing {filteredData.length} of {data.length} results
      </div>
    </div>
  )
}
