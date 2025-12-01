import type { OptionsBlock } from "@/types/document";

interface OptionsProps {
  data: OptionsBlock;
}

export function Options({ data }: OptionsProps) {
  return (
    <>
      {data.items.map((option, index) => (
        <div key={index} className={`option ${option.recommended ? "reco" : ""}`}>
          <div className="option-letter">{option.letter}</div>
          <div className="option-content">
            <h4>{option.title}</h4>
            <p>{option.description}</p>
          </div>
          <div className={`option-verdict verdict-${option.verdict}`}>
            {option.verdictText}
          </div>
        </div>
      ))}
    </>
  );
}
