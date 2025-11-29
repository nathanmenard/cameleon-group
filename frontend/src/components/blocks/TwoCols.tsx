import { TwoColsBlock } from "@/types/document";

interface TwoColsProps {
  data: TwoColsBlock;
}

export function TwoCols({ data }: TwoColsProps) {
  return (
    <div className="two-cols">
      {data.columns.map((col, index) => (
        <div key={index} className={`col-card ${col.dark ? "dark" : ""}`}>
          <h4>{col.title}</h4>
          <ul>
            {col.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
