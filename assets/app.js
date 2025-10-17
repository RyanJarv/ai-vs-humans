// Minimal client for loading and rendering the estimate

const fmt = new Intl.NumberFormat('en-US');
const pctFmt = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });

function byId(id) { return document.getElementById(id); }

function setText(id, text) { const el = byId(id); if (el) el.textContent = text; }

function animateCount(el, target, duration = 900) {
  const start = 0;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / duration);
    const val = Math.floor(start + (target - start) * p);
    el.textContent = fmt.format(val);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function setRing(percent) {
  const circle = document.getElementById('ringFg');
  if (!circle) return;
  const r = 54;
  const circ = 2 * Math.PI * r; // ~339.292
  const dash = circ * Math.max(0, Math.min(1, percent));
  circle.style.strokeDasharray = `${circ}`;
  circle.style.strokeDashoffset = `${circ - dash}`;
}

async function loadEstimate() {
  // Fetch estimate JSON; append cache-buster to avoid stale CDN
  const url = `/data/estimate.json?v=${Date.now().toString().slice(0,10)}`;
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    render(data);
  } catch (err) {
    console.error('Failed to load estimate.json', err);
    // Fallback placeholder
    const fallback = {
      updated_at: new Date().toISOString(),
      scope: 'Placeholder estimate',
      ai_lines: 11200000000,
      human_lines: 23900000000,
      notes: 'Fallback data bundled in app.js. Replace with real data in data/estimate.json.'
    };
    render(fallback);
  }
}

function render(data) {
  const ai = Number(data.ai_lines || 0);
  const human = Number(data.human_lines || 0);
  const total = ai + human;
  const aiPct = total > 0 ? ai / total : 0;

  const aiLinesEl = byId('aiLines');
  const humanLinesEl = byId('humanLines');
  const totalLinesEl = byId('totalLines');
  const aiPctEl = byId('aiPct');

  if (aiLinesEl) animateCount(aiLinesEl, ai);
  if (humanLinesEl) animateCount(humanLinesEl, human);
  if (totalLinesEl) animateCount(totalLinesEl, total);
  if (aiPctEl) aiPctEl.textContent = pctFmt.format(aiPct);
  setRing(aiPct);

  const updatedAt = data.updated_at ? new Date(data.updated_at) : null;
  const updatedLabel = updatedAt ? `Updated ${updatedAt.toLocaleString()}` : 'Updated —';
  setText('updatedAt', updatedLabel);

  const notes = [];
  if (data.scope) notes.push(`<strong>Scope:</strong> ${escapeHtml(data.scope)}`);
  if (data.notes) notes.push(`<strong>Notes:</strong> ${escapeHtml(data.notes)}`);
  const notesEl = byId('notes');
  if (notesEl) notesEl.innerHTML = notes.join('<br />');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

loadEstimate();
