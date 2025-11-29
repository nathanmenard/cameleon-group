import { ZonesGridBlock } from "@/types/document";

interface ZonesGridProps {
  data: ZonesGridBlock;
}

export function ZonesGrid({ data }: ZonesGridProps) {
  return (
    <div className="zones-grid">
      {data.zones.map((zone, index) => (
        <div key={index} className={`zone ${zone.variant}-zone`}>
          <div className="zone-label">{zone.title}</div>
          <div className="zone-desc">{zone.description}</div>
          <div className="zone-ex">{zone.example}</div>
        </div>
      ))}
    </div>
  );
}
