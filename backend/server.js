/**
 * ====================================================================
 * My First-Code Fullstack - Backend API Server (Node.js)
 * Created with passion for @novalizerazizi
 * ====================================================================
 * Zero-dependency native Node.js HTTP server serving both:
 * 1. REST API endpoints (/api/*)
 * 2. Static Frontend Dashboard assets (/)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const DATA_FILE = path.join(__dirname, 'data.json');

// Initial in-memory learning modules & state
let db = {
  profile: {
    name: "novalizerazizi",
    role: "Aspiring Fullstack Developer",
    github: "https://github.com/novalizerazizi",
    repo: "https://github.com/novalizerazizi/git-me-as",
    startedAt: "2026-10-10"
  },
  modules: [
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
  ],
  notes: [
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
  ]
};

// Load saved data if exists
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading data file:", err.message);
  }
}

// Persist data
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving data file:", err.message);
  }
}

loadData();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper: parse JSON request body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // ------------------ REST API ROUTES ------------------
  if (pathname.startsWith('/api/')) {
    // 1. Health & Server Status
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: "healthy",
        server: "Node.js Native HTTP Server",
        nodeVersion: process.version,
        platform: os.platform(),
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      });
    }

    // 2. Profile & Overview Stats
    if (pathname === '/api/profile' && req.method === 'GET') {
      const completedCount = db.modules.filter(m => m.completed).length;
      return sendJson(res, 200, {
        ...db.profile,
        stats: {
          totalModules: db.modules.length,
          completedModules: completedCount,
          progressPercentage: Math.round((completedCount / db.modules.length) * 100),
          notesCount: db.notes.length
        }
      });
    }

    // 3. Learning Roadmap Modules
    if (pathname === '/api/modules' && req.method === 'GET') {
      return sendJson(res, 200, db.modules);
    }

    // Toggle module status
    if (pathname.match(/^\/api\/modules\/(\d+)\/toggle$/) && req.method === 'POST') {
      const id = parseInt(pathname.split('/')[3], 10);
      const mod = db.modules.find(m => m.id === id);
      if (!mod) {
        return sendJson(res, 404, { error: "Module not found" });
      }
      mod.completed = !mod.completed;
      saveData();
      return sendJson(res, 200, mod);
    }

    // 4. Notes & Dev Journal
    if (pathname === '/api/notes' && req.method === 'GET') {
      return sendJson(res, 200, db.notes);
    }

    if (pathname === '/api/notes' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        if (!body.title || !body.content) {
          return sendJson(res, 400, { error: "Title and content are required" });
        }
        const newNote = {
          id: Date.now(),
          title: body.title,
          tag: body.tag || "General",
          content: body.content,
          createdAt: new Date().toISOString()
        };
        db.notes.unshift(newNote);
        saveData();
        return sendJson(res, 201, newNote);
      } catch (err) {
        return sendJson(res, 400, { error: "Invalid JSON body: " + err.message });
      }
    }

    // Delete note
    if (pathname.match(/^\/api\/notes\/(\d+)$/) && req.method === 'DELETE') {
      const id = parseInt(pathname.split('/')[3], 10);
      const initialLength = db.notes.length;
      db.notes = db.notes.filter(n => n.id !== id);
      if (db.notes.length === initialLength) {
        return sendJson(res, 404, { error: "Note not found" });
      }
      saveData();
      return sendJson(res, 200, { success: true, deletedId: id });
    }

    // 5. Code Snippets Hub
    if (pathname === '/api/snippets' && req.method === 'GET') {
      return sendJson(res, 200, [
        {
          language: "JavaScript / Node.js",
          title: "Simple REST API Endpoint with Express/Node",
          code: `const express = require('express');\nconst app = express();\n\napp.use(express.json());\napp.get('/api/greet', (req, res) => {\n  res.json({ message: 'Hello Fullstack Developer!' });\n});\n\napp.listen(3000, () => console.log('Listening on port 3000'));`
        },
        {
          language: "Python",
          title: "FastAPI Clean API Endpoint",
          code: `from fastapi import FastAPI\n\napp = FastAPI(title="Fullstack API")\n\n@app.get("/api/greet")\ndef greet():\n    return {"message": "Hello from Python FastAPI!"}\n\n# Run with: uvicorn app:app --reload`
        },
        {
          language: "Git",
          title: "Professional Git Feature Workflow",
          code: `# 1. Create a clean feature branch\ngit checkout -b feature/awesome-dashboard\n\n# 2. Stage and commit with conventional message\ngit add .\ngit commit -m "feat: add interactive learning roadmap"\n\n# 3. Push and open pull request\ngit push -u origin feature/awesome-dashboard`
        }
      ]);
    }

    return sendJson(res, 404, { error: "API route not found" });
  }

  // ------------------ STATIC FILES (FRONTEND) ------------------
  let filePath = path.join(FRONTEND_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA behavior
      filePath = path.join(FRONTEND_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 My First-Code Fullstack Dashboard is running!`);
  console.log(`🔗 Local URL : http://localhost:${PORT}`);
  console.log(`📡 API URL   : http://localhost:${PORT}/api/health`);
  console.log(`👤 Developer : @novalizerazizi`);
  console.log(`======================================================\n`);
});
