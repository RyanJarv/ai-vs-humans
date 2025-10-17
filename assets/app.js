// Minimal client for loading and rendering the estimate

const fmt = new Intl.NumberFormat('en-US');
const pctFmt = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });

function byId(id) { return document.getElementById(id); }

function setText(id, text) { const el = byId(id); if (el) el.textContent = text; }

function animateCount(el, target, formatter = fmt, duration = 900) {
  const start = 0;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / duration);
    const eased = easeOutCubic(p);
    const val = Math.floor(start + (target - start) * eased);
    el.textContent = formatter(val);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
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
      ai_lines: 6200000000,
      human_lines: 17900000000,
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

  setStatNumber(aiLinesEl, ai);
  setStatNumber(humanLinesEl, human);
  setStatNumber(totalLinesEl, total);
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

function formatStat(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    const base = value / 1_000_000_000;
    return `${toFixedSmart(base)}B`;
  }
  if (abs >= 1_000_000) {
    const base = value / 1_000_000;
    return `${toFixedSmart(base)}M`;
  }
  if (abs >= 1_000) {
    const base = value / 1_000;
    return `${toFixedSmart(base)}K`;
  }
  return fmt.format(value);
}

function setStatNumber(el, value) {
  if (!el) return;
  const formatter = (n) => formatStat(n);
  animateCount(el, value, formatter);
  el.setAttribute('title', fmt.format(value));
  el.dataset.fullValue = String(value);
}

function toFixedSmart(num) {
  const fixed = num >= 10 ? num.toFixed(0) : num.toFixed(1);
  return fixed.replace(/\.0$/, '');
}

loadEstimate();
