/**
 * My First-Code Fullstack - Frontend Reactive Engine
 * Designed for @novalizerazizi
 */

let state = {
  modules: [],
  notes: [],
  activeFilter: 'all',
  activeTab: 'roadmap',
  serverOnline: false,
  uptime: 0
};

// Fallback initial data in case running static without backend
const FALLBACK_MODULES = [
  {
    id: 1,
    title: "Foundations of the Web",
    category: "Frontend",
    level: "Beginner",
    icon: "layout",
    topics: ["Semantic HTML5", "Modern CSS & Flexbox/Grid", "JavaScript ES6+ Basics", "DOM Manipulation"],
    completed: true
  },
  {
    id: 2,
    title: "Version Control & Git Workflow",
    category: "DevOps",
    level: "Essential",
    icon: "git-branch",
    topics: ["Git Init, Staging & Commits", "Branching & Merge Strategy", "Remote Repos on GitHub", "Conventional Commits"],
    completed: true
  },
  {
    id: 3,
    title: "Backend Core & REST API",
    category: "Backend",
    level: "Intermediate",
    icon: "server",
    topics: ["Node.js Runtime & Event Loop", "HTTP Methods (GET, POST, PUT, DELETE)", "JSON APIs & CORS", "Python Fundamentals"],
    completed: true
  },
  {
    id: 4,
    title: "Data Persistence & Databases",
    category: "Database",
    level: "Intermediate",
    icon: "database",
    topics: ["Relational (PostgreSQL / SQLite)", "NoSQL (MongoDB / Redis)", "CRUD Operations & Schemas", "ORM / Query Builders"],
    completed: false
  },
  {
    id: 5,
    title: "Authentication & Security",
    category: "Security",
    level: "Advanced",
    icon: "shield",
    topics: ["JWT Tokens & Cookies", "Password Hashing (bcrypt)", "CORS, CSP & Sanitization", "Environment Variables (.env)"],
    completed: false
  },
  {
    id: 6,
    title: "Deployment, CI/CD & Cloud",
    category: "DevOps",
    level: "Advanced",
    icon: "cloud",
    topics: ["Docker Containerization", "GitHub Actions CI/CD", "Cloud Deploy (Vercel, Render, VPS)", "Monitoring & Logs"],
    completed: false
  }
];

const FALLBACK_NOTES = [
  {
    id: 1,
    title: "First Repo Milestone 🎉",
    tag: "Milestone",
    content: "Repositori git-me-as berhasil dibuat dan dikoneksikan ke GitHub dengan Git CLI & Personal Token!",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Understanding Fullstack Flow",
    tag: "Concept",
    content: "Client (Browser/HTML/JS) -> HTTP Request (JSON) -> Server (Node.js/Python API) -> Database -> Response (200 OK)",
    createdAt: new Date().toISOString()
  }
];

const SNIPPETS = [
  {
    language: "Node.js (Native HTTP)",
    title: "Zero-dependency REST API",
    code: `const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  if (req.url === '/api/ping') {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    return res.end(JSON.stringify({ message: 'pong!' }));\n  }\n});\nserver.listen(3000);`
  },
  {
    language: "Python (FastAPI)",
    title: "Modern Async Python API",
    code: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/api/health")\ndef health():\n    return {"status": "ok", "power": "Python 3.15"}`
  },
  {
    language: "Git Pro",
    title: "Semantic Commit & Push",
    code: `# Create feature branch\ngit checkout -b feat/user-auth\n\n# Commit standard\ngit commit -m "feat(auth): implement jwt token verification"\n\n# Push to origin\ngit push -u origin feat/user-auth`
  },
  {
    language: "JavaScript ES6+",
    title: "Async/Await Fetch Pattern",
    code: `async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error("Fetch failed:", err.message);\n  }\n}`
  },
  {
    language: "CSS Grid",
    title: "Responsive Fullstack Layout",
    code: `.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n}`
  },
  {
    language: "SQL",
    title: "Standard Users Table Schema",
    code: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`
  }
];

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  await checkHealth();
  await loadModules();
  await loadNotes();
  renderSnippets();
  updateProgressStats();

  // Periodic health check
  setInterval(checkHealth, 5000);
});

// Check Server Health
async function checkHealth() {
  const badgeText = document.getElementById('api-status-text');
  const uptimeSpan = document.getElementById('stat-uptime');
  const backendType = document.getElementById('stat-backend-type');

  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      state.serverOnline = true;
      state.uptime = data.uptimeSeconds || 0;
      badgeText.innerText = "API Online (200 OK)";
      badgeText.className = "text-emerald-400 font-mono text-xs";
      uptimeSpan.innerText = `${state.uptime}s`;
      backendType.innerText = data.server.includes('Node') ? 'Node.js' : 'Python';
      return;
    }
  } catch (err) {
    // If running from static file or offline
  }

  state.serverOnline = false;
  badgeText.innerText = "Static Mode (Offline API)";
  badgeText.className = "text-amber-400 font-mono text-xs";
  uptimeSpan.innerText = "N/A";
}

// Load Modules
async function loadModules() {
  try {
    const res = await fetch('/api/modules');
    if (res.ok) {
      state.modules = await res.json();
    } else {
      throw new Error();
    }
  } catch {
    const local = localStorage.getItem('fullstack_modules');
    state.modules = local ? JSON.parse(local) : FALLBACK_MODULES;
  }
  renderModules();
}

// Render Modules
function renderModules() {
  const container = document.getElementById('modules-container');
  if (!container) return;

  const filtered = state.activeFilter === 'all' 
    ? state.modules 
    : state.modules.filter(m => m.category === state.activeFilter);

  container.innerHTML = filtered.map(mod => `
    <div class="bg-slate-900 border ${mod.completed ? 'border-indigo-500/40' : 'border-slate-800'} rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between group relative overflow-hidden">
      ${mod.completed ? '<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none"></div>' : ''}
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${getCategoryBadge(mod.category)}">
            ${mod.category}
          </span>
          <span class="text-[11px] font-mono text-slate-400">${mod.level}</span>
        </div>
        <h3 class="text-base font-bold text-white mb-2 flex items-center space-x-2">
          <span>${mod.title}</span>
        </h3>
        <ul class="space-y-1.5 mb-4 text-xs text-slate-300">
          ${mod.topics.map(t => `
            <li class="flex items-center space-x-2">
              <span class="w-1.5 h-1.5 rounded-full ${mod.completed ? 'bg-indigo-400' : 'bg-slate-600'}"></span>
              <span>${t}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <label class="flex items-center space-x-2 cursor-pointer select-none">
          <input type="checkbox" ${mod.completed ? 'checked' : ''} onchange="toggleModule(${mod.id})" 
                 class="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900">
          <span class="text-xs ${mod.completed ? 'text-indigo-400 font-semibold' : 'text-slate-400'}">
            ${mod.completed ? 'Telah Dipelajari' : 'Tandai Selesai'}
          </span>
        </label>
        <span class="text-xs font-mono text-slate-500">ID: #${mod.id}</span>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function getCategoryBadge(category) {
  switch (category) {
    case 'Frontend': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    case 'Backend': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'DevOps': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'Database': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'Security': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default: return 'bg-slate-700 text-slate-300';
  }
}

// Toggle Module Completed
async function toggleModule(id) {
  const mod = state.modules.find(m => m.id === id);
  if (!mod) return;

  if (state.serverOnline) {
    try {
      const res = await fetch(`/api/modules/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        mod.completed = updated.completed;
      }
    } catch {
      mod.completed = !mod.completed;
    }
  } else {
    mod.completed = !mod.completed;
    localStorage.setItem('fullstack_modules', JSON.stringify(state.modules));
  }

  renderModules();
  updateProgressStats();
}

// Filter modules
function filterModules(category) {
  state.activeFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-indigo-600', 'text-white');
    btn.classList.add('bg-slate-800', 'text-slate-300');
  });
  event.target.classList.remove('bg-slate-800', 'text-slate-300');
  event.target.classList.add('bg-indigo-600', 'text-white');
  renderModules();
}

// Update progress stats
function updateProgressStats() {
  const total = state.modules.length;
  if (!total) return;
  const completed = state.modules.filter(m => m.completed).length;
  const pct = Math.round((completed / total) * 100);

  const textEl = document.getElementById('stat-progress-text');
  const ratioEl = document.getElementById('stat-modules-ratio');
  const barEl = document.getElementById('stat-progress-bar');

  if (textEl) textEl.innerText = `${pct}%`;
  if (ratioEl) ratioEl.innerText = `(${completed} / ${total} Selesai)`;
  if (barEl) barEl.style.width = `${pct}%`;
}

// Switch Tabs
function switchTab(tab) {
  state.activeTab = tab;
  const tabs = ['roadmap', 'api', 'notes', 'snippets'];
  tabs.forEach(t => {
    const content = document.getElementById(`tab-content-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (content) content.classList.toggle('hidden', t !== tab);
    if (btn) {
      if (t === tab) {
        btn.className = "tab-btn pb-3 text-indigo-400 border-b-2 border-indigo-500 font-semibold flex items-center space-x-2";
      } else {
        btn.className = "tab-btn pb-3 text-slate-400 hover:text-slate-200 border-b-2 border-transparent flex items-center space-x-2";
      }
    }
  });
  if (window.lucide) lucide.createIcons();
}

// API Playground Caller
async function callApi(endpoint, method) {
  const statusEl = document.getElementById('api-response-status');
  const timeEl = document.getElementById('api-response-time');
  const bodyEl = document.getElementById('api-response-body');

  statusEl.innerText = "Memproses...";
  statusEl.className = "px-2 py-0.5 rounded text-xs font-mono font-semibold bg-amber-500/20 text-amber-400";
  bodyEl.innerText = "// Loading data from " + endpoint + "...";

  const startTime = performance.now();
  try {
    const res = await fetch(endpoint, { method });
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    timeEl.innerText = `${duration}ms`;
    statusEl.innerText = `${res.status} ${res.statusText}`;
    statusEl.className = res.ok 
      ? "px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-400"
      : "px-2 py-0.5 rounded text-xs font-mono font-semibold bg-rose-500/20 text-rose-400";

    const json = await res.json();
    bodyEl.innerText = JSON.stringify(json, null, 2);
  } catch (err) {
    statusEl.innerText = "Error Fetching";
    statusEl.className = "px-2 py-0.5 rounded text-xs font-mono font-semibold bg-rose-500/20 text-rose-400";
    bodyEl.innerText = JSON.stringify({
      error: "Gagal terhubung ke API endpoint.",
      message: err.message,
      hint: "Pastikan backend server berjalan (jalankan 'npm start' di terminal)."
    }, null, 2);
  }
}

// Load Notes
async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    if (res.ok) {
      state.notes = await res.json();
    } else {
      throw new Error();
    }
  } catch {
    const local = localStorage.getItem('fullstack_notes');
    state.notes = local ? JSON.parse(local) : FALLBACK_NOTES;
  }
  renderNotes();
}

// Render Notes
function renderNotes() {
  const container = document.getElementById('notes-container');
  const countEl = document.getElementById('notes-counter-label');
  const statCount = document.getElementById('stat-notes-count');
  
  if (countEl) countEl.innerText = `${state.notes.length} Catatan`;
  if (statCount) statCount.innerText = state.notes.length;
  if (!container) return;

  if (state.notes.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">Belum ada catatan. Buat catatan baru di form sebelah kiri!</div>`;
    return;
  }

  container.innerHTML = state.notes.map(note => `
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-white">${note.title}</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700 font-mono">${note.tag}</span>
          </div>
          <span class="text-[11px] text-slate-500 font-mono">${new Date(note.createdAt).toLocaleDateString()} ${new Date(note.createdAt).toLocaleTimeString()}</span>
        </div>
        <button onclick="deleteNote(${note.id})" class="text-slate-500 hover:text-rose-400 p-1 transition" title="Hapus catatan">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
      <p class="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg font-mono">${note.content}</p>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// Add Note Handler
async function handleNoteSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('note-title').value;
  const tag = document.getElementById('note-tag').value;
  const content = document.getElementById('note-content').value;

  if (!title || !content) return;

  const newNote = {
    id: Date.now(),
    title,
    tag,
    content,
    createdAt: new Date().toISOString()
  };

  if (state.serverOnline) {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      if (res.ok) {
        const saved = await res.json();
        state.notes.unshift(saved);
      }
    } catch {
      state.notes.unshift(newNote);
    }
  } else {
    state.notes.unshift(newNote);
    localStorage.setItem('fullstack_notes', JSON.stringify(state.notes));
  }

  document.getElementById('note-form').reset();
  renderNotes();
}

// Delete Note
async function deleteNote(id) {
  if (state.serverOnline) {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    } catch {}
  }
  state.notes = state.notes.filter(n => n.id !== id);
  localStorage.setItem('fullstack_notes', JSON.stringify(state.notes));
  renderNotes();
}

// Render Snippets
function renderSnippets() {
  const container = document.getElementById('snippets-container');
  if (!container) return;

  container.innerHTML = SNIPPETS.map((snip, idx) => `
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-indigo-400 font-mono">${snip.language}</span>
          <button onclick="copySnippet(${idx})" id="copy-btn-${idx}" class="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition">
            <i data-lucide="copy" class="w-3 h-3"></i>
            <span>Salin</span>
          </button>
        </div>
        <h4 class="text-xs font-bold text-slate-200 mb-2">${snip.title}</h4>
        <pre class="bg-slate-950 p-3 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80"><code>${escapeHtml(snip.code)}</code></pre>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function copySnippet(idx) {
  const code = SNIPPETS[idx].code;
  navigator.clipboard.writeText(code);
  const btn = document.getElementById(`copy-btn-${idx}`);
  if (btn) {
    btn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i><span class="text-emerald-400">Tersalin!</span>`;
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = `<i data-lucide="copy" class="w-3 h-3"></i><span>Salin</span>`;
      if (window.lucide) lucide.createIcons();
    }, 2000);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
