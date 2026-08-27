import type { ReactNode } from 'react'

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export default function Table<T>({
  columns,
  data,
  getRowKey,
}: {
  columns: TableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string | number
}) {
  return (
    <div className="bg-surface rounded-radius-lg border border-border overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-border/30">
            {columns.map((col) => (
              <th key={col.key} className="h-12 px-4 text-xs font-bold uppercase text-text-secondary">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              className="min-h-16 border-b border-border last:border-b-0 hover:bg-secondary/5 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}