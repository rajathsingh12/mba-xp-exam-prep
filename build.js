#!/usr/bin/env node
/**
 * Build a single-page documentation site from all module plain-english .md files.
 * Usage: node build.js
 * Output: index.html in the same directory.
 * Discovers module-N/ folders automatically.
 */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const DIR = __dirname;

// Module titles (fallback to directory name if not listed)
const MODULE_TITLES = {
  1: 'Foundations & Business Value of Big Data',
  2: 'Data Architecture & Value Chain',
  3: 'Distributed Storage & Processing',
  4: 'Pipelines, Streaming & Cloud',
  5: 'ML Integration, Governance & Ethics',
};

// Discover module directories
const moduleDirs = fs.readdirSync(DIR)
  .filter(d => /^module-\d+$/.test(d) && fs.statSync(path.join(DIR, d)).isDirectory())
  .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

console.log(`Found ${moduleDirs.length} module(s): ${moduleDirs.join(', ')}`);

marked.setOptions({ gfm: true, breaks: false });

// Build data structure
const modules = moduleDirs.map(dir => {
  const num = parseInt(dir.split('-')[1]);
  const title = MODULE_TITLES[num] || `Module ${num}`;

  // Read .md files: sessions sorted alphabetically, exam-questions last
  const mdFiles = fs.readdirSync(path.join(DIR, dir))
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      if (a.toLowerCase().includes('exam-questions')) return 1;
      if (b.toLowerCase().includes('exam-questions')) return -1;
      return a.localeCompare(b);
    });

  const files = mdFiles.map(f => {
    const md = fs.readFileSync(path.join(DIR, dir, f), 'utf8');
    const html = marked.parse(md);
    // Derive label from first H1, or from filename
    const h1Match = md.match(/^#\s+(.+)/m);
    let label = h1Match ? h1Match[1].replace(/\s*—.*$/, '').trim() : f.replace('.md', '');
    // Clean up label
    label = label.replace(/-/g, ' ').replace(/plain english$/i, '').trim();
    // If it's an exam file, override the label
    if (f.toLowerCase().includes('exam-questions') || f.toLowerCase().includes('exam_questions')) label = `Exam Questions for Module ${num}`;
    if (label.length > 65) label = label.substring(0, 62) + '...';
    return { filename: f, label, html };
  });

  return { num, dir, title, files };
});

// Build TOC
const tocHtml = modules.map(m => {
  const items = m.files.map((f, fi) => {
    const id = `m${m.num}-f${fi}`;
    return `          <li><a href="#${id}" class="nav-file">${f.label}</a></li>`;
  }).join('\n');
  return `
      <li class="nav-module">
        <button class="module-toggle" data-module="m${m.num}" aria-expanded="${m.num === modules[0]?.num ? 'true' : 'false'}">
          <span class="toggle-icon">${m.num === modules[0]?.num ? '▼' : '▶'}</span>
          Module ${m.num}
        </button>
        <span class="module-subtitle">${m.title}</span>
        <ul class="file-list ${m.num === modules[0]?.num ? 'open' : ''}" id="files-m${m.num}">
${items}
        </ul>
      </li>`;
}).join('\n');

// Build content sections
const contentHtml = modules.map(m => {
  return m.files.map((f, fi) => {
    const id = `m${m.num}-f${fi}`;
    return `<section id="${id}" class="chapter" data-module="${m.num}">
  <div class="chapter-content">${f.html}</div>
</section>`;
  }).join('\n\n');
}).join('\n\n');

const totalFiles = modules.reduce((s, m) => s + m.files.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MBA XP Exam Prep — Big Data Analytics</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --page-bg: #faf8f4;
    --text: #2c2418;
    --text-light: #5a4e3c;
    --accent: #8b4513;
    --accent-light: #c4956a;
    --border: #e0d8cc;
    --code-bg: #f0ebe3;
    --table-stripe: #f5f1ea;
    --highlight: #fffde6;
    --chapter-bg: #ffffff;
    --sidebar-bg: #f0ebe3;
    --sidebar-active: #8b4513;
    --max-width: 100%;
  }

  /* ---- Dark theme (Bear Shibuya Jazz inspired) ---- */
  [data-theme="dark"] {
    --page-bg: #1e1e24;
    --text: #d8d8d8;
    --text-light: #9a9a9a;
    --accent: #5fb4b4;
    --accent-light: #5fb4b4;
    --border: #3a3a42;
    --code-bg: #27272e;
    --table-stripe: #24242b;
    --highlight: #2a2a32;
    --chapter-bg: #1e1e24;
    --sidebar-bg: #18181e;
    --sidebar-active: #5fb4b4;
  }
  [data-theme="dark"] a { color: #d4a857; }
  [data-theme="dark"] th { background: #2e3d3d; color: #d8d8d8; }
  [data-theme="dark"] .nav-file:hover,
  [data-theme="dark"] .nav-file.active { background: #5fb4b4; color: #1e1e24; }
  [data-theme="dark"] .module-toggle:hover { background: rgba(95,180,180,0.1); }
  [data-theme="dark"] .back-to-top { background: #5fb4b4; color: #1e1e24; }
  [data-theme="dark"] blockquote { background: #27272e; border-left-color: #5fb4b4; }
  [data-theme="dark"] code { color: #5fb4b4; background: #27272e; }

  /* ---- Controls bar (pinned to sidebar bottom) ---- */
  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    padding: 0.8rem 1rem;
    border-top: 1px solid var(--border);
    background: var(--sidebar-bg);
  }
  .ctrl-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    font-size: 0.78rem;
    font-family: 'Crimson Pro', serif;
    color: var(--text);
    cursor: pointer;
    transition: all 0.15s;
    line-height: 1;
  }
  .ctrl-btn:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
  .ctrl-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .ctrl-sep { width: 1px; height: 1.2rem; background: var(--border); margin: 0 0.2rem; }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-size: 17px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: 'Crimson Pro', 'Georgia', serif;
    color: var(--text);
    background: var(--page-bg);
    line-height: 1.72;
    display: flex;
    min-height: 100vh;
  }

  /* ---- Sidebar ---- */
  .sidebar {
    position: fixed;
    top: 0; left: 0;
    width: 300px;
    height: 100vh;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    padding: 1.5rem 0.6rem 3.5rem;
    z-index: 100;
    transition: transform 0.3s ease;
  }
  .sidebar .book-title {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: 0.2rem;
  }
  .sidebar .book-subtitle {
    font-size: 0.75rem;
    color: var(--text-light);
    margin-bottom: 1.2rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--border);
  }
  .sidebar nav > ul { list-style: none; }
  .nav-module {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  .nav-module:last-child { border-bottom: none; }
  .module-toggle {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0.45rem 0.6rem;
    border-radius: 6px;
    font-size: 0.88rem;
    font-family: 'Crimson Pro', serif;
    font-weight: 600;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s;
  }
  .module-toggle:hover { background: rgba(139,69,19,0.08); }
  .toggle-icon {
    display: inline-block;
    width: 1rem;
    font-size: 0.7rem;
    transition: transform 0.2s;
  }
  .module-subtitle {
    display: block;
    padding: 0 0.6rem 0.2rem 1.6rem;
    font-size: 0.72rem;
    color: var(--text-light);
    font-style: italic;
  }
  .file-list {
    list-style: none;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    padding-left: 1rem;
  }
  .file-list.open { max-height: 500px; }
  .nav-file {
    display: block;
    padding: 0.35rem 0.6rem;
    border-radius: 5px;
    font-size: 0.82rem;
    color: var(--text);
    text-decoration: none;
    transition: all 0.15s;
    line-height: 1.35;
  }
  .nav-file:hover, .nav-file.active {
    background: var(--accent);
    color: #fff;
  }

  /* ---- Mobile toggle ---- */
  .sidebar-toggle {
    display: none;
    position: fixed;
    top: 1rem; left: 1rem;
    z-index: 200;
    width: 40px; height: 40px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--chapter-bg);
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 40px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  /* ---- Main ---- */
  .main {
    margin-left: 300px;
    flex: 1;
    padding: 2rem 2.5rem 4rem;
    min-width: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .chapter {
    margin-bottom: 3rem;
    padding-bottom: 2.5rem;
    border-bottom: 2px solid var(--border);
  }
  .chapter:last-child { border-bottom: none; }
  .chapter-content { max-width: var(--max-width); }

  /* ---- Typography ---- */
  h1 {
    font-size: 1.9rem;
    font-weight: 600;
    color: var(--accent);
    margin: 0 0 0.5rem;
    line-height: 1.25;
  }
  h2 {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--text);
    margin: 2.8rem 0 0.7rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid var(--border);
    line-height: 1.3;
  }
  h3 {
    font-size: 1.12rem;
    font-weight: 600;
    color: var(--accent);
    margin: 1.8rem 0 0.4rem;
  }
  h4 { font-size: 1rem; font-weight: 600; margin: 1.2rem 0 0.3rem; }
  p { margin: 0.6rem 0; }
  blockquote {
    margin: 1rem 0;
    padding: 0.8rem 1.2rem;
    border-left: 3px solid var(--accent-light);
    background: var(--highlight);
    font-style: italic;
    border-radius: 0 6px 6px 0;
  }
  blockquote p { margin: 0.25rem 0; }
  strong { font-weight: 600; }
  em { font-style: italic; }
  a { color: var(--accent); }
  hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
  ul, ol { margin: 0.5rem 0 0.5rem 1.5rem; }
  li { margin: 0.25rem 0; }
  li > p { margin: 0.15rem 0; }

  /* ---- Tables ---- */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.92rem;
    line-height: 1.5;
    table-layout: fixed;
    word-wrap: break-word;
  }
  th {
    background: var(--accent);
    color: #fff;
    font-weight: 500;
    text-align: left;
    padding: 0.55rem 0.75rem;
    font-size: 0.85rem;
    letter-spacing: 0.02em;
  }
  td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  tr:nth-child(even) td { background: var(--table-stripe); }
  tr:hover td { background: var(--highlight); }

  /* ---- Code ---- */
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82em;
    background: var(--code-bg);
    padding: 0.15em 0.35em;
    border-radius: 3px;
    color: var(--accent);
  }
  pre {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.2rem;
    overflow-x: auto;
    margin: 1rem 0;
    line-height: 1.5;
    font-size: 0.8rem;
    max-width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  pre code { background: none; padding: 0; color: var(--text); }

  /* ---- Back to top ---- */
  .back-to-top {
    position: fixed;
    bottom: 2rem; right: 2rem;
    width: 44px; height: 44px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1.3rem;
    line-height: 44px;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s, transform 0.3s;
    box-shadow: 0 3px 12px rgba(0,0,0,0.15);
    z-index: 50;
  }
  .back-to-top.visible { opacity: 1; pointer-events: auto; }
  .back-to-top:hover { transform: scale(1.1); }

  /* ---- Module count badge ---- */
  .module-count {
    display: inline-block;
    font-size: 0.65rem;
    background: var(--accent);
    color: #fff;
    border-radius: 8px;
    padding: 0.1rem 0.45rem;
    margin-left: 0.3rem;
    vertical-align: middle;
    font-weight: 500;
  }

  /* ---- Responsive ---- */
  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .sidebar-toggle { display: block; }
    .main { margin-left: 0; padding: 1.5rem 1.2rem 3rem; }
  }
  @media (max-width: 600px) {
    html { font-size: 15px; }
    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.2rem; }
    table { font-size: 0.82rem; }
    pre { font-size: 0.74rem; }
  }

  /* ---- Print ---- */
  @media print {
    .sidebar, .sidebar-toggle, .back-to-top { display: none !important; }
    .main { margin-left: 0; max-width: 100%; }
    .chapter { page-break-after: always; }
    body { background: #fff; }
  }
</style>
</head>
<body>

<button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle navigation">☰</button>

<aside class="sidebar" id="sidebar">
  <div class="book-title">MBA XP Exam Prep</div>
  <div class="book-subtitle">Big Data Analytics &mdash; Plain English Notes<br>
    <small>Woxsen University &middot; Dr. Dinesh Kumar</small><br>
    <small>${modules.length} module(s) &middot; ${totalFiles} sections</small>
  </div>
  <nav>
    <ul>
${tocHtml}
    </ul>
  </nav>
  <div class="controls">
    <button class="ctrl-btn" id="themeToggle" title="Toggle dark/light theme">🌙</button>
    <div class="ctrl-sep"></div>
    <button class="ctrl-btn" id="fontMinus" title="Decrease font size">A−</button>
    <span id="fontLabel" style="font-size:0.72rem;color:var(--text-light);min-width:2.5rem;text-align:center;">100%</span>
    <button class="ctrl-btn" id="fontPlus" title="Increase font size">A+</button>
  </div>
</aside>

<main class="main">
${contentHtml}
</main>

<button class="back-to-top" id="backToTop" aria-label="Back to top">&uarr;</button>

<script>
// Sidebar toggle (mobile)
const toggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
sidebar.querySelectorAll('.nav-file').forEach(a => {
  a.addEventListener('click', () => sidebar.classList.remove('open'));
});

// Module accordion
document.querySelectorAll('.module-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const mid = btn.dataset.module;
    const list = document.getElementById('files-' + mid);
    const isOpen = list.classList.contains('open');
    list.classList.toggle('open');
    btn.setAttribute('aria-expanded', !isOpen);
    btn.querySelector('.toggle-icon').textContent = isOpen ? '▶' : '▼';
  });
});

// Scroll tracking
const chapters = [...document.querySelectorAll('.chapter')];
const navLinks = [...sidebar.querySelectorAll('.nav-file')];
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrollTop = window.scrollY;

  // Active section
  let current = 0;
  chapters.forEach((ch, i) => {
    if (ch.getBoundingClientRect().top <= 120) current = i;
  });
  navLinks.forEach((l, i) => l.classList.toggle('active', i === current));

  // Auto-expand the module containing the active section
  const activeLink = navLinks[current];
  if (activeLink) {
    const fileList = activeLink.closest('.file-list');
    if (fileList && !fileList.classList.contains('open')) {
      fileList.classList.add('open');
      const btn = fileList.previousElementSibling?.previousElementSibling;
      if (btn && btn.classList.contains('module-toggle')) {
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.toggle-icon').textContent = '▼';
      }
    }
  }

  backToTop.classList.toggle('visible', scrollTop > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Theme toggle
const themeBtn = document.getElementById('themeToggle');
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', t);
  // Re-init mermaid with matching theme
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: t === 'dark' ? 'dark' : 'default',
      themeVariables: t === 'dark' ? { primaryColor: '#2e3d3d', primaryTextColor: '#d8d8d8', lineColor: '#5fb4b4', secondaryColor: '#27272e' } : {},
    });
    document.querySelectorAll('.mermaid[data-processed]').forEach(el => { el.removeAttribute('data-processed'); });
    document.querySelectorAll('.mermaid svg').forEach(svg => svg.remove());
    mermaid.run();
  }
}
// Restore saved preference or default to light
setTheme(localStorage.getItem('theme') || 'light');
themeBtn.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// Font size controls
const fontLabel = document.getElementById('fontLabel');
const BASE = 20;
let fontPct = parseInt(localStorage.getItem('fontPct') || '100');
function applyFont() {
  document.documentElement.style.fontSize = (BASE * fontPct / 100) + 'px';
  fontLabel.textContent = fontPct + '%';
  localStorage.setItem('fontPct', fontPct);
}
applyFont();
document.getElementById('fontPlus').addEventListener('click', () => { fontPct = Math.min(150, fontPct + 10); applyFont(); });
document.getElementById('fontMinus').addEventListener('click', () => { fontPct = Math.max(70, fontPct - 10); applyFont(); });
</script>

<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>
// Initialize Mermaid diagrams
// Convert <code class="language-mermaid"> blocks into rendered diagrams
document.querySelectorAll('code.language-mermaid').forEach((block, i) => {
  const pre = block.parentElement;
  const div = document.createElement('div');
  div.className = 'mermaid';
  div.textContent = block.textContent;
  pre.replaceWith(div);
});
const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
mermaid.initialize({
  startOnLoad: true,
  theme: isDark ? 'dark' : 'default',
  themeVariables: isDark ? { primaryColor: '#2e3d3d', primaryTextColor: '#d8d8d8', lineColor: '#5fb4b4', secondaryColor: '#27272e' } : {},
});
</script>

</body>
</html>`;

const outPath = path.join(DIR, 'index.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Built: index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB, ${modules.length} modules, ${totalFiles} files)`);
