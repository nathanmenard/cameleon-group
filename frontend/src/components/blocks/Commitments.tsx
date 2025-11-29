import { CommitmentsBlock } from "@/types/document";

interface CommitmentsProps {
  data: CommitmentsBlock;
}

export function Commitments({ data }: CommitmentsProps) {
  return (
    <div className="commitments">
      <ul>
        {data.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
