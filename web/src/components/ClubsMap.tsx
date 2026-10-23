'use client';
import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { GeoJSONSource, Map as MLMap } from 'maplibre-gl';

type Club = { id: number; name: string; city: string; type: string; area: string; lat: number; lng: number; address?: string; demo?: boolean };
const COLOR: Record<string, string> = { ice: '#2f8ae0', roller: '#ff2f8e', both: '#8b5cf6' };

export function ClubsMap({ clubs, labels }: { clubs: Club[]; labels: Record<string, string> }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const [area, setArea] = useState<string>('');
  const [sel, setSel] = useState<Club | null>(null);
  const [ready, setReady] = useState(false);
  const shown = clubs.filter((c) => !area || c.area === area || c.area === 'both');
  useEffect(() => {
    let off = false;
    (async () => {
      const ml = await import('maplibre-gl');
      if (off || !el.current) return;
      const m = new ml.Map({ container: el.current, style: 'https://tiles.openfreemap.org/styles/positron', center: [106.3, 16.0], zoom: 4.6, attributionControl: { compact: true } });
      m.addControl(new ml.NavigationControl({ showCompass: false }), 'top-right');
      map.current = m;
      m.on('load', () => {
        m.addSource('clubs', { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, cluster: true, clusterRadius: 40 });
        m.addLayer({ id: 'cl', type: 'circle', source: 'clubs', filter: ['has', 'point_count'], paint: { 'circle-color': '#071328', 'circle-radius': ['step', ['get', 'point_count'], 16, 5, 22, 10, 28], 'circle-stroke-width': 4, 'circle-stroke-color': 'rgba(106,174,230,.45)' } });
        m.addLayer({ id: 'cl-n', type: 'symbol', source: 'clubs', filter: ['has', 'point_count'], layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12, 'text-font': ['Noto Sans Bold'] }, paint: { 'text-color': '#fff' } });
        m.addLayer({ id: 'pt', type: 'circle', source: 'clubs', filter: ['!', ['has', 'point_count']], paint: { 'circle-color': ['get', 'color'], 'circle-radius': 8, 'circle-stroke-width': 3, 'circle-stroke-color': '#fff' } });
        m.on('click', 'pt', (e) => { const f = e.features?.[0]; if (f) setSel(JSON.parse(f.properties.json as string)); });
        m.on('click', 'cl', (e) => { const f = e.features?.[0]; if (f && f.geometry.type === 'Point') m.easeTo({ center: f.geometry.coordinates as [number, number], zoom: m.getZoom() + 2 }); });
        for (const l of ['pt', 'cl']) { m.on('mouseenter', l, () => (m.getCanvas().style.cursor = 'pointer')); m.on('mouseleave', l, () => (m.getCanvas().style.cursor = '')); }
        setReady(true);
      });
    })();
    return () => { off = true; map.current?.remove(); };
  }, []);
  useEffect(() => {
    const m = map.current; if (!m) return;
    const apply = () => { const src = m.getSource('clubs') as GeoJSONSource | undefined; src?.setData({ type: 'FeatureCollection', features: shown.map((c) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [c.lng, c.lat] }, properties: { color: COLOR[c.area] ?? '#2f8ae0', json: JSON.stringify(c) } })) }); };
    if (ready) apply();
  });
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-navy-900/10">
        <div ref={el} className="h-[65vh] min-h-[420px] w-full bg-slate-100" />
        <div className="frost absolute left-3 top-3 flex gap-1 rounded-full p-1 text-xs font-semibold">
          {[['', labels.all], ['ice', labels.ice], ['roller', labels.roller]].map(([v, l]) => <button key={v} onClick={() => setArea(v)} className={`rounded-full px-3 py-1.5 ${area === v ? 'bg-navy-900 text-white' : ''}`}>{l}</button>)}
        </div>
      </div>
      <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
        {sel && <div className="rounded-3xl bg-navy-950 p-5 text-white"><p className="text-xs uppercase tracking-widest text-gold">{labels[sel.type]}</p><p className="font-display mt-1 text-lg font-semibold">{sel.name}</p><p className="mt-1 text-sm text-white/60">{sel.address}</p>{sel.demo && <span className="tag mt-3 bg-amber-300 text-amber-950">Demo</span>}</div>}
        {shown.map((c) => (
          <button key={c.id} onClick={() => { setSel(c); map.current?.flyTo({ center: [c.lng, c.lat], zoom: 12 }); }} className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left text-sm ring-1 ring-navy-900/5 hover:ring-brand">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLOR[c.area] }} />
            <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{c.name}</span><span className="block text-xs text-navy-800/50">{labels[c.type]} · {c.city}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
