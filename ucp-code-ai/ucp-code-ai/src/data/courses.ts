/* Course catalogue (generated from the shared content source). */
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Test = { name: string; expr?: string; re?: string };
export type Exercise = { type: 'html' | 'css' | 'js' | 'pattern'; prompt: string; starter: string; tests: Test[]; hints: string[]; solution: string; fixture?: string; async?: boolean };
export type Lesson = { id: string; title: string; level: Level; body: string; example: { lang: string; code: string; run?: boolean }; exercise: Exercise; quiz: { q: string; options: string[]; a: number; why: string }[] };
export type Course = { id: string; title: string; short: string; level: Level; color: string; desc: string; lessons: Lesson[] };
export type Daily = { title: string; prompt: string; starter: string; tests: Test[]; hints: string[] };

export const COURSES: Course[] = [
 {
  "id": "fundamentals",
  "title": "Programming Fundamentals",
  "short": "FUN",
  "level": "beginner",
  "color": "#22d3ee",
  "desc": "How computers follow instructions: variables, decisions, loops and functions, explained without jargon.",
  "lessons": [
   {
    "id": "fun-1",
    "title": "What is a program?",
    "level": "beginner",
    "body": "A **program** is a list of instructions a computer follows exactly, in order. Computers are fast but literal: they do what you wrote, not what you meant.\n\nEvery program does three things: it takes **input**, does **processing**, and produces **output**. A calculator app takes numbers (input), adds them (processing) and shows the result (output).\n\nIn JavaScript, `console.log()` is the simplest output. It prints a message to the console. Run the example and watch the console.",
    "example": {
     "lang": "js",
     "code": "// Output: print messages to the console\nconsole.log('Hello from UCP CODE AI!');\nconsole.log('2 + 3 =', 2 + 3);\n\n// Instructions run top to bottom\nconsole.log('Step 1');\nconsole.log('Step 2');"
    },
    "exercise": {
     "type": "js",
     "prompt": "Print the exact text `I can code` to the console using console.log.",
     "starter": "// Write your line below\n",
     "tests": [
      {
       "name": "Logs 'I can code'",
       "expr": "__logs.some(l => l.trim() === 'I can code')"
      }
     ],
     "hints": [
      "Use console.log( ... ) with the text inside quotes.",
      "console.log('I can code');"
     ],
     "solution": "console.log('I can code');"
    },
    "quiz": [
     {
      "q": "What are the three parts almost every program has?",
      "options": [
       "Input, processing, output",
       "HTML, CSS, JS",
       "Start, middle, end"
      ],
      "a": 0,
      "why": "Programs take input, process it, and produce output."
     },
     {
      "q": "Computers do…",
      "options": [
       "What you meant",
       "Exactly what you wrote",
       "Whatever is fastest"
      ],
      "a": 1,
      "why": "Computers follow instructions literally."
     }
    ]
   },
   {
    "id": "fun-2",
    "title": "Variables & data types",
    "level": "beginner",
    "body": "A **variable** is a labeled box that stores a value. In JavaScript, create one with `let` (can change) or `const` (stays the same).\n\nCommon **data types**: numbers (`42`), strings of text (`'hello'`), booleans (`true`/`false`), and arrays (lists like `[1, 2, 3]`).\n\nUse `typeof` to ask what type a value is.",
    "example": {
     "lang": "js",
     "code": "const name = 'Mariam';\nlet score = 10;\nscore = score + 5;\n\nconsole.log(name, 'has', score, 'points');\nconsole.log(typeof name, typeof score, typeof true);\n\nconst colors = ['red', 'green', 'blue'];\nconsole.log('First color:', colors[0]);"
    },
    "exercise": {
     "type": "js",
     "prompt": "Create a `const` named `city` with the value `'Dubai'` and a `let` named `year` equal to `2026`.",
     "starter": "// Create your variables\n",
     "tests": [
      {
       "name": "city is 'Dubai'",
       "expr": "typeof city !== 'undefined' && city === 'Dubai'"
      },
      {
       "name": "year is 2026",
       "expr": "typeof year !== 'undefined' && year === 2026"
      }
     ],
     "hints": [
      "Strings need quotes; numbers don't.",
      "const city = 'Dubai'; then let year = ..."
     ],
     "solution": "const city = 'Dubai';\nlet year = 2026;"
    },
    "quiz": [
     {
      "q": "Which keyword makes a variable that can't be reassigned?",
      "options": [
       "let",
       "const",
       "var"
      ],
      "a": 1,
      "why": "const bindings can't be reassigned."
     },
     {
      "q": "What is typeof 'hello'?",
      "options": [
       "text",
       "string",
       "char"
      ],
      "a": 1,
      "why": "Text values are strings."
     }
    ]
   },
   {
    "id": "fun-3",
    "title": "Decisions & loops",
    "level": "beginner",
    "body": "**if / else** lets a program choose: run this code only when a condition is true.\n\nA **loop** repeats code. A `for` loop counts: start, condition, step. Loops save you from writing the same line 100 times.\n\nComparison operators: `===` equal, `!==` not equal, `>`, `<`, `>=`, `<=`.",
    "example": {
     "lang": "js",
     "code": "const temp = 38;\nif (temp > 35) {\n  console.log('Hot day: stay hydrated!');\n} else {\n  console.log('Nice weather.');\n}\n\nfor (let i = 1; i <= 5; i++) {\n  console.log('Lap', i);\n}"
    },
    "exercise": {
     "type": "js",
     "prompt": "Use a for loop to log the numbers 1 to 3, each on its own line.",
     "starter": "for (let i = 1; /* condition */; i++) {\n  \n}\n",
     "tests": [
      {
       "name": "Logs 1, 2, 3 in order",
       "expr": "JSON.stringify(__logs.map(s=>s.trim())) === JSON.stringify(['1','2','3'])"
      }
     ],
     "hints": [
      "The loop should continue while i <= 3.",
      "Inside the loop: console.log(i);"
     ],
     "solution": "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}"
    },
    "quiz": [
     {
      "q": "How many times does `for (let i=0; i<4; i++)` run?",
      "options": [
       "3",
       "4",
       "5"
      ],
      "a": 1,
      "why": "i = 0, 1, 2, 3 → four times."
     }
    ]
   }
  ]
 },
 {
  "id": "html",
  "title": "HTML Foundations",
  "short": "HTML",
  "level": "beginner",
  "color": "#f97316",
  "desc": "Structure web pages with headings, paragraphs, links, images, lists and forms.",
  "lessons": [
   {
    "id": "html-1",
    "title": "Your first web page",
    "level": "beginner",
    "body": "HTML describes the **structure** of a page using **tags**. Most tags come in pairs: `<p>` opens a paragraph and `</p>` closes it.\n\nHeadings go from `<h1>` (most important) to `<h6>`. Use one `<h1>` per page for the main title.\n\nEdit the example and press Run to see your changes instantly.",
    "example": {
     "lang": "html",
     "code": "<h1>Hello, world!</h1>\n<p>This is my first web page.</p>\n<h2>About me</h2>\n<p>I am learning to code with <strong>UCP CODE AI</strong>.</p>"
    },
    "exercise": {
     "type": "html",
     "prompt": "Create an `<h1>` with any title and a `<p>` paragraph below it.",
     "starter": "<!-- Write your HTML here -->\n",
     "tests": [
      {
       "name": "Has an h1 with text",
       "expr": "!!document.querySelector('h1') && document.querySelector('h1').textContent.trim().length > 0"
      },
      {
       "name": "Has a paragraph",
       "expr": "!!document.querySelector('p') && document.querySelector('p').textContent.trim().length > 0"
      }
     ],
     "hints": [
      "Tags open with <tag> and close with </tag>.",
      "<h1>My page</h1> then <p>Some text</p>"
     ],
     "solution": "<h1>My Page</h1>\n<p>Welcome to my page.</p>"
    },
    "quiz": [
     {
      "q": "Which tag is the most important heading?",
      "options": [
       "<h6>",
       "<head>",
       "<h1>"
      ],
      "a": 2,
      "why": "<h1> is the top-level heading."
     }
    ]
   },
   {
    "id": "html-2",
    "title": "Links, images & lists",
    "level": "beginner",
    "body": "Links use `<a href=\"...\">`. Images use `<img src=\"...\" alt=\"...\">`. The `alt` text describes the image for screen readers, so always include it.\n\nLists: `<ul>` makes bullet points and `<ol>` makes numbered lists. Each item is an `<li>`.",
    "example": {
     "lang": "html",
     "code": "<h2>My favorite tools</h2>\n<ul>\n  <li>Code editor</li>\n  <li>Browser</li>\n  <li>AI tutor</li>\n</ul>\n<ol>\n  <li>Learn</li>\n  <li>Build</li>\n  <li>Share</li>\n</ol>\n<a href=\"https://developer.mozilla.org\">Read the MDN docs</a>"
    },
    "exercise": {
     "type": "html",
     "prompt": "Make an unordered list (`<ul>`) with at least 3 items.",
     "starter": "<ul>\n  \n</ul>\n",
     "tests": [
      {
       "name": "Has a <ul>",
       "expr": "!!document.querySelector('ul')"
      },
      {
       "name": "At least 3 <li> items",
       "expr": "document.querySelectorAll('ul > li').length >= 3"
      }
     ],
     "hints": [
      "Each item is <li>text</li> inside the <ul>."
     ],
     "solution": "<ul>\n  <li>One</li>\n  <li>Two</li>\n  <li>Three</li>\n</ul>"
    },
    "quiz": [
     {
      "q": "Why should images have alt text?",
      "options": [
       "It makes them load faster",
       "It describes the image for people using screen readers",
       "It is required for the image to appear"
      ],
      "a": 1,
      "why": "alt text is essential for accessibility."
     }
    ]
   },
   {
    "id": "html-3",
    "title": "Forms & semantic HTML",
    "level": "intermediate",
    "body": "**Semantic** tags describe meaning: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`. They help search engines and assistive technology understand your page.\n\nForms collect input. Pair each `<input>` with a `<label>` so it's accessible. Clicking the label focuses the input.",
    "example": {
     "lang": "html",
     "code": "<main>\n  <h1>Join the club</h1>\n  <form onsubmit=\"event.preventDefault(); out.textContent = 'Thanks, ' + nm.value + '!'\">\n    <label for=\"nm\">Your name</label>\n    <input id=\"nm\" required>\n    <button>Join</button>\n  </form>\n  <p id=\"out\"></p>\n</main>"
    },
    "exercise": {
     "type": "html",
     "prompt": "Build a form with a `<label>` connected (via `for`) to an `<input>` that has a matching `id`, plus a `<button>`.",
     "starter": "<form>\n  \n</form>\n",
     "tests": [
      {
       "name": "Has a form with a button",
       "expr": "!!document.querySelector('form button')"
      },
      {
       "name": "Label 'for' matches an input id",
       "expr": "[...document.querySelectorAll('label[for]')].some(l => document.getElementById(l.htmlFor) && document.getElementById(l.htmlFor).tagName === 'INPUT')"
      }
     ],
     "hints": [
      "<label for=\"email\">Email</label>",
      "The input needs id=\"email\" to match."
     ],
     "solution": "<form>\n  <label for=\"email\">Email</label>\n  <input id=\"email\" type=\"email\">\n  <button>Send</button>\n</form>"
    },
    "quiz": [
     {
      "q": "Which of these is a semantic tag?",
      "options": [
       "<div>",
       "<span>",
       "<nav>"
      ],
      "a": 2,
      "why": "<nav> describes navigation; div and span carry no meaning."
     }
    ]
   }
  ]
 },
 {
  "id": "css",
  "title": "CSS Styling",
  "short": "CSS",
  "level": "beginner",
  "color": "#3d8bff",
  "desc": "Colors, spacing, typography, Flexbox and responsive layouts.",
  "lessons": [
   {
    "id": "css-1",
    "title": "Selectors, colors & the box model",
    "level": "beginner",
    "body": "CSS rules have a **selector** and **declarations**: `h1 { color: tomato; }`.\n\nEvery element is a box: **content**, **padding** (inside space), **border**, and **margin** (outside space).",
    "example": {
     "lang": "html",
     "code": "<style>\n  body { font-family: system-ui; background: #0b1020; color: white; padding: 20px; }\n  .card { background: #1d2a55; padding: 20px; border-radius: 14px; border: 2px solid #3d8bff; }\n  h2 { color: #8b5cff; margin-top: 0; }\n</style>\n<div class=\"card\">\n  <h2>Styled card</h2>\n  <p>Padding, border and radius make it feel like a card.</p>\n</div>"
    },
    "exercise": {
     "type": "css",
     "fixture": "<h1 class=\"title\">Hello</h1><p class=\"note\">Note</p>",
     "prompt": "Fixture HTML: `<h1 class=\"title\">` and `<p class=\"note\">`. Make `.title` color **rgb(255, 0, 0)** (red) and give `.note` **20px** of padding.",
     "starter": ".title {\n  \n}\n\n.note {\n  \n}\n",
     "tests": [
      {
       "name": ".title is red",
       "expr": "getComputedStyle(document.querySelector('.title')).color === 'rgb(255, 0, 0)'"
      },
      {
       "name": ".note has 20px padding",
       "expr": "getComputedStyle(document.querySelector('.note')).paddingTop === '20px'"
      }
     ],
     "hints": [
      "color: red; works for the title.",
      "padding: 20px; on .note"
     ],
     "solution": ".title { color: red; }\n.note { padding: 20px; }"
    },
    "quiz": [
     {
      "q": "Which property adds space INSIDE an element's border?",
      "options": [
       "margin",
       "padding",
       "gap"
      ],
      "a": 1,
      "why": "Padding is inside the border; margin is outside."
     }
    ]
   },
   {
    "id": "css-2",
    "title": "Flexbox layouts",
    "level": "intermediate",
    "body": "`display: flex` lines children up in a row (or column). `justify-content` controls the main axis; `align-items` controls the cross axis; `gap` adds space between items.\n\nFlexbox is the quickest way to center anything: `display:flex; justify-content:center; align-items:center;`.",
    "example": {
     "lang": "html",
     "code": "<style>\n  .row { display: flex; gap: 12px; justify-content: center; align-items: center; height: 160px; background: #eef2ff; border-radius: 12px; }\n  .box { width: 60px; height: 60px; border-radius: 12px; background: linear-gradient(135deg,#3d8bff,#8b5cff); }\n</style>\n<div class=\"row\">\n  <div class=\"box\"></div><div class=\"box\"></div><div class=\"box\"></div>\n</div>"
    },
    "exercise": {
     "type": "css",
     "fixture": "<div class=\"bar\"><span>A</span><span>B</span></div>",
     "prompt": "Make `.bar` a flex container with `justify-content: space-between`.",
     "starter": ".bar {\n  \n}\n",
     "tests": [
      {
       "name": ".bar is flex",
       "expr": "getComputedStyle(document.querySelector('.bar')).display === 'flex'"
      },
      {
       "name": "space-between",
       "expr": "getComputedStyle(document.querySelector('.bar')).justifyContent === 'space-between'"
      }
     ],
     "hints": [
      "display: flex;",
      "justify-content: space-between;"
     ],
     "solution": ".bar {\n  display: flex;\n  justify-content: space-between;\n}"
    },
    "quiz": [
     {
      "q": "Which property adds space between flex items?",
      "options": [
       "gap",
       "spacing",
       "margin-between"
      ],
      "a": 0,
      "why": "gap works for flex and grid."
     }
    ]
   },
   {
    "id": "css-3",
    "title": "Responsive design",
    "level": "advanced",
    "body": "**Media queries** apply styles at certain screen sizes: `@media (min-width: 700px) { ... }`.\n\nDesign **mobile-first**: write base styles for phones, then add media queries for larger screens. Use relative units (`rem`, `%`, `vw`) and `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` for fluid grids.",
    "example": {
     "lang": "html",
     "code": "<style>\n  .grid { display: grid; gap: 10px; grid-template-columns: 1fr; }\n  @media (min-width: 400px) { .grid { grid-template-columns: 1fr 1fr; } }\n  .grid div { background: #c7d2fe; padding: 20px; border-radius: 10px; text-align: center; }\n</style>\n<p>Resize the preview to see the grid change.</p>\n<div class=\"grid\"><div>1</div><div>2</div><div>3</div><div>4</div></div>"
    },
    "exercise": {
     "type": "css",
     "fixture": "<div class=\"cards\"><div>1</div><div>2</div></div>",
     "prompt": "Make `.cards` a CSS grid with a `gap` of **16px**.",
     "starter": ".cards {\n  \n}\n",
     "tests": [
      {
       "name": ".cards is grid",
       "expr": "getComputedStyle(document.querySelector('.cards')).display === 'grid'"
      },
      {
       "name": "gap is 16px",
       "expr": "getComputedStyle(document.querySelector('.cards')).rowGap === '16px'"
      }
     ],
     "hints": [
      "display: grid;",
      "gap: 16px;"
     ],
     "solution": ".cards {\n  display: grid;\n  gap: 16px;\n}"
    },
    "quiz": [
     {
      "q": "Mobile-first means…",
      "options": [
       "Base styles target small screens; media queries add larger layouts",
       "Only phones are supported",
       "Desktop styles first, then shrink"
      ],
      "a": 0,
      "why": "Start small, enhance upward."
     }
    ]
   }
  ]
 },
 {
  "id": "javascript",
  "title": "JavaScript Essentials",
  "short": "JS",
  "level": "intermediate",
  "color": "#facc15",
  "desc": "Functions, arrays, objects, the DOM and events. Make pages interactive.",
  "lessons": [
   {
    "id": "js-1",
    "title": "Functions",
    "level": "beginner",
    "body": "A **function** is a reusable block of code. It takes **parameters** and can **return** a value.\n\nArrow functions are a shorter syntax: `const double = n => n * 2;`.",
    "example": {
     "lang": "js",
     "code": "function greet(name) {\n  return 'Hello, ' + name + '!';\n}\nconst square = n => n * n;\n\nconsole.log(greet('Omar'));\nconsole.log(square(7));"
    },
    "exercise": {
     "type": "js",
     "prompt": "Write a function `add(a, b)` that returns the sum of two numbers.",
     "starter": "function add(a, b) {\n  // your code\n}\n",
     "tests": [
      {
       "name": "add(2, 3) === 5",
       "expr": "add(2,3) === 5"
      },
      {
       "name": "add(-1, 1) === 0",
       "expr": "add(-1,1) === 0"
      }
     ],
     "hints": [
      "Use the return keyword.",
      "return a + b;"
     ],
     "solution": "function add(a, b) {\n  return a + b;\n}"
    },
    "quiz": [
     {
      "q": "What does a function without return give back?",
      "options": [
       "0",
       "null",
       "undefined"
      ],
      "a": 2,
      "why": "Functions return undefined by default."
     }
    ]
   },
   {
    "id": "js-2",
    "title": "Arrays & objects",
    "level": "intermediate",
    "body": "Arrays hold ordered lists. Useful methods: `map` (transform each item), `filter` (keep some), `reduce` (combine into one value).\n\nObjects hold named properties: `{ name: 'Sara', age: 14 }`. Access with dot notation: `user.name`.",
    "example": {
     "lang": "js",
     "code": "const scores = [72, 95, 88, 40];\nconst passed = scores.filter(s => s >= 50);\nconst curved = scores.map(s => s + 5);\nconst total = scores.reduce((sum, s) => sum + s, 0);\nconsole.log({ passed, curved, total });\n\nconst user = { name: 'Sara', level: 3 };\nconsole.log(user.name + ' is level ' + user.level);"
    },
    "exercise": {
     "type": "js",
     "prompt": "Write `evens(arr)` that returns only the even numbers from an array.",
     "starter": "function evens(arr) {\n  \n}\n",
     "tests": [
      {
       "name": "evens([1,2,3,4]) → [2,4]",
       "expr": "JSON.stringify(evens([1,2,3,4])) === '[2,4]'"
      },
      {
       "name": "evens([]) → []",
       "expr": "JSON.stringify(evens([])) === '[]'"
      }
     ],
     "hints": [
      "Array.filter keeps items where the callback returns true.",
      "n % 2 === 0 tests for even."
     ],
     "solution": "function evens(arr) {\n  return arr.filter(n => n % 2 === 0);\n}"
    },
    "quiz": [
     {
      "q": "Which method transforms every item into a new array?",
      "options": [
       "filter",
       "map",
       "find"
      ],
      "a": 1,
      "why": "map returns a new array with each item transformed."
     }
    ]
   },
   {
    "id": "js-3",
    "title": "The DOM & events",
    "level": "intermediate",
    "body": "The **DOM** is the page as JavaScript objects. Select elements with `document.querySelector()` and change them with `.textContent`, `.style`, or `.classList`.\n\n**Events** react to the user: `button.addEventListener('click', () => { ... })`.",
    "example": {
     "lang": "html",
     "code": "<button id=\"btn\">Clicked 0 times</button>\n<script>\n  let count = 0;\n  const btn = document.querySelector('#btn');\n  btn.addEventListener('click', () => {\n    count++;\n    btn.textContent = 'Clicked ' + count + ' times';\n  });\n</script>"
    },
    "exercise": {
     "type": "html",
     "prompt": "Create a `<button id=\"go\">` and a `<p id=\"msg\">`. When the button is clicked, set the paragraph text to `Hi!`.",
     "starter": "<button id=\"go\">Go</button>\n<p id=\"msg\"></p>\n<script>\n  // add a click listener\n</script>\n",
     "tests": [
      {
       "name": "Clicking sets #msg to 'Hi!'",
       "expr": "(document.getElementById('go').click(), (document.getElementById('msg')||{}).textContent === 'Hi!')"
      }
     ],
     "hints": [
      "document.getElementById('go').addEventListener('click', ...)",
      "Inside: document.getElementById('msg').textContent = 'Hi!';"
     ],
     "solution": "<button id=\"go\">Go</button>\n<p id=\"msg\"></p>\n<script>\n  document.getElementById('go').addEventListener('click', () => {\n    document.getElementById('msg').textContent = 'Hi!';\n  });\n</script>"
    },
    "quiz": [
     {
      "q": "Which method attaches an event handler?",
      "options": [
       "onEvent()",
       "addEventListener()",
       "listen()"
      ],
      "a": 1,
      "why": "addEventListener(type, handler)."
     }
    ]
   },
   {
    "id": "js-4",
    "title": "Async JavaScript & promises",
    "level": "advanced",
    "body": "Some work takes time (network, timers). **Promises** represent a future value. `async` functions let you `await` them in readable, top-to-bottom code.\n\nAlways handle failures with `try / catch` around `await`.",
    "example": {
     "lang": "js",
     "code": "const wait = ms => new Promise(res => setTimeout(res, ms));\n\nasync function countdown() {\n  for (let i = 3; i > 0; i--) {\n    console.log(i);\n    await wait(400);\n  }\n  console.log('Liftoff!');\n}\ncountdown();"
    },
    "exercise": {
     "type": "js",
     "async": true,
     "prompt": "Write `async function getDouble(n)` that waits 50ms (use the provided `wait`) and then returns `n * 2`.",
     "starter": "const wait = ms => new Promise(r => setTimeout(r, ms));\n\nasync function getDouble(n) {\n  \n}\n",
     "tests": [
      {
       "name": "await getDouble(4) === 8",
       "expr": "(await getDouble(4)) === 8"
      },
      {
       "name": "returns a Promise",
       "expr": "getDouble(1) instanceof Promise"
      }
     ],
     "hints": [
      "await wait(50); first.",
      "then return n * 2;"
     ],
     "solution": "const wait = ms => new Promise(r => setTimeout(r, ms));\n\nasync function getDouble(n) {\n  await wait(50);\n  return n * 2;\n}"
    },
    "quiz": [
     {
      "q": "What does an async function always return?",
      "options": [
       "A Promise",
       "undefined",
       "A callback"
      ],
      "a": 0,
      "why": "async functions wrap their result in a Promise."
     }
    ]
   }
  ]
 },
 {
  "id": "typescript",
  "title": "TypeScript",
  "short": "TS",
  "level": "intermediate",
  "color": "#3178c6",
  "desc": "Add types to JavaScript to catch bugs before they run.",
  "lessons": [
   {
    "id": "ts-1",
    "title": "Types & interfaces",
    "level": "intermediate",
    "body": "TypeScript is JavaScript with **types**. You annotate variables and parameters: `let age: number = 14;`.\n\nAn **interface** describes the shape of an object. The compiler warns when you use it wrongly, before your code ever runs.\n\nTypeScript needs a compiler, so here you read and edit TS and the checker looks for the right syntax. Ask the AI for a deeper review.",
    "example": {
     "lang": "ts",
     "run": false,
     "code": "interface Student {\n  name: string;\n  grade: number;\n  clubs?: string[]; // optional\n}\n\nfunction intro(s: Student): string {\n  return `${s.name} is in grade ${s.grade}`;\n}\n\nconst s: Student = { name: 'Hamdan', grade: 9 };\nconsole.log(intro(s));"
    },
    "exercise": {
     "type": "pattern",
     "prompt": "Write an `interface Product` with `name: string` and `price: number`.",
     "starter": "interface Product {\n  \n}\n",
     "tests": [
      {
       "name": "Declares interface Product",
       "re": "interface\\s+Product\\s*\\{"
      },
      {
       "name": "name: string",
       "re": "name\\s*:\\s*string"
      },
      {
       "name": "price: number",
       "re": "price\\s*:\\s*number"
      }
     ],
     "hints": [
      "Each property is name: type;"
     ],
     "solution": "interface Product {\n  name: string;\n  price: number;\n}"
    },
    "quiz": [
     {
      "q": "When does TypeScript catch type errors?",
      "options": [
       "At compile time",
       "Only at runtime",
       "Never"
      ],
      "a": 0,
      "why": "The compiler checks types before code runs."
     }
    ]
   },
   {
    "id": "ts-2",
    "title": "Generics & union types",
    "level": "advanced",
    "body": "A **union** allows several types: `let id: string | number;`.\n\n**Generics** let a function work with any type while keeping type safety: `function first<T>(arr: T[]): T { return arr[0]; }`.",
    "example": {
     "lang": "ts",
     "run": false,
     "code": "type Status = 'idle' | 'loading' | 'done';\n\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst n = first([1, 2, 3]);      // number | undefined\nconst w = first(['a', 'b']);     // string | undefined\nlet state: Status = 'idle';"
    },
    "exercise": {
     "type": "pattern",
     "prompt": "Write a generic function `last<T>(items: T[]): T` that returns the last item.",
     "starter": "function last",
     "tests": [
      {
       "name": "Generic signature last<T>",
       "re": "function\\s+last\\s*<\\s*T\\s*>"
      },
      {
       "name": "Parameter items: T[]",
       "re": "items\\s*:\\s*T\\s*\\[\\s*\\]"
      },
      {
       "name": "Returns last element",
       "re": "return\\s+items\\s*\\[\\s*items\\.length\\s*-\\s*1\\s*\\]|return\\s+items\\.at\\(\\s*-1\\s*\\)"
      }
     ],
     "hints": [
      "function last<T>(items: T[]): T { ... }",
      "return items[items.length - 1];"
     ],
     "solution": "function last<T>(items: T[]): T {\n  return items[items.length - 1];\n}"
    },
    "quiz": [
     {
      "q": "`string | number` is a…",
      "options": [
       "Generic",
       "Union type",
       "Interface"
      ],
      "a": 1,
      "why": "The | operator creates a union."
     }
    ]
   }
  ]
 },
 {
  "id": "python",
  "title": "Python",
  "short": "PY",
  "level": "beginner",
  "color": "#34d399",
  "desc": "Readable syntax for automation, data and AI. Guided learning with AI review.",
  "lessons": [
   {
    "id": "py-1",
    "title": "Python basics",
    "level": "beginner",
    "body": "Python uses **indentation** instead of braces to group code. `print()` shows output.\n\nVariables need no keyword: `name = 'Fatima'`. f-strings insert values into text: `f'Hi {name}'`.\n\nPython runs on a server or your computer, not in this browser. Use the AI review to check your work.",
    "example": {
     "lang": "py",
     "run": false,
     "code": "name = 'Fatima'\nage = 15\nprint(f'{name} is {age} years old')\n\nfor i in range(3):\n    print('Loop', i)\n\nif age >= 13:\n    print('Teen coder!')"
    },
    "exercise": {
     "type": "pattern",
     "prompt": "Write a Python `for` loop using `range(5)` that prints each number.",
     "starter": "# your loop\n",
     "tests": [
      {
       "name": "Uses for … in range(5)",
       "re": "for\\s+\\w+\\s+in\\s+range\\(\\s*5\\s*\\)\\s*:"
      },
      {
       "name": "Prints inside the loop (indented)",
       "re": "\\n[ \\t]+print\\("
      }
     ],
     "hints": [
      "for i in range(5):",
      "Indent the print(i) line with 4 spaces."
     ],
     "solution": "for i in range(5):\n    print(i)"
    },
    "quiz": [
     {
      "q": "How does Python group the body of a loop?",
      "options": [
       "Curly braces",
       "Indentation",
       "Semicolons"
      ],
      "a": 1,
      "why": "Indentation defines blocks in Python."
     }
    ]
   },
   {
    "id": "py-2",
    "title": "Functions & lists",
    "level": "intermediate",
    "body": "Define functions with `def`. Lists are written `[1, 2, 3]` and support **list comprehensions**: `[n * 2 for n in nums]`.",
    "example": {
     "lang": "py",
     "run": false,
     "code": "def average(nums):\n    return sum(nums) / len(nums)\n\nscores = [90, 75, 88]\nprint(average(scores))\n\nsquares = [n * n for n in range(5)]\nprint(squares)"
    },
    "exercise": {
     "type": "pattern",
     "prompt": "Write `def double_all(nums):` that returns a list comprehension doubling every number.",
     "starter": "def double_all(nums):\n    ",
     "tests": [
      {
       "name": "Defines double_all(nums)",
       "re": "def\\s+double_all\\s*\\(\\s*nums\\s*\\)\\s*:"
      },
      {
       "name": "Returns a list comprehension",
       "re": "return\\s*\\[.+for\\s+\\w+\\s+in\\s+nums\\s*\\]"
      }
     ],
     "hints": [
      "return [ ... for n in nums]",
      "return [n * 2 for n in nums]"
     ],
     "solution": "def double_all(nums):\n    return [n * 2 for n in nums]"
    },
    "quiz": [
     {
      "q": "`[n*2 for n in [1,2]]` gives…",
      "options": [
       "[2, 4]",
       "[1, 2, 1, 2]",
       "4"
      ],
      "a": 0,
      "why": "Each item is doubled."
     }
    ]
   }
  ]
 },
 {
  "id": "react",
  "title": "React",
  "short": "RE",
  "level": "advanced",
  "color": "#61dafb",
  "desc": "Components, props and state. Build modern interfaces.",
  "lessons": [
   {
    "id": "re-1",
    "title": "Components & JSX",
    "level": "intermediate",
    "body": "React builds UIs from **components**: functions that return **JSX** (HTML-like syntax in JavaScript).\n\nProps pass data into components, like function arguments: `<Greeting name=\"Ali\" />`.\n\nThe example runs React inside the sandboxed preview (it loads React from a CDN).",
    "example": {
     "lang": "react",
     "code": "function Greeting({ name }) {\n  return <h2>Hello, {name}! 👋</h2>;\n}\n\nfunction App() {\n  return (\n    <div style={{ fontFamily: 'system-ui', padding: 16 }}>\n      <Greeting name=\"Ali\" />\n      <Greeting name=\"Noura\" />\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />);"
    },
    "exercise": {
     "type": "pattern",
     "prompt": "Write a component `function Badge({ label })` that returns a `<span>` showing the label.",
     "starter": "function Badge({ label }) {\n  \n}\n",
     "tests": [
      {
       "name": "Declares Badge with { label }",
       "re": "function\\s+Badge\\s*\\(\\s*\\{\\s*label\\s*\\}\\s*\\)"
      },
      {
       "name": "Returns a <span> with {label}",
       "re": "return\\s*\\(?\\s*<span[^>]*>\\s*\\{\\s*label\\s*\\}\\s*</span>"
      }
     ],
     "hints": [
      "return <span>{label}</span>;"
     ],
     "solution": "function Badge({ label }) {\n  return <span>{label}</span>;\n}"
    },
    "quiz": [
     {
      "q": "What are props?",
      "options": [
       "Inputs passed to a component",
       "CSS properties",
       "Global variables"
      ],
      "a": 0,
      "why": "Props are a component's inputs."
     }
    ]
   },
   {
    "id": "re-2",
    "title": "State with useState",
    "level": "advanced",
    "body": "**State** is data that changes over time. `const [count, setCount] = React.useState(0);` gives you the value and a setter. Calling the setter re-renders the component.",
    "example": {
     "lang": "react",
     "code": "function Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)} style={{ fontSize: 20, padding: '10px 18px' }}>\n      Clicked {count} times\n    </button>\n  );\n}\nReactDOM.createRoot(document.getElementById('root')).render(<Counter />);"
    },
    "exercise": {
     "type": "pattern",
     "prompt": "Inside a component, create state `const [on, setOn] = useState(false)` (or React.useState) and a button whose onClick toggles it with `setOn(!on)`.",
     "starter": "function Toggle() {\n  \n}\n",
     "tests": [
      {
       "name": "Declares [on, setOn] state",
       "re": "const\\s*\\[\\s*on\\s*,\\s*setOn\\s*\\]\\s*=\\s*(React\\.)?useState\\(\\s*false\\s*\\)"
      },
      {
       "name": "Toggles with setOn(!on)",
       "re": "setOn\\(\\s*!\\s*on\\s*\\)"
      }
     ],
     "hints": [
      "const [on, setOn] = React.useState(false);",
      "<button onClick={() => setOn(!on)}>{on ? 'ON' : 'OFF'}</button>"
     ],
     "solution": "function Toggle() {\n  const [on, setOn] = React.useState(false);\n  return <button onClick={() => setOn(!on)}>{on ? 'ON' : 'OFF'}</button>;\n}"
    },
    "quiz": [
     {
      "q": "What happens when you call a state setter?",
      "options": [
       "Nothing",
       "The component re-renders",
       "The page reloads"
      ],
      "a": 1,
      "why": "State updates trigger a re-render."
     }
    ]
   }
  ]
 }
];

export const DAILY: Daily[] = [
 {
  "title": "Reverse a string",
  "prompt": "Write `reverse(s)` that returns the string backwards.",
  "starter": "function reverse(s) {\n  \n}\n",
  "tests": [
   {
    "name": "reverse('abc') → 'cba'",
    "expr": "reverse('abc')==='cba'"
   },
   {
    "name": "reverse('') → ''",
    "expr": "reverse('')===''"
   }
  ],
  "hints": [
   "s.split('') makes an array of characters.",
   "s.split('').reverse().join('')"
  ]
 },
 {
  "title": "Find the maximum",
  "prompt": "Write `max(nums)` returning the largest number (without Math.max if you can!).",
  "starter": "function max(nums) {\n  \n}\n",
  "tests": [
   {
    "name": "max([3,9,2]) → 9",
    "expr": "max([3,9,2])===9"
   },
   {
    "name": "max([-5,-2]) → -2",
    "expr": "max([-5,-2])===-2"
   }
  ],
  "hints": [
   "Start with the first item and compare in a loop."
  ]
 },
 {
  "title": "Count vowels",
  "prompt": "Write `vowels(s)` returning how many vowels (a,e,i,o,u) are in s (case-insensitive).",
  "starter": "function vowels(s) {\n  \n}\n",
  "tests": [
   {
    "name": "vowels('Hello') → 2",
    "expr": "vowels('Hello')===2"
   },
   {
    "name": "vowels('AEIOU') → 5",
    "expr": "vowels('AEIOU')===5"
   }
  ],
  "hints": [
   "Lowercase first.",
   "Check each char with 'aeiou'.includes(c)"
  ]
 },
 {
  "title": "FizzBuzz value",
  "prompt": "Write `fizz(n)`: return 'FizzBuzz' if divisible by 3 and 5, 'Fizz' by 3, 'Buzz' by 5, else the number as a string.",
  "starter": "function fizz(n) {\n  \n}\n",
  "tests": [
   {
    "name": "fizz(15)",
    "expr": "fizz(15)==='FizzBuzz'"
   },
   {
    "name": "fizz(9)",
    "expr": "fizz(9)==='Fizz'"
   },
   {
    "name": "fizz(10)",
    "expr": "fizz(10)==='Buzz'"
   },
   {
    "name": "fizz(7)",
    "expr": "fizz(7)==='7'"
   }
  ],
  "hints": [
   "Check the 15 case first.",
   "String(n) converts a number to text."
  ]
 },
 {
  "title": "Palindrome check",
  "prompt": "Write `isPal(s)` returning true if s reads the same backwards (ignore case).",
  "starter": "function isPal(s) {\n  \n}\n",
  "tests": [
   {
    "name": "isPal('Level')",
    "expr": "isPal('Level')===true"
   },
   {
    "name": "isPal('code')",
    "expr": "isPal('code')===false"
   }
  ],
  "hints": [
   "Lowercase, then compare with its reverse."
  ]
 },
 {
  "title": "Sum of array",
  "prompt": "Write `sum(nums)` that adds all numbers in an array.",
  "starter": "function sum(nums) {\n  \n}\n",
  "tests": [
   {
    "name": "sum([1,2,3]) → 6",
    "expr": "sum([1,2,3])===6"
   },
   {
    "name": "sum([]) → 0",
    "expr": "sum([])===0"
   }
  ],
  "hints": [
   "reduce((a, b) => a + b, 0)"
  ]
 },
 {
  "title": "Capitalize words",
  "prompt": "Write `title(s)` that capitalizes the first letter of every word.",
  "starter": "function title(s) {\n  \n}\n",
  "tests": [
   {
    "name": "title('hello world')",
    "expr": "title('hello world')==='Hello World'"
   }
  ],
  "hints": [
   "split(' '), map each word, join(' ')",
   "w[0].toUpperCase() + w.slice(1)"
  ]
 }
];

export function findLesson(id: string) {
  for (const course of COURSES) {
    const index = course.lessons.findIndex((l) => l.id === id);
    if (index > -1) return { course, lesson: course.lessons[index], index };
  }
  return null;
}
export const dailyForToday = () => DAILY[Math.floor(Date.now() / 864e5) % DAILY.length];
export const coursePct = (c: Course, done: Record<string, number>) => Math.round((100 * c.lessons.filter((l) => done[l.id]).length) / c.lessons.length);
