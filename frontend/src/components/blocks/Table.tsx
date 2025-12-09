import type { TableBlock } from "@/types/document";

interface TableProps {
  data: TableBlock;
}

export function Table({ data }: TableProps) {
  return (
    <div className="my-6 overflow-x-auto relative">
      <table className="w-full border-collapse font-sans text-[0.85rem]">
        <thead>
          <tr>
            {data.headers.map((header) => (
              <th
                key={header}
                className="text-left py-3.5 px-4 bg-gris-100 font-semibold text-[0.75rem] uppercase tracking-wide text-gris-600 border-b-2 border-gris-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => {
            const rowKey = typeof row[0] === "string" ? row[0] : row[0]?.text || "row";
            return (
              <tr key={rowKey}>
                {row.map((cell, cellIndex) => {
                  const cellKey = `${rowKey}_${data.headers[cellIndex]}`;
                  return (
                    <td
                      key={cellKey}
                      className="py-4 px-4 border-b border-gris-200 text-gris-700 align-top last:border-b-0"
                    >
                      {typeof cell === "string" ? (
                        cell
                      ) : (
                        <>
                          {cell.text}
                          {cell.tag === "critical" && (
                            <span className="font-sans text-xs font-bold uppercase tracking-wide text-blanc bg-rouge-sombre py-1 px-2 rounded ml-2">
                              Critique
                            </span>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
