import type { WhyBlockData } from "@/types/document";

interface WhyBlockProps {
  data: WhyBlockData;
}

export function WhyBlock({ data }: WhyBlockProps) {
  return (
    <div className="why-block">
      <div className="why-header">
        <span className="why-num">#{data.num}</span>
        <h4 className="why-title">{data.title}</h4>
      </div>
      <div className="why-content">
        <div className="symptom">
          <span className="symptom-text">{data.symptom}</span>
        </div>
        <div className="cause-chain">
          {data.causes.map((cause, index) => (
            <div key={index} className={cause.indent > 0 ? `indent-${cause.indent}` : ""}>
              {cause.text}
            </div>
          ))}
        </div>
        <div className="root-cause">{data.rootCause}</div>
      </div>
    </div>
  );
}
