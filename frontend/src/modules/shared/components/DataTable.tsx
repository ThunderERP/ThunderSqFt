import { ReactNode, useState } from 'react'
import { Search, Filter, ChevronUp, ChevronDown } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T, value: any) => ReactNode
  align?: 'left' | 'right' | 'center'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchPlaceholder?: string
  searchKey?: string
  filterOptions?: { label: string; options: string[] }[]
  onRowClick?: (item: T) => void
}

const isNumericValue = (val: any): boolean => {
  if (typeof val === 'number') return true
  if (typeof val === 'string') {
    const cleaned = val.trim()
    if (cleaned.startsWith('₹') || cleaned.startsWith('$') || cleaned.endsWith('%')) return true
    return !isNaN(Number(cleaned.replace(/,/g, '')))
  }
  return false
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKey,
  filterOptions,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const filteredData = data.filter((item) => {
    if (search) {
      const keysToSearch = searchKey ? [searchKey] : Object.keys(item)
      const isMatch = keysToSearch.some((key) => {
        const val = item[key]
        return val !== undefined && String(val).toLowerCase().includes(search.toLowerCase())
      })
      if (!isMatch) return false
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== 'All' && !String(value).startsWith('All')) {
        if (String(item[key]).toLowerCase() !== value.toLowerCase()) return false
      }
    }
    return true
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0
    const valA = a[sortKey]
    const valB = b[sortKey]

    const parseVal = (v: any) => {
      if (typeof v === 'number') return v
      if (typeof v === 'string') {
        const cleaned = parseFloat(v.replace(/[^0-9.-]/g, ''))
        return isNaN(cleaned) ? v.toLowerCase() : cleaned
      }
      return v
    }

    const cleanA = parseVal(valA)
    const cleanB = parseVal(valB)

    if (cleanA < cleanB) return sortOrder === 'asc' ? -1 : 1
    if (cleanA > cleanB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden rounded-lg shadow-card">
      {/* Search & Filters Bar */}
      <div className="p-4 border-b border-[var(--border-color)] flex flex-wrap items-center gap-4 bg-[var(--bg-surface)]/50">
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ink-muted)]">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md text-xs focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--ink)] placeholder-[var(--ink-muted)]"
          />
        </div>
        
        {filterOptions && filterOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={14} className="text-[var(--ink-soft)]" />
            {filterOptions.map((filter) => (
              <select
                key={filter.label}
                value={filters[filter.label] || ''}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [filter.label]: e.target.value }))
                }
                className="px-3 py-2 rounded-md border border-[var(--border-color)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all bg-[var(--bg-surface)] cursor-pointer font-semibold uppercase tracking-wider"
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
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface)]/30">
              {columns.map((col) => {
                const sampleVal = data.length > 0 ? data[0][col.key] : null
                const alignRight = col.align === 'right' || (col.align === undefined && isNumericValue(sampleVal))
                
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:text-[var(--ink)] transition-colors ${
                      alignRight ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${alignRight ? 'flex-row-reverse w-full' : ''}`}>
                      <span>{col.label}</span>
                      <span className="text-[var(--ink-muted)]">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : (
                          <ChevronDown size={12} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] bg-transparent">
            {sortedData.length > 0 ? (
              sortedData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-[var(--bg-hover)]/40 transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => {
                    const value = item[col.key]
                    const sampleVal = data.length > 0 ? data[0][col.key] : null
                    const alignRight = col.align === 'right' || (col.align === undefined && isNumericValue(sampleVal))
                    const isMonospace = isNumericValue(value) || col.key === 'id' || col.key.includes('Id')

                    return (
                      <td 
                        key={col.key} 
                        className={`px-6 py-3.5 text-xs text-[var(--ink-soft)] transition-colors group-hover:text-[var(--ink)] ${
                          alignRight ? 'text-right' : 'text-left'
                        } ${
                          isMonospace ? 'font-mono' : 'font-sans'
                        }`}
                      >
                        {col.render ? col.render(item, value) : value}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-[var(--ink-muted)] font-mono text-xs">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-[var(--border-color)] text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider bg-[var(--bg-surface)]/10">
        Showing <span className="font-mono text-[var(--ink-soft)]">{sortedData.length}</span> of <span className="font-mono text-[var(--ink-soft)]">{data.length}</span> records
      </div>
    </div>
  )
}
