import type { CommitmentsBlock } from "@/types/document";

interface CommitmentsProps {
  data: CommitmentsBlock;
}

export function Commitments({ data }: CommitmentsProps) {
  return (
    <div className="bg-noir py-8 px-10 my-8 rounded-md">
      <ul className="list-none m-0 p-0">
        {data.items.map((item) => (
          <li
            key={item}
            className="font-sans text-[0.95rem] py-3 border-b border-gris-800 text-gris-300 last:border-b-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
