"use client";

import { useCallback, useMemo, useState } from "react";
import { supplyNodes } from "@/data/datasets";

const outlineCoordinates = [
  [19.1, 83.0],
  [18.5, 82.2],
  [18.2, 81.3],
  [17.8, 80.8],
  [17.4, 80.3],
  [16.9, 80.0],
  [16.5, 79.6],
  [15.9, 78.9],
  [15.2, 78.2],
  [14.6, 78.0],
  [14.0, 78.3],
  [13.6, 79.4],
  [13.7, 80.1],
  [14.2, 80.5],
  [14.7, 80.8],
  [15.3, 81.8],
  [16.2, 82.4],
  [17.1, 83.0],
  [18.2, 83.2],
  [18.8, 83.1],
];

const nodeColor = {
  "Input Cluster": "var(--brand-secondary)",
  "Processing Hub": "var(--brand-primary)",
  Distribution: "var(--brand-accent)",
} as const;

export function GeoReachMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const bounds = useMemo(() => {
    const allLat = outlineCoordinates.map(([lat]) => lat);
    const allLng = outlineCoordinates.map(([, lng]) => lng);
    return {
      minLat: Math.min(...allLat),
      maxLat: Math.max(...allLat),
      minLng: Math.min(...allLng),
      maxLng: Math.max(...allLng),
    };
  }, []);

  const project = useCallback(
    (lat: number, lng: number, width: number, height: number) => {
      const { minLat, maxLat, minLng, maxLng } = bounds;
      return {
        x: ((lng - minLng) / (maxLng - minLng)) * width,
        y: height - ((lat - minLat) / (maxLat - minLat)) * height,
      };
    },
    [bounds],
  );

  const outlinePath = useMemo(() => {
    return (
      outlineCoordinates
        .map(([lat, lng], index) => {
          const { x, y } = project(lat, lng, 420, 360);
          return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ") + " Z"
    );
  }, [project]);

  const selectedNode = supplyNodes.find((node) => node.district === selectedDistrict);

  return (
    <section className="rounded-3xl border border-border bg-surface px-8 py-10 md:px-12">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Geospatial Market Intelligence</h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground/70">
            Visualise sourcing, processing, and distribution nodes mapped to the AP MSME logistics
            backbone. Exportable SVG overlays feed directly into the DPR annexures.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-white px-4 py-2 text-xs text-foreground/60">
          Data sync: State Data Centre - Ports Authority - ODOP clusters
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="relative flex justify-center">
          <svg
            viewBox="0 0 420 360"
            className="h-[22rem] w-full max-w-2xl rounded-3xl border border-border bg-surface-muted/80 p-4 shadow-sm"
            role="img"
            aria-label="Geospatial view of supply chain nodes in Andhra Pradesh"
          >
            <path
              d={outlinePath}
              fill="rgba(37, 99, 235, 0.08)"
              stroke="rgba(37, 99, 235, 0.35)"
              strokeWidth={2}
            />
            {supplyNodes.map((node) => {
              const { x, y } = project(node.latitude, node.longitude, 420, 360);
              const isSelected = selectedDistrict === node.district;
              return (
                <g key={node.district}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 12 : 9}
                    fill={nodeColor[node.role]}
                    className="cursor-pointer opacity-85 transition hover:opacity-100"
                    onClick={() =>
                      setSelectedDistrict((previous) =>
                        previous === node.district ? null : node.district,
                      )
                    }
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill="white"
                    pointerEvents="none"
                  />
                  <text
                    x={x + 12}
                    y={y - 10}
                    className="fill-foreground/70 text-[10px]"
                    pointerEvents="none"
                  >
                    {node.district}
                  </text>
                </g>
              );
            })}
            <g className="text-[10px] font-medium text-foreground/60">
              <rect x={20} y={280} width={12} height={12} fill={nodeColor["Input Cluster"]} />
              <text x={38} y={290}>
                Input Cluster
              </text>
              <rect x={140} y={280} width={12} height={12} fill={nodeColor["Processing Hub"]} />
              <text x={158} y={290}>
                Processing Hub
              </text>
              <rect x={270} y={280} width={12} height={12} fill={nodeColor.Distribution} />
              <text x={288} y={290}>
                Distribution
              </text>
            </g>
          </svg>
        </div>
        <aside className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Node intelligence
          </h3>
          {selectedNode ? (
            <div className="space-y-3 text-sm text-foreground/75">
              <p className="text-lg font-semibold text-brand-primary">{selectedNode.district}</p>
              <p>
                <strong>Role:</strong> {selectedNode.role}
              </p>
              <p>
                <strong>Throughput index:</strong> {selectedNode.throughput}
              </p>
              <p>
                <strong>Insight:</strong> Geo-fenced IoT data and port clearance records feed the DPR
                with live capacity signals.
              </p>
              <button
                type="button"
                className="rounded-full border border-brand-primary bg-brand-primary/10 px-4 py-2 text-xs font-semibold text-brand-primary transition hover:bg-brand-primary/15"
              >
                Export Node Snapshot
              </button>
            </div>
          ) : (
            <p className="text-sm text-foreground/70">
              Tap a district to view live throughput, logistics partners, and sustainability tags.
              Heat intensity is scaled by a rolling 90-day average awaiting banker validation.
            </p>
          )}
          <div className="rounded-2xl border border-dashed border-brand-secondary/40 p-4 text-xs text-foreground/70">
            <p className="font-semibold text-brand-secondary">ESG overlays</p>
            <p>
              Carbon intensity, renewable energy adoption, and reverse logistics adoption layers are
              toggled via AP Climate Dashboard datasets.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-muted p-4 text-xs text-foreground/65">
            Integrates with drone surveys, ODOP block reports, and field validation kits for
            verifiable evidence trails.
          </div>
        </aside>
      </div>
    </section>
  );
}
