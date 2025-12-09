import type { TracksBlock } from "@/types/document";

interface TracksProps {
  data: TracksBlock;
}

export function Tracks({ data }: TracksProps) {
  return (
    <div className="grid grid-cols-2 gap-4 my-8">
      {data.tracks.map((track, index) => (
        <div key={`${track.title}_${index}`} className="bg-noir py-7 px-7 rounded-md">
          <div className="font-sans text-xs font-bold uppercase tracking-wider text-rouge-vif mb-1">
            {track.label}
          </div>
          <h4 className="text-blanc m-0 mb-1 text-[0.95rem]">{track.title}</h4>
          <div className="font-sans text-xs text-gris-500 mb-4">
            {track.team}
          </div>
          <ul className="text-gris-400 text-[0.9rem] m-0 pl-4">
            {track.items.map((item, i) => (
              <li key={`${track.title}_item_${i}`} className="mb-1.5">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
