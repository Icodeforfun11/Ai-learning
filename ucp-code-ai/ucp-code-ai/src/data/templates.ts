/* Starter templates and community samples. Each runs in the sandboxed preview. */
export type ProjectFile = { name: string; content: string };
export type Template = { id: string; name: string; icon: string; desc: string; files: ProjectFile[] };
export type Sample = { id: string; title: string; author: string; tags: string[]; files: ProjectFile[] };

export const TEMPLATES: Template[] = [
 {
  "id": "portfolio",
  "name": "Portfolio",
  "icon": "👤",
  "desc": "Personal portfolio with hero, projects grid and contact section.",
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>My Portfolio</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <header class=\"hero\">\n    <p class=\"hi\">Hi, I'm</p>\n    <h1 id=\"name\">Your Name</h1>\n    <p class=\"role\">Young developer · Designer · Problem solver</p>\n    <a class=\"btn\" href=\"#projects\">See my work</a>\n  </header>\n  <main>\n    <section id=\"projects\">\n      <h2>Projects</h2>\n      <div class=\"grid\" id=\"grid\"></div>\n    </section>\n    <section id=\"contact\">\n      <h2>Contact</h2>\n      <p>Email: <span class=\"mono\">you@example.com</span></p>\n    </section>\n  </main>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; background: #0b1020; color: #e8ecff; }\n.hero { min-height: 70vh; display: grid; place-content: center; text-align: center; padding: 40px 20px;\n  background: radial-gradient(circle at 30% 20%, #3d8bff55, transparent 50%), radial-gradient(circle at 70% 60%, #8b5cff55, transparent 50%); }\n.hero h1 { font-size: clamp(2.4rem, 8vw, 4.5rem); margin: 0; }\n.hi, .role { color: #93a0c8; }\n.btn { display: inline-block; margin-top: 16px; padding: 12px 22px; border-radius: 12px; background: linear-gradient(135deg,#3d8bff,#8b5cff); color: white; text-decoration: none; font-weight: 600; }\nmain { max-width: 960px; margin: 0 auto; padding: 40px 20px; }\n.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }\n.card { background: #141c3a; border: 1px solid #2a3768; border-radius: 16px; padding: 20px; transition: transform .2s; }\n.card:hover { transform: translateY(-4px); }\n.mono { font-family: monospace; }"
   },
   {
    "name": "script.js",
    "content": "const projects = [\n  { title: 'Weather App', text: 'Shows the forecast for my city.' },\n  { title: 'Quiz Game', text: 'Ten questions about space.' },\n  { title: 'Pixel Art', text: 'Draw on a 16×16 grid.' },\n];\nconst grid = document.getElementById('grid');\ngrid.innerHTML = projects.map(p => `<article class=\"card\"><h3>${p.title}</h3><p>${p.text}</p></article>`).join('');\nconsole.log('Portfolio loaded with', projects.length, 'projects');"
   }
  ]
 },
 {
  "id": "landing",
  "name": "Landing page",
  "icon": "🚀",
  "desc": "Product landing page with features, pricing toggle and call to action.",
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Launch</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <nav class=\"nav\"><b>Nova</b><a href=\"#cta\" class=\"btn sm\">Get started</a></nav>\n  <header class=\"hero\">\n    <h1>Build faster with <span class=\"grad\">Nova</span></h1>\n    <p>The simple tool that turns ideas into apps.</p>\n    <a href=\"#cta\" class=\"btn\">Try it free</a>\n  </header>\n  <section class=\"features\">\n    <div><h3>⚡ Fast</h3><p>Loads in under a second.</p></div>\n    <div><h3>🔒 Secure</h3><p>Privacy by default.</p></div>\n    <div><h3>🎨 Beautiful</h3><p>Looks great everywhere.</p></div>\n  </section>\n  <section class=\"pricing\">\n    <label><input type=\"checkbox\" id=\"yearly\"> Yearly billing (save 20%)</label>\n    <p class=\"price\"><span id=\"price\">$10</span> / month</p>\n  </section>\n  <section id=\"cta\" class=\"cta\"><h2>Ready?</h2><button class=\"btn\" id=\"join\">Join the waitlist</button><p id=\"msg\"></p></section>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "body { margin: 0; font-family: system-ui, sans-serif; color: #111827; background: #f8fafc; }\n.nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; }\n.hero { text-align: center; padding: 70px 20px; }\n.hero h1 { font-size: clamp(2rem, 6vw, 3.4rem); margin: 0 0 10px; }\n.grad { background: linear-gradient(135deg,#3d8bff,#8b5cff); -webkit-background-clip: text; background-clip: text; color: transparent; }\n.btn { display: inline-block; border: 0; cursor: pointer; padding: 12px 22px; border-radius: 12px; background: #4f46e5; color: #fff; text-decoration: none; font: 600 1rem system-ui; }\n.btn.sm { padding: 8px 14px; font-size: .9rem; }\n.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 900px; margin: 0 auto; padding: 20px; }\n.features div { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px -15px #0003; }\n.pricing, .cta { text-align: center; padding: 40px 20px; }\n.price { font-size: 2rem; font-weight: 800; }"
   },
   {
    "name": "script.js",
    "content": "const yearly = document.getElementById('yearly');\nconst price = document.getElementById('price');\nyearly.addEventListener('change', () => {\n  price.textContent = yearly.checked ? '$8' : '$10';\n});\ndocument.getElementById('join').addEventListener('click', () => {\n  document.getElementById('msg').textContent = \"🎉 You're on the list!\";\n});"
   }
  ]
 },
 {
  "id": "calculator",
  "name": "Calculator",
  "icon": "🧮",
  "desc": "Working calculator with keyboard support.",
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Calculator</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <main class=\"calc\" aria-label=\"Calculator\">\n    <output id=\"display\">0</output>\n    <div class=\"keys\" id=\"keys\"></div>\n  </main>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; font-family: system-ui; }\n.calc { width: min(320px, 92vw); background: #1e293b; padding: 18px; border-radius: 24px; box-shadow: 0 30px 60px -20px #000a; }\n#display { display: block; text-align: right; color: white; font-size: 2.4rem; padding: 12px 8px; overflow: hidden; }\n.keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }\nbutton { height: 60px; border: 0; border-radius: 16px; font-size: 1.3rem; background: #334155; color: white; cursor: pointer; }\nbutton.op { background: #6366f1; } button.eq { background: #22c55e; } button:active { transform: scale(.96); }"
   },
   {
    "name": "script.js",
    "content": "const keys = ['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','⌫','='];\nconst display = document.getElementById('display');\nlet expr = '';\n\ndocument.getElementById('keys').innerHTML = keys.map(k =>\n  `<button class=\"${'÷×−+'.includes(k) ? 'op' : k === '=' ? 'eq' : ''}\" data-k=\"${k}\">${k}</button>`).join('');\n\nfunction show() { display.textContent = expr || '0'; }\n\nfunction press(k) {\n  if (k === 'C') expr = '';\n  else if (k === '⌫') expr = expr.slice(0, -1);\n  else if (k === '±') expr = expr.startsWith('-') ? expr.slice(1) : '-' + expr;\n  else if (k === '=') {\n    try {\n      // Only digits and operators reach this point, so it's safe to evaluate\n      const clean = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/%/g, '/100');\n      if (!/^[\\d+\\-*/.() ]+$/.test(clean)) throw new Error('Invalid');\n      expr = String(+Function('return (' + clean + ')')().toFixed(10));\n    } catch (e) { expr = ''; display.textContent = 'Error'; return; }\n  } else expr += k;\n  show();\n}\ndocument.getElementById('keys').addEventListener('click', e => { if (e.target.dataset.k) press(e.target.dataset.k); });\ndocument.addEventListener('keydown', e => {\n  const map = { '*': '×', '/': '÷', '-': '−', Enter: '=', Backspace: '⌫', Escape: 'C' };\n  const k = map[e.key] || e.key;\n  if (keys.includes(k)) press(k);\n});"
   }
  ]
 },
 {
  "id": "dashboard",
  "name": "Dashboard",
  "icon": "📊",
  "desc": "Stats dashboard with KPI cards and a canvas bar chart.",
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Dashboard</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <aside class=\"side\"><b>📊 Stats</b><a class=\"on\">Overview</a><a>Reports</a><a>Settings</a></aside>\n  <main class=\"main\">\n    <h1>Overview</h1>\n    <div class=\"kpis\" id=\"kpis\"></div>\n    <div class=\"panel\"><h2>Weekly visitors</h2><canvas id=\"chart\" height=\"220\"></canvas></div>\n  </main>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "body { margin: 0; display: grid; grid-template-columns: 200px 1fr; min-height: 100vh; font-family: system-ui; background: #f1f5f9; color: #0f172a; }\n@media (max-width: 640px) { body { grid-template-columns: 1fr; } .side { display: none; } }\n.side { background: #0f172a; color: #cbd5e1; padding: 20px; display: flex; flex-direction: column; gap: 8px; }\n.side a { padding: 8px 10px; border-radius: 8px; } .side a.on { background: #1e293b; color: white; }\n.main { padding: 24px; }\n.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; }\n.kpi, .panel { background: white; border-radius: 16px; padding: 18px; box-shadow: 0 8px 24px -16px #0004; }\n.kpi b { display: block; font-size: 1.8rem; } .kpi span { color: #64748b; font-size: .85rem; }\n.panel { margin-top: 16px; } canvas { width: 100%; }"
   },
   {
    "name": "script.js",
    "content": "const kpis = [['Visitors','12,480'],['Sign-ups','932'],['Revenue','$4,210'],['Bounce rate','31%']];\ndocument.getElementById('kpis').innerHTML = kpis.map(([l, v]) => `<div class=\"kpi\"><b>${v}</b><span>${l}</span></div>`).join('');\n\nconst data = [120, 190, 150, 220, 280, 240, 310];\nconst days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];\nconst c = document.getElementById('chart');\nfunction draw() {\n  const ctx = c.getContext('2d');\n  c.width = c.clientWidth * devicePixelRatio; c.height = 220 * devicePixelRatio;\n  ctx.scale(devicePixelRatio, devicePixelRatio);\n  const w = c.clientWidth, h = 220, max = Math.max(...data), bw = w / data.length;\n  data.forEach((v, i) => {\n    const bh = (v / max) * (h - 40);\n    ctx.fillStyle = '#6366f1';\n    ctx.beginPath(); ctx.roundRect(i * bw + bw * .2, h - 24 - bh, bw * .6, bh, 6); ctx.fill();\n    ctx.fillStyle = '#64748b'; ctx.font = '12px system-ui'; ctx.textAlign = 'center';\n    ctx.fillText(days[i], i * bw + bw / 2, h - 6);\n  });\n}\ndraw(); addEventListener('resize', draw);"
   }
  ]
 },
 {
  "id": "game",
  "name": "Basic game",
  "icon": "🎮",
  "desc": "Catch-the-star canvas game with score, timer and keyboard/touch controls.",
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Star Catcher</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <div class=\"hud\"><span>⭐ <b id=\"score\">0</b></span><span>⏱ <b id=\"time\">30</b>s</span><button id=\"start\">Start</button></div>\n  <canvas id=\"game\" width=\"400\" height=\"400\" aria-label=\"Game area: move with arrow keys or drag\"></canvas>\n  <p class=\"help\">Arrow keys or drag to move. Catch the stars!</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "body { margin: 0; min-height: 100vh; display: grid; place-content: center; gap: 10px; background: #020617; color: white; font-family: system-ui; text-align: center; }\n.hud { display: flex; gap: 20px; justify-content: center; align-items: center; font-size: 1.1rem; }\ncanvas { width: min(400px, 92vw); aspect-ratio: 1; background: radial-gradient(#1e1b4b, #020617); border-radius: 18px; touch-action: none; }\nbutton { padding: 8px 16px; border: 0; border-radius: 10px; background: #8b5cf6; color: white; font-weight: 700; cursor: pointer; }\n.help { color: #94a3b8; font-size: .85rem; }"
   },
   {
    "name": "script.js",
    "content": "const cv = document.getElementById('game'), ctx = cv.getContext('2d');\nconst player = { x: 200, y: 360, r: 18 };\nlet star = null, score = 0, time = 30, running = false, keys = {}, timer;\n\nfunction spawn() { star = { x: 30 + Math.random() * 340, y: -10, v: 2 + Math.random() * 2 + score * 0.1 }; }\nfunction start() {\n  score = 0; time = 30; running = true; spawn();\n  document.getElementById('score').textContent = 0;\n  clearInterval(timer);\n  timer = setInterval(() => {\n    time--; document.getElementById('time').textContent = time;\n    if (time <= 0) { running = false; clearInterval(timer); console.log('Game over! Score:', score); }\n  }, 1000);\n}\naddEventListener('keydown', e => keys[e.key] = true);\naddEventListener('keyup', e => keys[e.key] = false);\ncv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); player.x = (e.clientX - r.left) * 400 / r.width; });\ndocument.getElementById('start').onclick = start;\n\nfunction loop() {\n  ctx.clearRect(0, 0, 400, 400);\n  if (keys.ArrowLeft) player.x -= 6; if (keys.ArrowRight) player.x += 6;\n  player.x = Math.max(18, Math.min(382, player.x));\n  if (running && star) {\n    star.y += star.v;\n    if (Math.hypot(star.x - player.x, star.y - player.y) < 30) { score++; document.getElementById('score').textContent = score; spawn(); }\n    if (star.y > 420) spawn();\n    ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.fillText('⭐', star.x, star.y);\n  }\n  ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();\n  if (!running) { ctx.fillStyle = '#fff'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center'; ctx.fillText(time <= 0 ? 'Score: ' + score : 'Press Start', 200, 200); }\n  requestAnimationFrame(loop);\n}\nloop();"
   }
  ]
 }
];

export const BLANK: ProjectFile[] = [
 {
  "name": "index.html",
  "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>My Project</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <h1>Hello, UCP CODE AI 👋</h1>\n  <p>Edit the files and press <b>Run</b>.</p>\n  <button id=\"btn\">Click me</button>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
 },
 {
  "name": "style.css",
  "content": "body { font-family: system-ui, sans-serif; padding: 24px; background: #f8fafc; color: #0f172a; }\nh1 { background: linear-gradient(135deg, #3d8bff, #8b5cff); -webkit-background-clip: text; background-clip: text; color: transparent; }\nbutton { padding: 10px 18px; border: 0; border-radius: 10px; background: #4f46e5; color: white; font-weight: 600; cursor: pointer; }"
 },
 {
  "name": "script.js",
  "content": "let clicks = 0;\ndocument.getElementById('btn').addEventListener('click', () => {\n  clicks++;\n  console.log('Button clicked', clicks, 'times');\n});"
 }
];

export const SAMPLES: Sample[] = [
  ...[
 {
  "id": "s-clock",
  "title": "Neon clock",
  "author": "UCP Team",
  "tags": [
   "JS",
   "CSS"
  ],
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Neon Clock</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <div class=\"clock\" id=\"clock\">00:00:00</div>\n  <div class=\"date\" id=\"date\"></div>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "body{margin:0;min-height:100vh;display:grid;place-content:center;text-align:center;background:#05010f;font-family:monospace}\n.clock{font-size:clamp(2.5rem,12vw,6rem);color:#c4b5fd;text-shadow:0 0 12px #8b5cf6,0 0 40px #6d28d9}\n.date{color:#67e8f9;letter-spacing:.2em;margin-top:8px}"
   },
   {
    "name": "script.js",
    "content": "function tick(){const d=new Date();document.getElementById('clock').textContent=d.toLocaleTimeString('en-GB');document.getElementById('date').textContent=d.toDateString().toUpperCase();}\ntick();setInterval(tick,1000);"
   }
  ]
 },
 {
  "id": "s-todo",
  "title": "To-do list",
  "author": "UCP Team",
  "tags": [
   "JS",
   "DOM"
  ],
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>To-do</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <main><h1>My tasks</h1><form id=\"f\"><input id=\"i\" placeholder=\"Add a task…\" aria-label=\"New task\"><button>Add</button></form><ul id=\"list\"></ul><p id=\"left\"></p></main>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "body{font-family:system-ui;background:#eef2ff;display:grid;place-items:start center;padding:40px 16px;margin:0}\nmain{width:min(420px,100%);background:#fff;border-radius:18px;padding:22px;box-shadow:0 20px 40px -24px #4338ca88}\nform{display:flex;gap:8px}input{flex:1;padding:10px;border-radius:10px;border:1px solid #c7d2fe;font-size:16px}\nbutton{padding:10px 14px;border:0;border-radius:10px;background:#4f46e5;color:#fff;cursor:pointer}\nli{list-style:none;padding:10px;border-bottom:1px solid #eef2ff;display:flex;gap:10px;align-items:center}ul{padding:0}.done span{text-decoration:line-through;color:#94a3b8}"
   },
   {
    "name": "script.js",
    "content": "let tasks=[{t:'Learn HTML',d:true},{t:'Build a project',d:false}];\nconst list=document.getElementById('list');\nfunction render(){list.innerHTML='';tasks.forEach((x,i)=>{const li=document.createElement('li');li.className=x.d?'done':'';li.innerHTML='<input type=\"checkbox\" '+(x.d?'checked':'')+'><span></span>';li.querySelector('span').textContent=x.t;li.querySelector('input').onchange=()=>{x.d=!x.d;render()};list.appendChild(li)});document.getElementById('left').textContent=tasks.filter(x=>!x.d).length+' left';}\ndocument.getElementById('f').onsubmit=e=>{e.preventDefault();const v=document.getElementById('i').value.trim();if(v){tasks.push({t:v,d:false});document.getElementById('i').value='';render()}};\nrender();"
   }
  ]
 },
 {
  "id": "s-palette",
  "title": "Color palette generator",
  "author": "UCP Team",
  "tags": [
   "JS",
   "Design"
  ],
  "files": [
   {
    "name": "index.html",
    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Palette</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <h1>Palette generator</h1><div id=\"pal\" class=\"pal\"></div><button id=\"gen\">Generate (space)</button>\n  <script src=\"script.js\"></script>\n</body>\n</html>"
   },
   {
    "name": "style.css",
    "content": "body{font-family:system-ui;text-align:center;margin:0;padding:30px 16px;background:#111;color:#fff}\n.pal{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:20px auto;max-width:700px}\n.sw{height:160px;border-radius:14px;display:flex;align-items:flex-end;justify-content:center;padding:8px;font:600 .8rem monospace;cursor:pointer}\nbutton{padding:12px 20px;border:0;border-radius:12px;background:#fff;color:#111;font-weight:700;cursor:pointer}"
   },
   {
    "name": "script.js",
    "content": "function gen(){const h=Math.floor(Math.random()*360);const pal=document.getElementById('pal');pal.innerHTML='';\nfor(let i=0;i<5;i++){const c='hsl('+((h+i*28)%360)+' 70% '+(35+i*10)+'%)';const d=document.createElement('div');d.className='sw';d.style.background=c;d.textContent=c;pal.appendChild(d);}console.log('New palette from hue',h);}\ndocument.getElementById('gen').onclick=gen;addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();gen()}});gen();"
   }
  ]
 }
],
  ...TEMPLATES.map((t) => ({ id: 't-' + t.id, title: t.name, author: 'UCP Team', tags: ['Template'], files: t.files })),
];
