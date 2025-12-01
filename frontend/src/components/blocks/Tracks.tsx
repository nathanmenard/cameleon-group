import type { TracksBlock } from "@/types/document";

interface TracksProps {
  data: TracksBlock;
}

export function Tracks({ data }: TracksProps) {
  return (
    <div className="tracks">
      {data.tracks.map((track, index) => (
        <div key={index} className="track">
          <div className="track-label">{track.label}</div>
          <h4>{track.title}</h4>
          <div className="track-team">{track.team}</div>
          <ul>
            {track.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
