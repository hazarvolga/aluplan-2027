// Pages whose consecutive media grids are one topic: they get a single section header and numbered group labels.
// The titles are the only text added here; the grid titles and subtitles stay as in src/data.
type GridGroup = { title: string; unit: string };

const GRID_GROUPS: Record<string, GridGroup> = {
  '/products/allplan-bimplus': { title: 'Bimplus uygulama videoları', unit: 'video' },
};

export function gridGroupFor(path: string | undefined): GridGroup | undefined {
  return path ? GRID_GROUPS[path] : undefined;
}
