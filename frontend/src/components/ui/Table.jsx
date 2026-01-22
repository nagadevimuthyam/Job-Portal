export default function Table({ columns, data }) {
  const rows = Array.isArray(data) ? data : data?.results || [];
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-3 bg-surface-inverse shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-surface-2 text-ink-soft">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="border-t border-surface-2 bg-surface-inverse">
              <td className="px-4 py-6 text-center text-sm text-ink-faint" colSpan={columns.length}>
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={`border-t border-surface-2 ${idx % 2 === 0 ? "bg-surface-inverse" : "bg-surface-2/40"}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-ink">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
