import type { TableBlock } from "@/types/document";

interface TableProps {
  data: TableBlock;
}

export function Table({ data }: TableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {typeof cell === "string" ? (
                    cell
                  ) : (
                    <>
                      {cell.text}
                      {cell.tag === "critical" && (
                        <span className="tag-critical">Critique</span>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
