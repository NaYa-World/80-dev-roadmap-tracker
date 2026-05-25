// ─── DATA ─────────────────────────────────────────────────────────────────────
const FRONTEND_PHASES = [
  {
    title: "Phase 1 — Foundations", days: "Days 1–10", icon: "⬡", color: "#00d9a0", dim: "rgba(0,217,160,.1)", data: [
      {
        day: "Day 1", label: "How the web works", tasks: [
          { t: "Concept: How browsers render HTML/CSS/JS — request → response → DOM → paint", k: "concept" },
          { t: "Concept: HTTP vs HTTPS, status codes (200, 404, 500), REST basics", k: "concept" },
          { t: "Concept: DNS, CDN, hosting — what happens when you type a URL", k: "concept" },
          { t: "Code: Set up VS Code, install Live Server extension, create first HTML file", k: "code" },
          { t: "Quiz: What is the DOM? What does HTTP 404 mean? Explain GET vs POST", k: "quiz" },
        ]
      },
      {
        day: "Day 2", label: "HTML5 deep dive", tasks: [
          { t: "Concept: Semantic HTML — header, main, section, article, nav, footer", k: "concept" },
          { t: "Concept: Forms — input types, labels, required, form validation attributes", k: "concept" },
          { t: "Concept: Accessibility basics — alt text, ARIA roles, tab order", k: "concept" },
          { t: "Code: Build a fully semantic personal bio page with a contact form", k: "code" },
          { t: "Quiz: Why use semantic tags over divs? What is ARIA?", k: "quiz" },
        ]
      },
      {
        day: "Day 3", label: "CSS fundamentals", tasks: [
          { t: "Concept: Box model — margin, border, padding, content. display block/inline/inline-block", k: "concept" },
          { t: "Concept: Selectors — class, id, pseudo-class (:hover, :focus), specificity", k: "concept" },
          { t: "Concept: Positioning — static, relative, absolute, fixed, sticky", k: "concept" },
          { t: "Code: Style your Day 2 bio page with a card layout and a sticky nav", k: "code" },
          { t: "Quiz: Explain specificity. When would you use position:absolute vs fixed?", k: "quiz" },
        ]
      },
      {
        day: "Day 4", label: "CSS Flexbox", tasks: [
          { t: "Concept: Flexbox — flex-direction, justify-content, align-items, flex-wrap, gap", k: "concept" },
          { t: "Concept: flex-grow, flex-shrink, flex-basis — how children resize", k: "concept" },
          { t: "Code: Build a responsive navbar and a 3-column card grid using only flexbox", k: "code" },
          { t: "Code: Recreate the classic holy grail layout (header, sidebars, main, footer)", k: "code" },
          { t: "Quiz: Difference between justify-content and align-items? What does flex:1 mean?", k: "quiz" },
        ]
      },
      {
        day: "Day 5", label: "CSS Grid + Responsive", tasks: [
          { t: "Concept: CSS Grid — grid-template-columns, grid-area, auto-fit, minmax", k: "concept" },
          { t: "Concept: Media queries — mobile first, breakpoints, min-width vs max-width", k: "concept" },
          { t: "Concept: CSS custom properties (variables) — :root, var(--name)", k: "concept" },
          { t: "Code: Build a Pinterest-style masonry photo grid that collapses to 1 column on mobile", k: "code" },
          { t: "Quiz: When to use Grid vs Flexbox? What is mobile-first design?", k: "quiz" },
        ]
      },
      {
        day: "Day 6", label: "JavaScript fundamentals I", tasks: [
          { t: "Concept: Variables — var/let/const, scope (block vs function), hoisting", k: "concept" },
          { t: "Concept: Data types — string, number, boolean, null, undefined, object, array", k: "concept" },
          { t: "Concept: Functions — declaration vs expression vs arrow functions, return values", k: "concept" },
          { t: "Concept: Arrays — map, filter, reduce, find, forEach, spread operator", k: "concept" },
          { t: "Code: Write 15 array manipulation exercises (sort names, filter even numbers, etc.)", k: "code" },
          { t: "Quiz: Explain hoisting. Difference between null and undefined?", k: "quiz" },
        ]
      },
      {
        day: "Day 7", label: "JavaScript fundamentals II", tasks: [
          { t: "Concept: Objects — dot notation, destructuring, spread, Object.keys/values/entries", k: "concept" },
          { t: "Concept: Callbacks, Promises, async/await — the event loop explained", k: "concept" },
          { t: "Concept: Fetch API — GET and POST requests, handling JSON responses", k: "concept" },
          { t: "Code: Fetch data from JSONPlaceholder API and render it in a styled table", k: "code" },
          { t: "Quiz: What is the event loop? Rewrite a Promise chain using async/await", k: "quiz" },
        ]
      },
      {
        day: "Day 8", label: "DOM manipulation + Events", tasks: [
          { t: "Concept: querySelector, getElementById, createElement, appendChild, innerHTML vs textContent", k: "concept" },
          { t: "Concept: Event listeners — click, input, submit, keydown. Event bubbling and delegation", k: "concept" },
          { t: "Concept: localStorage — getItem, setItem, JSON.stringify/parse", k: "concept" },
          { t: "Code: Build a fully functional Todo app (add, delete, toggle done) with localStorage", k: "project" },
          { t: "Quiz: What is event delegation? Why avoid innerHTML for user input?", k: "quiz" },
        ]
      },
      {
        day: "Day 9", label: "Git and GitHub", tasks: [
          { t: "Concept: Git init, add, commit, status, log, diff — the local workflow", k: "concept" },
          { t: "Concept: Branching — checkout, merge, rebase, resolving conflicts", k: "concept" },
          { t: "Concept: GitHub — push, pull, clone, fork, pull requests, .gitignore", k: "concept" },
          { t: "Code: Push your Todo app to GitHub with a descriptive README", k: "code" },
          { t: "Quiz: What is a merge conflict? When would you rebase instead of merge?", k: "quiz" },
        ]
      },
      {
        day: "Day 10", label: "Review + Mini project", tasks: [
          { t: "Review: Revisit any Day 1-9 concept you felt shaky on", k: "concept" },
          { t: "Project: Build a Weather Dashboard — fetch OpenWeatherMap API, 5-day forecast, localStorage", k: "project" },
          { t: "Quiz: Explain async/await, event delegation, and the box model out loud", k: "quiz" },
          { t: "Code: Push Weather Dashboard to GitHub with README screenshots", k: "code" },
        ]
      },
    ]
  },
  {
    title: "Phase 2 — TypeScript", days: "Days 11–25", icon: "T", color: "#4fa8ff", dim: "rgba(79,168,255,.1)", data: [
      {
        day: "Day 11", label: "Why TypeScript exists", tasks: [
          { t: "Concept: Static vs dynamic typing — why TypeScript catches bugs JavaScript cannot", k: "concept" },
          { t: "Concept: Install TypeScript globally, tsconfig.json basics — target, strict, outDir", k: "concept" },
          { t: "Code: Convert your Day 8 Todo app from JS to TS — fix every type error", k: "code" },
          { t: "Quiz: What is a type annotation? What does strict mode enforce?", k: "quiz" },
        ]
      },
      {
        day: "Day 12", label: "Primitive types + type inference", tasks: [
          { t: "Concept: string, number, boolean, null, undefined, void, never, any, unknown", k: "concept" },
          { t: "Concept: Type inference — when TS figures out types automatically vs when you must annotate", k: "concept" },
          { t: "Concept: Union types (string | number), literal types", k: "concept" },
          { t: "Code: Write 20 typed functions covering all primitive types", k: "code" },
          { t: "Quiz: Difference between any and unknown? When would you use never?", k: "quiz" },
        ]
      },
      {
        day: "Day 13", label: "Interfaces and Type aliases", tasks: [
          { t: "Concept: interface — defining object shapes, optional properties, readonly", k: "concept" },
          { t: "Concept: type alias — when to use type vs interface", k: "concept" },
          { t: "Concept: Extending interfaces, intersection types", k: "concept" },
          { t: "Code: Model a User, Product, and Order system with interfaces and CRUD functions", k: "code" },
          { t: "Quiz: interface vs type — what can interface do that type cannot?", k: "quiz" },
        ]
      },
      {
        day: "Day 14", label: "Arrays, Tuples, Enums", tasks: [
          { t: "Concept: Typed arrays — string[], Array with number", k: "concept" },
          { t: "Concept: Tuples — fixed-length arrays with specific types at each position", k: "concept" },
          { t: "Concept: Enums — const enum vs regular enum, string enums", k: "concept" },
          { t: "Code: Build a typed shopping cart with Product array, CartItem tuples, and OrderStatus enum", k: "code" },
          { t: "Quiz: When to use a tuple over an array? Why prefer const enum?", k: "quiz" },
        ]
      },
      {
        day: "Day 15", label: "Functions in TypeScript", tasks: [
          { t: "Concept: Function type signatures, optional and default parameters", k: "concept" },
          { t: "Concept: Overloading — multiple function signatures for different argument types", k: "concept" },
          { t: "Concept: Type guards — typeof, instanceof, custom type predicates (is keyword)", k: "concept" },
          { t: "Code: Write a data-processing utility library with 10 fully typed functions", k: "code" },
          { t: "Quiz: What is a type guard? Implement a typed filter function", k: "quiz" },
        ]
      },
      {
        day: "Day 16", label: "Generics I", tasks: [
          { t: "Concept: Generic functions — T syntax, why generics exist", k: "concept" },
          { t: "Concept: Generic interfaces and type aliases", k: "concept" },
          { t: "Concept: Constraints — extends keyword, keyof constraint", k: "concept" },
          { t: "Code: Build a generic Stack and Queue data structure", k: "code" },
          { t: "Quiz: Rewrite Array.prototype.map with full TypeScript generics", k: "quiz" },
        ]
      },
      {
        day: "Day 17", label: "Generics II + Utility types", tasks: [
          { t: "Concept: Partial, Required, Readonly, Pick, Omit utility types", k: "concept" },
          { t: "Concept: Record, ReturnType, Parameters, NonNullable utility types", k: "concept" },
          { t: "Code: Build a typed API response handler using Partial, Omit, and Record", k: "code" },
          { t: "Quiz: What does Omit produce? When use Partial?", k: "quiz" },
        ]
      },
      {
        day: "Day 18", label: "Classes in TypeScript", tasks: [
          { t: "Concept: class syntax — constructor, properties, methods, access modifiers", k: "concept" },
          { t: "Concept: abstract classes vs interfaces, implements vs extends", k: "concept" },
          { t: "Concept: Parameter properties shorthand in constructors", k: "concept" },
          { t: "Code: Model a bank account system with Account (abstract), SavingsAccount, CurrentAccount", k: "code" },
          { t: "Quiz: When use abstract class over interface? What is parameter property shorthand?", k: "quiz" },
        ]
      },
      {
        day: "Day 19", label: "Modules + Declaration files", tasks: [
          { t: "Concept: ES modules in TS — import/export, default vs named", k: "concept" },
          { t: "Concept: Declaration files (.d.ts) — what they are, @types packages, DefinitelyTyped", k: "concept" },
          { t: "Concept: Path aliases in tsconfig — @/components, @/utils", k: "concept" },
          { t: "Code: Refactor your Weather Dashboard into typed modules with barrel exports", k: "code" },
          { t: "Quiz: What is a .d.ts file? How do you install types for a JS library?", k: "quiz" },
        ]
      },
      {
        day: "Day 20", label: "Advanced types I", tasks: [
          { t: "Concept: Mapped types — iterating over keyof T", k: "concept" },
          { t: "Concept: Conditional types — T extends U ? X : Y", k: "concept" },
          { t: "Concept: Template literal types", k: "concept" },
          { t: "Code: Write a DeepReadonly and a Nullable mapped type from scratch", k: "code" },
          { t: "Quiz: Explain how conditional types work. Write an IsArray type", k: "quiz" },
        ]
      },
      {
        day: "Day 21", label: "Advanced types II", tasks: [
          { t: "Concept: Discriminated unions — type-safe state machines", k: "concept" },
          { t: "Concept: Exhaustive checks with never in switch statements", k: "concept" },
          { t: "Concept: Infer keyword in conditional types", k: "concept" },
          { t: "Code: Model a UI loading state (Idle, Loading, Success, Error) with discriminated union", k: "code" },
          { t: "Quiz: How does exhaustive checking work? Write a ReturnType clone using infer", k: "quiz" },
        ]
      },
      {
        day: "Day 22", label: "TypeScript + Node.js", tasks: [
          { t: "Concept: Set up a TS Node.js project — ts-node, nodemon, tsconfig for Node", k: "concept" },
          { t: "Concept: Typing Express.js routes — Request, Response, NextFunction generics", k: "concept" },
          { t: "Code: Build a typed REST API with 5 routes — GET list, GET by id, POST, PUT, DELETE", k: "code" },
          { t: "Quiz: How do you type query params and body in Express? What is ts-node?", k: "quiz" },
        ]
      },
      {
        day: "Day 23", label: "Error handling + Strict mode", tasks: [
          { t: "Concept: strictNullChecks — why it matters, the non-null assertion operator", k: "concept" },
          { t: "Concept: Error handling patterns — Result type, typed custom errors", k: "concept" },
          { t: "Concept: noImplicitAny, strictFunctionTypes, strictPropertyInitialization", k: "concept" },
          { t: "Code: Refactor your Day 22 API to use a Result pattern", k: "code" },
          { t: "Quiz: What is strictNullChecks? When is using ! acceptable?", k: "quiz" },
        ]
      },
      {
        day: "Day 24", label: "TypeScript tooling", tasks: [
          { t: "Concept: ESLint with @typescript-eslint — setup, key rules", k: "concept" },
          { t: "Concept: Prettier — auto-formatting, .prettierrc config", k: "concept" },
          { t: "Concept: Vitest / Jest basics — writing typed unit tests", k: "concept" },
          { t: "Code: Add ESLint + Prettier + 10 unit tests to your Day 22 API", k: "code" },
          { t: "Quiz: What does ESLint enforce? Why write tests for your API?", k: "quiz" },
        ]
      },
      {
        day: "Day 25", label: "TypeScript review + challenge", tasks: [
          { t: "Review: Generics, utility types, discriminated unions — explain each to yourself", k: "concept" },
          { t: "Project: Build a typed CLI task manager (add, list, complete, delete) stored in JSON", k: "project" },
          { t: "Quiz: Given a JS snippet, annotate it fully in TypeScript from memory", k: "quiz" },
          { t: "Code: Push to GitHub, write a README explaining the TypeScript patterns used", k: "code" },
        ]
      },
    ]
  },
  {
    title: "Phase 3 — React + Tailwind", days: "Days 26–45", icon: "⚛", color: "#ff7eb3", dim: "rgba(255,126,179,.1)", data: [
      {
        day: "Day 26", label: "React fundamentals", tasks: [
          { t: "Concept: What is React? Virtual DOM, reconciliation, why components", k: "concept" },
          { t: "Concept: Vite setup — create a React+TS project, folder structure", k: "concept" },
          { t: "Concept: JSX — what it compiles to, expressions, self-closing tags", k: "concept" },
          { t: "Code: Build 5 functional components — Button, Card, Badge, Avatar, Alert", k: "code" },
          { t: "Quiz: What is the virtual DOM? Why does React use keys in lists?", k: "quiz" },
        ]
      },
      {
        day: "Day 27", label: "Props + Component patterns", tasks: [
          { t: "Concept: Props — passing data down, typing props with TypeScript interfaces", k: "concept" },
          { t: "Concept: children prop — React.ReactNode, composition pattern", k: "concept" },
          { t: "Concept: Default props, optional props, prop drilling problem", k: "concept" },
          { t: "Code: Build a ProductCard component used in a ProductGrid with typed props", k: "code" },
          { t: "Quiz: What is prop drilling? When does it become a problem?", k: "quiz" },
        ]
      },
      {
        day: "Day 28", label: "useState hook", tasks: [
          { t: "Concept: useState — state vs props, re-renders, functional updates", k: "concept" },
          { t: "Concept: State batching, stale closure problem", k: "concept" },
          { t: "Concept: Typing useState with generics", k: "concept" },
          { t: "Code: Build a multi-step signup form with full state management", k: "code" },
          { t: "Quiz: What is a stale closure in React? How do functional updates fix it?", k: "quiz" },
        ]
      },
      {
        day: "Day 29", label: "useEffect hook", tasks: [
          { t: "Concept: useEffect — dependency array, cleanup functions, when it runs", k: "concept" },
          { t: "Concept: Common mistakes — missing deps, infinite loops, memory leaks", k: "concept" },
          { t: "Concept: Data fetching with useEffect, loading and error states", k: "concept" },
          { t: "Code: Fetch and display paginated GitHub repos for a username typed in an input", k: "code" },
          { t: "Quiz: When does useEffect with [] run vs [value]? What is a cleanup function?", k: "quiz" },
        ]
      },
      {
        day: "Day 30", label: "Tailwind CSS I", tasks: [
          { t: "Concept: Utility-first philosophy — why Tailwind beats custom CSS at scale", k: "concept" },
          { t: "Concept: Core utilities — spacing, sizing, flex, grid, colors", k: "concept" },
          { t: "Concept: Responsive prefixes — sm: md: lg: xl: 2xl:", k: "concept" },
          { t: "Concept: State variants — hover: focus: active: disabled:", k: "concept" },
          { t: "Code: Rebuild your Day 27 ProductCard and Grid in Tailwind (no CSS file)", k: "code" },
          { t: "Quiz: How does Tailwind purge unused classes? What is JIT mode?", k: "quiz" },
        ]
      },
      {
        day: "Day 31", label: "Tailwind CSS II", tasks: [
          { t: "Concept: Dark mode — dark: variant, class strategy", k: "concept" },
          { t: "Concept: Custom config — extend colors, fonts, spacing in tailwind.config.js", k: "concept" },
          { t: "Concept: @apply directive — when and why (sparingly)", k: "concept" },
          { t: "Concept: cn() utility with clsx + tailwind-merge — conditional classes", k: "concept" },
          { t: "Code: Add dark mode toggle and a custom color theme to your app", k: "code" },
          { t: "Quiz: Why is tailwind-merge needed? When would you use @apply?", k: "quiz" },
        ]
      },
      {
        day: "Day 32", label: "useReducer + useContext", tasks: [
          { t: "Concept: useReducer — actions, reducer function, dispatch, when to prefer over useState", k: "concept" },
          { t: "Concept: useContext — Context.Provider, createContext, avoiding prop drilling", k: "concept" },
          { t: "Concept: Combining useReducer + useContext for global state", k: "concept" },
          { t: "Code: Build a shopping cart with useReducer + Context (add, remove, quantity, total)", k: "code" },
          { t: "Quiz: When useReducer vs useState? What causes Context re-render issues?", k: "quiz" },
        ]
      },
      {
        day: "Day 33", label: "Custom hooks", tasks: [
          { t: "Concept: What makes a custom hook — starts with use, can call other hooks", k: "concept" },
          { t: "Concept: Why extract logic into custom hooks — reusability and testing", k: "concept" },
          { t: "Code: Build useFetch, useLocalStorage, useDebounce, useToggle, useWindowSize", k: "code" },
          { t: "Quiz: Explain useFetch — what does it return? How would you test a custom hook?", k: "quiz" },
        ]
      },
      {
        day: "Day 34", label: "React Router v6", tasks: [
          { t: "Concept: BrowserRouter, Routes, Route, Link, NavLink — SPA routing", k: "concept" },
          { t: "Concept: URL params (:id), useParams, useNavigate, useLocation", k: "concept" },
          { t: "Concept: Nested routes, Outlet, layout routes", k: "concept" },
          { t: "Concept: Protected routes — redirect if not authenticated", k: "concept" },
          { t: "Code: Add multi-page routing to your shopping cart app", k: "code" },
          { t: "Quiz: Difference between Link and useNavigate? What is Outlet?", k: "quiz" },
        ]
      },
      {
        day: "Day 35", label: "Forms — React Hook Form + Zod", tasks: [
          { t: "Concept: React Hook Form — register, handleSubmit, formState, Controller", k: "concept" },
          { t: "Concept: Zod — schema validation, z.object, z.string, email, refine", k: "concept" },
          { t: "Concept: zodResolver — connecting Zod schema to RHF", k: "concept" },
          { t: "Code: Build a full registration form with 8 fields, Zod validation, and error messages", k: "code" },
          { t: "Quiz: Why React Hook Form over controlled inputs? What does zodResolver do?", k: "quiz" },
        ]
      },
      {
        day: "Day 36", label: "Data fetching — TanStack Query", tasks: [
          { t: "Concept: TanStack Query — useQuery, useMutation, QueryClient", k: "concept" },
          { t: "Concept: Caching, staleTime, gcTime, refetchOnWindowFocus", k: "concept" },
          { t: "Concept: Optimistic updates, invalidateQueries, pagination with useInfiniteQuery", k: "concept" },
          { t: "Code: Replace all useEffect fetch calls in your app with React Query", k: "code" },
          { t: "Quiz: What is staleTime? How does React Query eliminate loading flickers?", k: "quiz" },
        ]
      },
      {
        day: "Day 37", label: "State management — Zustand", tasks: [
          { t: "Concept: Zustand — create store, selectors, actions, middleware", k: "concept" },
          { t: "Concept: When Zustand vs React Query vs Context — the decision matrix", k: "concept" },
          { t: "Concept: persist middleware — localStorage integration", k: "concept" },
          { t: "Code: Migrate your shopping cart Context to a Zustand store", k: "code" },
          { t: "Quiz: Zustand vs Redux — key differences? When NOT to use global state?", k: "quiz" },
        ]
      },
      {
        day: "Day 38", label: "Performance optimization", tasks: [
          { t: "Concept: useMemo, useCallback — what they memoize and when they help", k: "concept" },
          { t: "Concept: React.memo — preventing unnecessary re-renders", k: "concept" },
          { t: "Concept: Code splitting — React.lazy, Suspense, dynamic import", k: "concept" },
          { t: "Concept: React DevTools Profiler — identifying expensive renders", k: "concept" },
          { t: "Code: Profile your app, find 3 performance issues, fix them", k: "code" },
          { t: "Quiz: When does useMemo NOT help? What is the cost of React.memo?", k: "quiz" },
        ]
      },
      {
        day: "Day 39", label: "Testing React", tasks: [
          { t: "Concept: Vitest + React Testing Library setup, render, screen, userEvent", k: "concept" },
          { t: "Concept: Queries — getByRole, getByText, getByLabelText, findBy (async)", k: "concept" },
          { t: "Concept: Mocking — vi.mock, MSW (Mock Service Worker) for API mocking", k: "concept" },
          { t: "Code: Write 15 tests covering your shopping cart — add item, remove item, quantity update", k: "code" },
          { t: "Quiz: Why prefer getByRole over getByTestId? What is MSW?", k: "quiz" },
        ]
      },
      {
        day: "Day 40", label: "Component library patterns", tasks: [
          { t: "Concept: shadcn/ui — what it is, how it differs from MUI (you own the code)", k: "concept" },
          { t: "Concept: Radix UI primitives — accessible, headless components", k: "concept" },
          { t: "Concept: Compound component pattern, Render prop pattern", k: "concept" },
          { t: "Code: Install shadcn/ui, use Dialog, Dropdown, Toast, DataTable in your app", k: "code" },
          { t: "Quiz: shadcn/ui vs MUI — trade-offs? What is a headless component?", k: "quiz" },
        ]
      },
      {
        day: "Day 41", label: "Next.js fundamentals", tasks: [
          { t: "Concept: Next.js App Router — file-based routing, layout.tsx, page.tsx, loading.tsx", k: "concept" },
          { t: "Concept: Server Components vs Client Components — use client directive", k: "concept" },
          { t: "Concept: Server Actions — form handling without API routes", k: "concept" },
          { t: "Code: Migrate your React app to Next.js, convert data fetching to server components", k: "code" },
          { t: "Quiz: When use client? What is a Server Action?", k: "quiz" },
        ]
      },
      {
        day: "Day 42", label: "Next.js advanced", tasks: [
          { t: "Concept: Static generation vs Server-side rendering vs ISR in App Router", k: "concept" },
          { t: "Concept: Next.js Image, Font optimization, Metadata API", k: "concept" },
          { t: "Concept: API routes (route.ts) — building a Next.js backend", k: "concept" },
          { t: "Code: Add SSR product pages and a metadata setup to your Next.js app", k: "code" },
          { t: "Quiz: Difference between generateStaticParams and SSR? What is ISR?", k: "quiz" },
        ]
      },
      {
        day: "Day 43", label: "Authentication", tasks: [
          { t: "Concept: JWT — header.payload.signature, access vs refresh tokens", k: "concept" },
          { t: "Concept: NextAuth.js (Auth.js) — providers, session, callbacks", k: "concept" },
          { t: "Concept: Protecting routes in Next.js with middleware", k: "concept" },
          { t: "Code: Add Google OAuth login to your Next.js app with protected dashboard route", k: "code" },
          { t: "Quiz: What is a refresh token? Why store JWT in httpOnly cookie?", k: "quiz" },
        ]
      },
      {
        day: "Day 44", label: "Databases + Prisma", tasks: [
          { t: "Concept: PostgreSQL basics — tables, columns, relations, SQL SELECT/INSERT/UPDATE/DELETE", k: "concept" },
          { t: "Concept: Prisma ORM — schema.prisma, models, migrations, Prisma Client", k: "concept" },
          { t: "Concept: Relations — one-to-many, many-to-many in Prisma", k: "concept" },
          { t: "Code: Add a PostgreSQL database to your Next.js app, store users and products via Prisma", k: "code" },
          { t: "Quiz: What is an ORM? Write a Prisma query to find all products under 500 rupees", k: "quiz" },
        ]
      },
      {
        day: "Day 45", label: "Phase 3 review + full-stack project", tasks: [
          { t: "Review: React hooks, Tailwind, Next.js App Router, Prisma — gaps?", k: "concept" },
          { t: "Project: Full-stack e-commerce store — SSR listing, Zustand cart, RHF+Zod checkout, NextAuth, Prisma orders", k: "project" },
          { t: "Code: Deploy to Vercel, connect Supabase/Neon PostgreSQL", k: "code" },
          { t: "Quiz: Explain your app architecture — what renders on server vs client?", k: "quiz" },
        ]
      },
    ]
  },
  {
    title: "Phase 4 — DevOps + Cloud", days: "Days 46–55", icon: "☁", color: "#ff8c42", dim: "rgba(255,140,66,.1)", data: [
      {
        day: "Day 46", label: "Linux + command line", tasks: [
          { t: "Concept: File system — ls, cd, mkdir, rm, cp, mv, find, grep, cat, tail, chmod", k: "concept" },
          { t: "Concept: Processes — ps, kill, top/htop, background jobs and nohup", k: "concept" },
          { t: "Concept: SSH — key pair generation, ssh-copy-id, connecting to a remote server", k: "concept" },
          { t: "Code: Set up a free-tier EC2 Linux server, deploy a Node.js app manually", k: "code" },
          { t: "Quiz: How do file permissions (chmod 755) work? What does nohup do?", k: "quiz" },
        ]
      },
      {
        day: "Day 47", label: "Docker I — containers", tasks: [
          { t: "Concept: What is Docker — containers vs VMs, images vs containers", k: "concept" },
          { t: "Concept: Dockerfile — FROM, WORKDIR, COPY, RUN, CMD, EXPOSE", k: "concept" },
          { t: "Concept: docker build, docker run, docker ps, docker logs, docker exec", k: "concept" },
          { t: "Code: Write a Dockerfile for your Next.js app, build and run it locally", k: "code" },
          { t: "Quiz: Container vs VM — key difference? What is a Docker layer?", k: "quiz" },
        ]
      },
      {
        day: "Day 48", label: "Docker II — compose + registry", tasks: [
          { t: "Concept: docker-compose — services, volumes, networks, depends_on", k: "concept" },
          { t: "Concept: Environment variables in Docker — .env, ARG vs ENV", k: "concept" },
          { t: "Concept: Docker Hub and GitHub Container Registry — push and pull images", k: "concept" },
          { t: "Code: Write docker-compose.yml for your Next.js app + PostgreSQL + pgAdmin", k: "code" },
          { t: "Quiz: What is a Docker volume? Why not store DB data in a container?", k: "quiz" },
        ]
      },
      {
        day: "Day 49", label: "CI/CD with GitHub Actions", tasks: [
          { t: "Concept: What is CI/CD — continuous integration, continuous delivery/deployment", k: "concept" },
          { t: "Concept: GitHub Actions — workflow YAML, on: triggers, jobs, steps, runners", k: "concept" },
          { t: "Concept: Secrets in GitHub Actions — storing API keys safely", k: "concept" },
          { t: "Code: CI pipeline — on PR: lint + typecheck + test. On merge: build Docker image + push to registry", k: "code" },
          { t: "Quiz: Difference between CI and CD? What is a GitHub Actions runner?", k: "quiz" },
        ]
      },
      {
        day: "Day 50", label: "AWS fundamentals", tasks: [
          { t: "Concept: AWS account setup, IAM — users, roles, policies, principle of least privilege", k: "concept" },
          { t: "Concept: S3 — buckets, objects, public access, static website hosting", k: "concept" },
          { t: "Concept: EC2 — instance types, key pairs, security groups, elastic IP", k: "concept" },
          { t: "Code: Host your Next.js static export on S3 + CloudFront CDN", k: "code" },
          { t: "Quiz: What is IAM? Why never use your AWS root account day-to-day?", k: "quiz" },
        ]
      },
      {
        day: "Day 51", label: "AWS — compute + networking", tasks: [
          { t: "Concept: VPC — subnets (public/private), route tables, internet gateway, NAT gateway", k: "concept" },
          { t: "Concept: RDS — managed PostgreSQL, free tier, parameter groups, connection strings", k: "concept" },
          { t: "Concept: Elastic Beanstalk and ECS basics — deploying containerized apps", k: "concept" },
          { t: "Code: Deploy your Next.js Docker container to EC2, connect to RDS PostgreSQL", k: "code" },
          { t: "Quiz: Public subnet vs private subnet — when use each? What is a NAT gateway?", k: "quiz" },
        ]
      },
      {
        day: "Day 52", label: "Infrastructure as Code — Terraform", tasks: [
          { t: "Concept: IaC concept — why define infrastructure in code", k: "concept" },
          { t: "Concept: Terraform — provider, resource, variable, output, state file", k: "concept" },
          { t: "Concept: terraform init, plan, apply, destroy workflow", k: "concept" },
          { t: "Code: Write Terraform to provision an S3 bucket + EC2 instance on AWS", k: "code" },
          { t: "Quiz: What is terraform state? Why is the state file sensitive?", k: "quiz" },
        ]
      },
      {
        day: "Day 53", label: "Kubernetes basics", tasks: [
          { t: "Concept: K8s architecture — cluster, node, pod, deployment, service, ingress", k: "concept" },
          { t: "Concept: kubectl commands — get, describe, apply, delete, logs, exec", k: "concept" },
          { t: "Concept: YAML manifests — Deployment and Service definition", k: "concept" },
          { t: "Code: Run your Docker app on a local minikube cluster with a Deployment + Service", k: "code" },
          { t: "Quiz: Pod vs Deployment vs Service — what does each do?", k: "quiz" },
        ]
      },
      {
        day: "Day 54", label: "Monitoring + Logging", tasks: [
          { t: "Concept: Observability — logs, metrics, traces (the three pillars)", k: "concept" },
          { t: "Concept: AWS CloudWatch — log groups, alarms, metrics dashboard", k: "concept" },
          { t: "Concept: Error tracking — Sentry setup in a Next.js app", k: "concept" },
          { t: "Code: Add Sentry to your Next.js app, create a CloudWatch alarm for CPU above 80%", k: "code" },
          { t: "Quiz: Difference between logging and monitoring? What is a trace?", k: "quiz" },
        ]
      },
      {
        day: "Day 55", label: "DevOps review + pipeline project", tasks: [
          { t: "Review: Docker, GitHub Actions, AWS, Terraform, K8s basics — gaps?", k: "concept" },
          { t: "Project: Full CI/CD pipeline — push triggers tests, builds Docker image, pushes to ECR, deploys to EC2", k: "project" },
          { t: "Quiz: Walk through your pipeline end-to-end out loud", k: "quiz" },
          { t: "Code: Document the pipeline architecture in your GitHub README with a diagram", k: "code" },
        ]
      },
    ]
  },
  {
    title: "Phase 5 — Portfolio Projects", days: "Days 56–65", icon: "◈", color: "#b98aff", dim: "rgba(185,138,255,.1)", data: [
      {
        day: "Days 56-58", label: "Project 1 — SaaS dashboard", tasks: [
          { t: "Project: Build a SaaS analytics dashboard — Next.js, Tailwind, Recharts, auth, Prisma + PostgreSQL", k: "project" },
          { t: "Code: Features — user login, data overview cards, line/bar charts, date range filter, export CSV", k: "code" },
          { t: "Code: Deploy to Vercel + Supabase, write README with screenshots and tech stack", k: "code" },
        ]
      },
      {
        day: "Days 59-61", label: "Project 2 — Real-time app", tasks: [
          { t: "Project: Build a real-time chat app — Next.js, Pusher or Socket.io, Zustand, Prisma", k: "project" },
          { t: "Code: Features — rooms, online users, typing indicator, message history, auth", k: "code" },
          { t: "Code: Deploy with Docker on EC2, set up CI/CD pipeline", k: "code" },
        ]
      },
      {
        day: "Days 62-63", label: "Portfolio site", tasks: [
          { t: "Project: Build your personal portfolio — Next.js, Tailwind, Framer Motion animations", k: "project" },
          { t: "Code: Sections — hero, about, tech stack, projects (with live links + GitHub), contact form", k: "code" },
          { t: "Code: Perfect Lighthouse score (100 performance, 100 accessibility, 100 SEO)", k: "code" },
        ]
      },
      {
        day: "Days 64-65", label: "Polish + LinkedIn", tasks: [
          { t: "Code: Fix any bugs, improve mobile responsiveness across all 3 projects", k: "code" },
          { t: "Project: Write detailed case study READMEs — problem, solution, tech choices, challenges", k: "project" },
          { t: "Quiz: Can you explain every line of code in each project? Expect this in interviews", k: "quiz" },
          { t: "Code: Set up LinkedIn — headline Frontend Developer React TypeScript Next.js, feature all 3 projects", k: "code" },
        ]
      },
    ]
  },
  {
    title: "Phase 6 — Interview Prep", days: "Days 66–80", icon: "◉", color: "#ffc850", dim: "rgba(255,200,80,.1)", data: [
      {
        day: "Days 66-67", label: "JavaScript and TS interview questions", tasks: [
          { t: "Quiz: Explain closures, prototypal inheritance, event loop, microtasks vs macrotasks", k: "quiz" },
          { t: "Quiz: What is debounce vs throttle? Implement both from scratch", k: "quiz" },
          { t: "Quiz: Explain TypeScript generics, utility types, and discriminated unions", k: "quiz" },
          { t: "Code: LeetCode easy-medium: Two Sum, Valid Parentheses, Reverse Linked List", k: "code" },
        ]
      },
      {
        day: "Days 68-69", label: "React interview questions", tasks: [
          { t: "Quiz: Explain the React rendering cycle — when does a component re-render?", k: "quiz" },
          { t: "Quiz: useEffect vs useLayoutEffect, useMemo vs useCallback — real differences", k: "quiz" },
          { t: "Quiz: How does React Query caching work? Explain staleTime vs gcTime", k: "quiz" },
          { t: "Code: Live coding: build a debounced search input with loading state in 20 min", k: "code" },
        ]
      },
      {
        day: "Days 70-71", label: "System design basics", tasks: [
          { t: "Concept: How to approach a system design question — requirements, scale, components", k: "concept" },
          { t: "Quiz: Design a URL shortener — components, database schema, scaling", k: "quiz" },
          { t: "Quiz: Design a Twitter feed — how to handle 1M users, caching strategy", k: "quiz" },
          { t: "Quiz: REST vs GraphQL — when to use which?", k: "quiz" },
        ]
      },
      {
        day: "Days 72-73", label: "DevOps interview questions", tasks: [
          { t: "Quiz: Explain Docker — images, containers, layers, volumes, networking", k: "quiz" },
          { t: "Quiz: What is Kubernetes? Explain pod, deployment, service, ingress", k: "quiz" },
          { t: "Quiz: Walk through a CI/CD pipeline you have built", k: "quiz" },
          { t: "Quiz: What happens when you type a URL — DNS, CDN, TLS, server rendering", k: "quiz" },
        ]
      },
      {
        day: "Days 74-75", label: "Behavioral + HR preparation", tasks: [
          { t: "Quiz: STAR method — prepare 5 stories: challenge, conflict, deadline, failure, leadership", k: "quiz" },
          { t: "Quiz: Tell me about yourself — 2-minute polished answer", k: "quiz" },
          { t: "Quiz: Why career switch at 33? — confident, positive framing", k: "quiz" },
          { t: "Quiz: Salary negotiation — research Hyderabad market rates for junior frontend", k: "quiz" },
        ]
      },
      {
        day: "Days 76-77", label: "Mock interviews", tasks: [
          { t: "Quiz: Do a 1-hour mock technical interview — 3 JS questions, 1 React build, 1 system design", k: "quiz" },
          { t: "Quiz: Do a 30-min behavioral mock interview", k: "quiz" },
          { t: "Quiz: Review every answer — what was weak? Study those gaps", k: "quiz" },
        ]
      },
      {
        day: "Days 78-79", label: "Job applications", tasks: [
          { t: "Code: Apply to 20+ jobs — LinkedIn Easy Apply, Naukri.com, Wellfound, company career pages", k: "code" },
          { t: "Code: Customize your resume for each job — match keywords from JD", k: "code" },
          { t: "Code: Write personalized cover letters for top 5 companies", k: "code" },
          { t: "Quiz: Research each company before interviews — product, tech stack, recent news", k: "quiz" },
        ]
      },
      {
        day: "Day 80", label: "Launch day checklist", tasks: [
          { t: "Code: All 3 portfolio projects live and bug-free", k: "code" },
          { t: "Code: GitHub profile polished — pinned repos, profile README, green contribution graph", k: "code" },
          { t: "Code: LinkedIn at All-Star strength — 500+ connections goal started", k: "code" },
          { t: "Quiz: You have built the skills. Now it is a numbers game — apply every day until you land", k: "quiz" },
        ]
      },
    ]
  },
];

const DEVOPS_PHASES = [
  {
    title: "Phase 1 — Linux & Scripting", days: "Days 1–15", icon: "🐧", color: "#00d9a0", dim: "rgba(0,217,160,.1)", data: [
      {
        day: "Day 1", label: "Linux file system & navigation", tasks: [
          { t: "Concept: Linux directory hierarchy (/, /bin, /etc, /var, /home), basic navigation command principles", k: "concept" },
          { t: "Code: Practice ls, cd, pwd, mkdir, rmdir, and touch in terminal. Create a nested project structure", k: "code" },
          { t: "Quiz: Explain the difference between /bin and /sbin. What is the purpose of the /etc directory?", k: "quiz" }
        ]
      },
      {
        day: "Day 2", label: "File permissions & management", tasks: [
          { t: "Concept: Linux permissions model (read, write, execute for user, group, others), chmod, chown", k: "concept" },
          { t: "Code: Set permissions on files/directories using symbolic (u+x) and octal (755, 600) modes. Change file ownership", k: "code" },
          { t: "Quiz: What does permission 644 mean? How do you make a shell script executable?", k: "quiz" }
        ]
      },
      {
        day: "Day 3", label: "Text processing & searching", tasks: [
          { t: "Concept: Standard input/output/error redirection (>, >>, <, 2>&1), piping (|), grep, find, and cat", k: "concept" },
          { t: "Code: Search log files for error keywords using grep, search for files modified in last 24h using find", k: "code" },
          { t: "Quiz: What is the difference between stdout (1) and stderr (2)? Explain how a pipe works.", k: "quiz" }
        ]
      },
      {
        day: "Day 4", label: "Process management & system monitoring", tasks: [
          { t: "Concept: Linux processes, job control, signals, commands (ps, top, htop, kill, bg, fg, systemctl)", k: "concept" },
          { t: "Code: Start a long-running process in the background, check CPU/memory usage, and terminate it cleanly", k: "code" },
          { t: "Quiz: What is the difference between SIGTERM (15) and SIGKILL (9)? How do you list active services?", k: "quiz" }
        ]
      },
      {
        day: "Day 5", label: "Package management & user admin", tasks: [
          { t: "Concept: Linux package managers (apt, yum, dnf), repositories, user/group administration (useradd, groupadd, sudoers)", k: "concept" },
          { t: "Code: Install Nginx, add a new deployer user, and grant them restricted sudo privileges", k: "code" },
          { t: "Quiz: How does sudo determine if a user has root rights? What is a package repository?", k: "quiz" }
        ]
      },
      {
        day: "Day 6", label: "Bash scripting basics", tasks: [
          { t: "Concept: Shell script structure, shebang (#!/bin/bash), variables, user input, simple arguments", k: "concept" },
          { t: "Code: Write a script that greets the user, takes directory path as input, and lists files in it", k: "code" },
          { t: "Quiz: What does $? represent in Bash? Why is the shebang line important?", k: "quiz" }
        ]
      },
      {
        day: "Day 7", label: "Bash conditionals & loops", tasks: [
          { t: "Concept: Control flow in Bash — if-else statements, exit codes, for/while loops", k: "concept" },
          { t: "Code: Write a script to check if a specific file exists; if not, create it. Iterate over a list of server IPs", k: "code" },
          { t: "Quiz: What is the difference between [ ] and [[ ]] in Bash conditionals?", k: "quiz" }
        ]
      },
      {
        day: "Day 8", label: "Bash functions & strings", tasks: [
          { t: "Concept: Functions in Bash, local variables, returning values (exit codes), basic string operations", k: "concept" },
          { t: "Code: Write a modular script with functions to check disk space and log a warning if space is above 80%", k: "code" },
          { t: "Quiz: How do you declare a local variable in a Bash function? How do you return a string from a function?", k: "quiz" }
        ]
      },
      {
        day: "Day 9", label: "Bash automation — Log rotation", tasks: [
          { t: "Concept: Automation using scripting, log file aggregation, archiving (tar, gzip)", k: "concept" },
          { t: "Code: Write an automation script that archives and compresses all .log files in a folder older than 7 days", k: "code" },
          { t: "Quiz: Explain the flags used in tar -czf backup.tar.gz /path", k: "quiz" }
        ]
      },
      {
        day: "Day 10", label: "Cron jobs & scheduled tasks", tasks: [
          { t: "Concept: Scheduled task runners in Linux, crontab syntax (* * * * *), systemd timers", k: "concept" },
          { t: "Code: Schedule your Day 9 log rotation script to run automatically every night at 2:00 AM using crontab", k: "code" },
          { t: "Quiz: What do the five asterisks in a cron expression represent? How do you view active cron jobs?", k: "quiz" }
        ]
      },
      {
        day: "Day 11", label: "Networking — Ports & protocols", tasks: [
          { t: "Concept: OSI model overview, TCP/IP stack, common protocols (HTTP, HTTPS, SSH, DNS), IP addressing, subnets", k: "concept" },
          { t: "Code: Use netstat, ss, and lsof to inspect open ports and running network connections on your system", k: "code" },
          { t: "Quiz: What is a port number? Which protocol uses port 53? Explain the difference between TCP and UDP.", k: "quiz" }
        ]
      },
      {
        day: "Day 12", label: "DNS & name resolution", tasks: [
          { t: "Concept: Domain Name System (DNS) records (A, AAAA, CNAME, MX, TXT), resolver configuration (/etc/resolv.conf, /etc/hosts)", k: "concept" },
          { t: "Code: Use dig, nslookup, and host to query DNS records for a domain and trace domain resolution", k: "code" },
          { t: "Quiz: What is a CNAME record? How does /etc/hosts affect local domain resolution?", k: "quiz" }
        ]
      },
      {
        day: "Day 13", label: "SSH & key-based auth", tasks: [
          { t: "Concept: Secure Shell (SSH) protocol, symmetric/asymmetric encryption for access, config file (~/.ssh/config)", k: "concept" },
          { t: "Code: Generate an SSH keypair, copy the public key to a remote server, and configure ~/.ssh/config", k: "code" },
          { t: "Quiz: Why is key-based SSH authentication more secure than passwords? Where is the authorized_keys file located?", k: "quiz" }
        ]
      },
      {
        day: "Day 14", label: "Web servers & reverse proxies (Nginx)", tasks: [
          { t: "Concept: HTTP server architecture, reverse proxy concept, load balancing, server blocks/virtual hosts", k: "concept" },
          { t: "Code: Set up Nginx to host a static website and configure it as a reverse proxy for a local Node.js application", k: "code" },
          { t: "Quiz: What is a reverse proxy? What directive in Nginx is used to forward requests?", k: "quiz" }
        ]
      },
      {
        day: "Day 15", label: "Nginx security & SSL/TLS", tasks: [
          { t: "Concept: SSL/TLS handshakes, certificates, Let's Encrypt, HTTPS enforcement, security headers", k: "concept" },
          { t: "Code: Generate a self-signed certificate, configure Nginx to serve traffic over port 443 (HTTPS), and redirect HTTP to HTTPS", k: "code" },
          { t: "Quiz: Explain the difference between asymmetric encryption during handshake and symmetric encryption for data transfer", k: "quiz" }
        ]
      }
    ]
  },
  {
    title: "Phase 2 — Git, CI/CD & Build Tools", days: "Days 16–30", icon: "🐙", color: "#4fa8ff", dim: "rgba(79,168,255,.1)", data: [
      {
        day: "Day 16", label: "Git version control foundations", tasks: [
          { t: "Concept: Local git workflow — working directory, staging area, git directory. Hash commits, commit messages", k: "concept" },
          { t: "Code: Initialize a repository, stage changes, commit with custom messages, and view history using git log", k: "code" },
          { t: "Quiz: What is the staging area in Git? How is it different from the working directory?", k: "quiz" }
        ]
      },
      {
        day: "Day 17", label: "Git branching & merging", tasks: [
          { t: "Concept: Branches as references to commits, merge strategies (fast-forward, three-way merge), merge conflicts", k: "concept" },
          { t: "Code: Create a feature branch, make modifications, merge back to main, and manually resolve a merge conflict", k: "code" },
          { t: "Quiz: What is a fast-forward merge? How does Git resolve non-conflicting changes?", k: "quiz" }
        ]
      },
      {
        day: "Day 18", label: "Advanced Git workflows", tasks: [
          { t: "Concept: Git rebasing, cherry-picking, stash, interactive rebase, squashing commits", k: "concept" },
          { t: "Code: Rebase a feature branch on top of main. Clean up a messy commit history using interactive rebase before a PR", k: "code" },
          { t: "Quiz: When should you avoid using git rebase? What is git stash pop?", k: "quiz" }
        ]
      },
      {
        day: "Day 19", label: "Git remotes & collaboration", tasks: [
          { t: "Concept: Remotes, upstream repository, clone vs fork, pull requests, git fetch vs git pull", k: "concept" },
          { t: "Code: Set up a remote repository on GitHub, push branches, create a Pull Request, and review code online", k: "code" },
          { t: "Quiz: What is the difference between git fetch and git pull? What is a fork?", k: "quiz" }
        ]
      },
      {
        day: "Day 20", label: "Git hooks & linting", tasks: [
          { t: "Concept: Client-side and server-side hooks, pre-commit checks, automated linting and formatting", k: "concept" },
          { t: "Code: Set up a pre-commit hook using Husky to run linting and unit tests before any commit is finalized", k: "code" },
          { t: "Quiz: What are git hooks? Name three client-side hooks.", k: "quiz" }
        ]
      },
      {
        day: "Day 21", label: "CI/CD concepts & GitHub Actions", tasks: [
          { t: "Concept: Continuous Integration and Continuous Deployment fundamentals. GitHub Actions workflow syntax, runners, triggers", k: "concept" },
          { t: "Code: Create a basic GitHub Actions workflow file (.github/workflows/main.yml) that prints a message on git push", k: "code" },
          { t: "Quiz: What is a trigger in GitHub Actions? Explain the structure of jobs and steps.", k: "quiz" }
        ]
      },
      {
        day: "Day 22", label: "Automated build & test pipelines", tasks: [
          { t: "Concept: Build stage in pipelines, compiling, dependency caching, executing automated tests (unit/integration)", k: "concept" },
          { t: "Code: Write a GitHub Actions workflow that installs dependencies, caches node_modules, and runs tests on pull request", k: "code" },
          { t: "Quiz: Why is dependency caching important in CI/CD? What is a runner?", k: "quiz" }
        ]
      },
      {
        day: "Day 23", label: "CI/CD environment secrets & variables", tasks: [
          { t: "Concept: Storing sensitive data in pipelines, GitHub Secrets, environment variables vs secrets", k: "concept" },
          { t: "Code: Add a deployment script to your workflow, using encrypted GitHub Secrets to pass API keys securely", k: "code" },
          { t: "Quiz: Why should you never print secrets in console logs? How do you access a secret in a GHA YAML file?", k: "quiz" }
        ]
      },
      {
        day: "Day 24", label: "Artifact management", tasks: [
          { t: "Concept: Build artifacts, release packaging, storing compiled code or assets, GitHub Releases", k: "concept" },
          { t: "Code: Configure your CI pipeline to upload build outputs as artifacts using upload-artifact action on successful builds", k: "code" },
          { t: "Quiz: What is a build artifact? Why store artifacts rather than rebuilding code on the target server?", k: "quiz" }
        ]
      },
      {
        day: "Day 25", label: "Automated linting & code quality", tasks: [
          { t: "Concept: Code quality gates, Static Application Security Testing (SAST), checking dependencies for vulnerabilities", k: "concept" },
          { t: "Code: Add SonarQube or standard security scan (npm audit, gitGuardian) jobs to your GitHub Actions pipeline", k: "code" },
          { t: "Quiz: What is static code analysis? When should security scans be executed in a CI/CD lifecycle?", k: "quiz" }
        ]
      },
      {
        day: "Day 26", label: "Continuous Deployment (CD) basics", tasks: [
          { t: "Concept: Deploy strategies (Blue-Green, Canary, Rolling), server agent deployments, automated SSH execution", k: "concept" },
          { t: "Code: Write a CD workflow that logs into an EC2 server via SSH using secrets, pulls latest code, and restarts service", k: "code" },
          { t: "Quiz: What is a Canary deployment? Explain rolling updates.", k: "quiz" }
        ]
      },
      {
        day: "Day 27", label: "Package repository management", tasks: [
          { t: "Concept: Artifact registries (npm registry, NuGet, Maven, PyPI), publishing packages", k: "concept" },
          { t: "Code: Configure a library release pipeline that bumps the version and publishes to GitHub Packages registry", k: "code" },
          { t: "Quiz: What is semantic versioning (SemVer)? Explain major.minor.patch.", k: "quiz" }
        ]
      },
      {
        day: "Day 28", label: "Multi-environment pipelines", tasks: [
          { t: "Concept: Staging, production environments, approval gates, environment protection rules in GitHub", k: "concept" },
          { t: "Code: Build a workflow that deploys to Staging automatically, but requires manual approval before deploying to Production", k: "code" },
          { t: "Quiz: Why require manual approvals for Production deployments? What is an environment in GitHub?", k: "quiz" }
        ]
      },
      {
        day: "Day 29", label: "Build tools deep dive", tasks: [
          { t: "Concept: Build orchestration tools (Make, Gradle, npm scripts), target dependencies, build caching", k: "concept" },
          { t: "Code: Write a Makefile for a multi-language project that compiles binaries, runs tests, and builds docker images", k: "code" },
          { t: "Quiz: What is the utility of a Makefile? What does a target represent?", k: "quiz" }
        ]
      },
      {
        day: "Day 30", label: "CI/CD pipeline troubleshooting", tasks: [
          { t: "Concept: Debugging failed workflow runs, interpreting log stack traces, common network/permission failures", k: "concept" },
          { t: "Code: Create a deliberately failing workflow, analyze the runner logs, fix the environment issue, and verify the green run", k: "code" },
          { t: "Quiz: How can you rerun failed jobs in GitHub Actions? What are runner environment variables?", k: "quiz" }
        ]
      }
    ]
  },
  {
    title: "Phase 3 — Containers & K8s", days: "Days 31–50", icon: "🐳", color: "#ff7eb3", dim: "rgba(255,126,179,.1)", data: [
      {
        day: "Day 31", label: "Docker foundations", tasks: [
          { t: "Concept: What is containerization? Kernel namespaces and cgroups. Differences between containers and virtual machines", k: "concept" },
          { t: "Code: Install Docker, run your first hello-world container, inspect its processes, and learn basic CLI commands", k: "code" },
          { t: "Quiz: What makes containers more lightweight than VMs? Explain namespaces.", k: "quiz" }
        ]
      },
      {
        day: "Day 32", label: "Docker images & Dockerfiles", tasks: [
          { t: "Concept: Docker images, layered filesystem, UnionFS. Dockerfile instructions (FROM, RUN, COPY, CMD, ENTRYPOINT)", k: "concept" },
          { t: "Code: Create a Dockerfile for a Node.js/Python app. Build the image and run it locally.", k: "code" },
          { t: "Quiz: What is the difference between CMD and ENTRYPOINT? What is an image layer?", k: "quiz" }
        ]
      },
      {
        day: "Day 33", label: "Docker image optimization", tasks: [
          { t: "Concept: Multi-stage builds, minimizing image sizes, caching layers, .dockerignore files", k: "concept" },
          { t: "Code: Refactor a single-stage Dockerfile into a multi-stage build, reducing the image size by at least 60%", k: "code" },
          { t: "Quiz: How does layer ordering affect build caching? What is the benefit of a multi-stage build?", k: "quiz" }
        ]
      },
      {
        day: "Day 34", label: "Docker storage & volumes", tasks: [
          { t: "Concept: Container ephemeral storage, bind mounts vs volumes, persistent storage strategies", k: "concept" },
          { t: "Code: Mount a local folder inside a container using a bind mount. Create a Docker volume and attach it to a database container", k: "code" },
          { t: "Quiz: When should you use a volume instead of a bind mount? What happens to volume data when the container is deleted?", k: "quiz" }
        ]
      },
      {
        day: "Day 35", label: "Docker networking", tasks: [
          { t: "Concept: Network drivers (bridge, host, overlay, none), port mapping, container dns resolution", k: "concept" },
          { t: "Code: Create a custom bridge network. Run a web app and database container on it, making them communicate via container names", k: "code" },
          { t: "Quiz: What is default bridge network limitation? How does DNS work in custom Docker networks?", k: "quiz" }
        ]
      },
      {
        day: "Day 36", label: "Docker Compose basics", tasks: [
          { t: "Concept: Multi-container applications, docker-compose.yml schema, services, ports, environment variables", k: "concept" },
          { t: "Code: Write a docker-compose.yml file to run a Python flask app connected to a Redis container. Run compose up.", k: "code" },
          { t: "Quiz: What is the purpose of docker-compose? How does it simplify local development environments?", k: "quiz" }
        ]
      },
      {
        day: "Day 37", label: "Docker Compose advanced", tasks: [
          { t: "Concept: Compose volumes, custom networks, service scaling, startup order (depends_on)", k: "concept" },
          { t: "Code: Configure compose to scale a web service to 3 instances behind an Nginx load balancer service", k: "code" },
          { t: "Quiz: What does depends_on control? Does it wait for the service to be healthy by default?", k: "quiz" }
        ]
      },
      {
        day: "Day 38", label: "Docker security best practices", tasks: [
          { t: "Concept: Root vs non-root container users, securing Docker daemon, scanning images for vulnerabilities", k: "concept" },
          { t: "Code: Modify a Dockerfile to run as a non-privileged user (USER node). Scan images using docker scout or trivy", k: "code" },
          { t: "Quiz: Why is running a container as root dangerous? Name three image security practices.", k: "quiz" }
        ]
      },
      {
        day: "Day 39", label: "Private Docker registries", tasks: [
          { t: "Concept: Publishing images, authentication, Docker Hub, AWS ECR, registry tags", k: "concept" },
          { t: "Code: Authenticate with a remote registry, tag your local optimized image, and push it to a private repository", k: "code" },
          { t: "Quiz: What is the format of an image tag? What does the latest tag mean in production?", k: "quiz" }
        ]
      },
      {
        day: "Day 40", label: "Docker troubleshooting", tasks: [
          { t: "Concept: Inspecting container state, logs, resource limits, debugging crashed containers", k: "concept" },
          { t: "Code: Troubleshoot a container that exits immediately. Use docker logs, docker inspect, and docker exec to find the issue", k: "code" },
          { t: "Quiz: What command lets you open an interactive shell inside a running container?", k: "quiz" }
        ]
      },
      {
        day: "Day 41", label: "Kubernetes architecture", tasks: [
          { t: "Concept: Container orchestration, Control plane (API Server, Scheduler, etcd) vs Node components (Kubelet, Kube-Proxy)", k: "concept" },
          { t: "Code: Set up Minikube or Kind locally. Use kubectl to check cluster info and node states.", k: "code" },
          { t: "Quiz: What is the role of etcd in a Kubernetes cluster? What does Kubelet do?", k: "quiz" }
        ]
      },
      {
        day: "Day 42", label: "Kubernetes Pods", tasks: [
          { t: "Concept: Pods as atomic scheduling units, multi-container pods, pod life cycle", k: "concept" },
          { t: "Code: Define a Pod in YAML. Deploy it to your local cluster. Retrieve its logs and port-forward to test it.", k: "code" },
          { t: "Quiz: Why doesn't Kubernetes run containers directly instead of wrapping them in Pods?", k: "quiz" }
        ]
      },
      {
        day: "Day 43", label: "Kubernetes Deployments", tasks: [
          { t: "Concept: Deployments for stateless scaling, ReplicaSets, rollout history, rollback commands", k: "concept" },
          { t: "Code: Write a Deployment YAML to run 3 replicas of an Nginx web app. Perform a rolling update to a newer image.", k: "code" },
          { t: "Quiz: How does a Deployment handle a rolling update without downtime? What is a ReplicaSet?", k: "quiz" }
        ]
      },
      {
        day: "Day 44", label: "Kubernetes Services — Networking", tasks: [
          { t: "Concept: Pod IP volatility, Service abstraction. Service types (ClusterIP, NodePort, LoadBalancer)", k: "concept" },
          { t: "Code: Create a Service of type ClusterIP for your web app deployment. Test internal communication between pods.", k: "code" },
          { t: "Quiz: What is ClusterIP? How does a Service select which Pods to route traffic to?", k: "quiz" }
        ]
      },
      {
        day: "Day 45", label: "Kubernetes Services — LB & NodePort", tasks: [
          { t: "Concept: Exposing apps to the outside world, NodePort range, cloud-provider integration with LoadBalancer", k: "concept" },
          { t: "Code: Expose your Nginx deployment using a NodePort Service. Access it from your local machine.", k: "code" },
          { t: "Quiz: What is the default port range for NodePort? When would you use LoadBalancer?", k: "quiz" }
        ]
      },
      {
        day: "Day 46", label: "Kubernetes Ingress controllers", tasks: [
          { t: "Concept: Layer 7 routing, reverse proxy, Ingress resources, Ingress controllers (Nginx, Traefik), path-based routing", k: "concept" },
          { t: "Code: Enable ingress in Minikube, configure an Ingress resource with hostnames mapping to different internal services", k: "code" },
          { t: "Quiz: Ingress vs LoadBalancer service — what are the structural differences?", k: "quiz" }
        ]
      },
      {
        day: "Day 47", label: "Kubernetes ConfigMaps & Secrets", tasks: [
          { t: "Concept: Decoupling configuration from application code, mounting environment configs, secret encryption basics", k: "concept" },
          { t: "Code: Create a ConfigMap and a Secret. Mount them as environment variables and files in a Pod template", k: "code" },
          { t: "Quiz: Are Kubernetes Secrets encrypted by default in etcd? How can you secure secrets?", k: "quiz" }
        ]
      },
      {
        day: "Day 48", label: "Kubernetes Persistent Volumes", tasks: [
          { t: "Concept: Stateful applications, PersistentVolumes (PV), PersistentVolumeClaims (PVC), StorageClasses", k: "concept" },
          { t: "Code: Deploy a PostgreSQL Pod that uses a PVC to request storage. Verify data persists after deleting the Pod.", k: "code" },
          { t: "Quiz: What is dynamic volume provisioning? What is the relation between a PV and a PVC?", k: "quiz" }
        ]
      },
      {
        day: "Day 49", label: "Helm package manager basics", tasks: [
          { t: "Concept: Kubernetes templates, Helm charts structure, values.yaml, release lifecycle, repositories", k: "concept" },
          { t: "Code: Install Helm. Deploy a pre-built chart (e.g. Redis) to your cluster. Customize values and perform a Helm upgrade.", k: "code" },
          { t: "Quiz: What is a Helm Release? What is the role of values.yaml?", k: "quiz" }
        ]
      },
      {
        day: "Day 50", label: "Kubernetes resource management", tasks: [
          { t: "Concept: Pod CPU and Memory requests/limits, Out of Memory (OOM) kills, CPU throttling, namespaces", k: "concept" },
          { t: "Code: Deploy a pod with tight memory limits. Trigger load to cause an OOM kill, then view logs to diagnose.", k: "code" },
          { t: "Quiz: Difference between resource requests and resource limits?", k: "quiz" }
        ]
      }
    ]
  },
  {
    title: "Phase 4 — IaC & Config Management", days: "Days 51–65", icon: "☁", color: "#ff8c42", dim: "rgba(255,140,66,.1)", data: [
      {
        day: "Day 51", label: "Infrastructure as Code & Terraform", tasks: [
          { t: "Concept: Manual infrastructure vs IaC. Declarative vs imperative languages. Terraform architecture and providers", k: "concept" },
          { t: "Code: Install Terraform. Write a provider configuration for local (e.g., local_file) or cloud provider", k: "code" },
          { t: "Quiz: What is Infrastructure as Code? What are the main benefits of using Terraform?", k: "quiz" }
        ]
      },
      {
        day: "Day 52", label: "Terraform resources & variables", tasks: [
          { t: "Concept: Declaring resources, input variables, output variables, local variables", k: "concept" },
          { t: "Code: Write a configuration file to provision local directories and files using variables and outputs", k: "code" },
          { t: "Quiz: What is the purpose of outputs in Terraform? How can you pass variables at runtime?", k: "quiz" }
        ]
      },
      {
        day: "Day 53", label: "Terraform state management", tasks: [
          { t: "Concept: The terraform.tfstate file, why it is critical, state locking, local vs remote backends", k: "concept" },
          { t: "Code: Run terraform show, inspect state file. Configure a backend to store state (e.g. S3/local-backend config)", k: "code" },
          { t: "Quiz: Why is storing tfstate in Git a bad practice? How does state locking prevent collisions?", k: "quiz" }
        ]
      },
      {
        day: "Day 54", label: "Terraform commands & workflow", tasks: [
          { t: "Concept: The core Terraform workflow — Init, Plan, Apply, Destroy. Validating configuration", k: "concept" },
          { t: "Code: Execute a full resource creation workflow. Use terraform validate, fmt, plan, and apply", k: "code" },
          { t: "Quiz: What does terraform plan do? Can infrastructure be modified during the planning stage?", k: "quiz" }
        ]
      },
      {
        day: "Day 55", label: "Terraform providers deep dive", tasks: [
          { t: "Concept: Registry, official vs community providers, API interactions, authentication configurations", k: "concept" },
          { t: "Code: Configure the AWS provider in Terraform, set up local credentials, and initialize the provider", k: "code" },
          { t: "Quiz: What happens during terraform init regarding providers?", k: "quiz" }
        ]
      },
      {
        day: "Day 56", label: "Terraform modules", tasks: [
          { t: "Concept: Reusable infrastructure blocks, module syntax, input/output variables inside modules, calling modules", k: "concept" },
          { t: "Code: Refactor a single-file Terraform configuration into a custom reusable module (e.g. security group configuration)", k: "code" },
          { t: "Quiz: How do you reference module output variables from outside the module?", k: "quiz" }
        ]
      },
      {
        day: "Day 57", label: "Terraform dynamic blocks & loops", tasks: [
          { t: "Concept: Avoiding code repetition in resource configuration, count, for_each, dynamic blocks", k: "concept" },
          { t: "Code: Write a configuration that creates multiple servers using for_each based on a map of server settings", k: "code" },
          { t: "Quiz: When would you use count vs for_each in Terraform?", k: "quiz" }
        ]
      },
      {
        day: "Day 58", label: "Terraform workspaces & environments", tasks: [
          { t: "Concept: Managing multiple environments (Dev, Staging, Prod) with one code configuration, workspace management", k: "concept" },
          { t: "Code: Create dev and prod workspaces in Terraform. Provision resource names dynamically based on active workspace", k: "code" },
          { t: "Quiz: How do you switch workspaces? What are the limitations of workspaces for production segregation?", k: "quiz" }
        ]
      },
      {
        day: "Day 59", label: "Terraform import & state manipulation", tasks: [
          { t: "Concept: Importing existing pre-existing infrastructure into Terraform state, terraform state commands", k: "concept" },
          { t: "Code: Manually create a file or security group, write its Terraform definition, and use terraform import to link them", k: "code" },
          { t: "Quiz: Does terraform import generate configuration files automatically?", k: "quiz" }
        ]
      },
      {
        day: "Day 60", label: "Terraform CI/CD pipelines", tasks: [
          { t: "Concept: Running Terraform in CI/CD, automated checks, terraform plan pull request integration", k: "concept" },
          { t: "Code: Create a GitHub Actions workflow that runs terraform fmt, validate, and plan on pull request", k: "code" },
          { t: "Quiz: Why should you run terraform apply only on a merge trigger rather than on PR?", k: "quiz" }
        ]
      },
      {
        day: "Day 61", label: "Configuration management vs IaC", tasks: [
          { t: "Concept: Provisioning (Terraform) vs Configuration (Ansible), agentless architecture, YAML playbook structure", k: "concept" },
          { t: "Code: Install Ansible. Set up a simple inventory file mapping localhost or local VM", k: "code" },
          { t: "Quiz: What does agentless mean? When do you use Terraform together with Ansible?", k: "quiz" }
        ]
      },
      {
        day: "Day 62", label: "Ansible playbooks & ad-hoc commands", tasks: [
          { t: "Concept: Ad-hoc commands for quick tasks, playbooks for automation, tasks, modules", k: "concept" },
          { t: "Code: Run ad-hoc commands to ping servers and check system specs. Write a playbook to install git", k: "code" },
          { t: "Quiz: What is an Ansible inventory? How is it structured?", k: "quiz" }
        ]
      },
      {
        day: "Day 63", label: "Ansible variables, templates & handlers", tasks: [
          { t: "Concept: Parametrizing configurations, Jinja2 template rendering, handlers for conditional executions (restarting service)", k: "concept" },
          { t: "Code: Create a template for Nginx configuration, use variables for port, and trigger a handler to restart nginx on change", k: "code" },
          { t: "Quiz: What is a handler in Ansible? When does it run?", k: "quiz" }
        ]
      },
      {
        day: "Day 64", label: "Ansible roles", tasks: [
          { t: "Concept: Organizing playbook code, directories structures, sharing automation on Ansible Galaxy", k: "concept" },
          { t: "Code: Modularize your Nginx playbook into a structured Ansible Role with defaults, tasks, and templates", k: "code" },
          { t: "Quiz: What are the benefit of using Ansible Roles over single playbook files?", k: "quiz" }
        ]
      },
      {
        day: "Day 65", label: "Ansible security & Vault", tasks: [
          { t: "Concept: Encrypting sensitive data, passwords, private keys in playbooks, ansible-vault usage", k: "concept" },
          { t: "Code: Use ansible-vault to encrypt variables file containing database passwords. Run playbook passing vault password", k: "code" },
          { t: "Quiz: How does Ansible Vault secure secrets in source control repositories?", k: "quiz" }
        ]
      }
    ]
  },
  {
    title: "Phase 5 — Cloud (AWS) & GitOps", days: "Days 66–80", icon: "◈", color: "#b98aff", dim: "rgba(185,138,255,.1)", data: [
      {
        day: "Day 66", label: "Cloud basics & AWS IAM", tasks: [
          { t: "Concept: Public vs private cloud. AWS global infrastructure (Regions & AZs). IAM Users, Groups, Roles, Policies", k: "concept" },
          { t: "Code: Create an IAM user with programmatic access. Assign a policy with read-only access to S3", k: "code" },
          { t: "Quiz: Explain the Principle of Least Privilege. Difference between an IAM User and an IAM Role?", k: "quiz" }
        ]
      },
      {
        day: "Day 67", label: "AWS Virtual Private Cloud (VPC)", tasks: [
          { t: "Concept: Software-defined networking, subnets, route tables, Internet Gateway, NAT Gateway", k: "concept" },
          { t: "Code: Configure a custom VPC with 2 public subnets and 2 private subnets across two AZs", k: "code" },
          { t: "Quiz: Why do databases reside in private subnets? What is the function of a NAT Gateway?", k: "quiz" }
        ]
      },
      {
        day: "Day 68", label: "AWS EC2 & Security Groups", tasks: [
          { t: "Concept: Virtual machines in cloud, instance types, AMIs, key pairs, firewall rules (Security Groups)", k: "concept" },
          { t: "Code: Provision an EC2 instance in your public subnet. Secure it so it only allows SSH from your IP", k: "code" },
          { t: "Quiz: Security Group vs Network ACL (NACL) — explain the differences.", k: "quiz" }
        ]
      },
      {
        day: "Day 69", label: "AWS S3 & CloudFront", tasks: [
          { t: "Concept: Object storage, bucket policies, CDN caching, edge locations, HTTPS endpoint distribution", k: "concept" },
          { t: "Code: Create an S3 bucket, upload static assets, and configure a CloudFront distribution to serve them", k: "code" },
          { t: "Quiz: What is a CDN? How does S3 bucket policy ensure security while allowing CloudFront access?", k: "quiz" }
        ]
      },
      {
        day: "Day 70", label: "AWS RDS database service", tasks: [
          { t: "Concept: Managed databases, automated backups, multi-AZ deployment, database subnet groups", k: "concept" },
          { t: "Code: Provision a PostgreSQL database in RDS inside private subnets, allowing connections only from EC2 security group", k: "code" },
          { t: "Quiz: What are the benefits of RDS over managing database on an EC2 instance?", k: "quiz" }
        ]
      },
      {
        day: "Day 71", label: "AWS Elastic Container Registry (ECR)", tasks: [
          { t: "Concept: Managed Docker registries in AWS, authentication lifecycle, repository security policies", k: "concept" },
          { t: "Code: Create an ECR repository. Build your app locally, authenticate with ECR, and push your docker image", k: "code" },
          { t: "Quiz: How do you authenticate Docker CLI with AWS ECR?", k: "quiz" }
        ]
      },
      {
        day: "Day 72", label: "AWS Elastic Container Service (ECS)", tasks: [
          { t: "Concept: Managed container orchestration, ECS Fargate (serverless) vs EC2 launch types, task definitions, services", k: "concept" },
          { t: "Code: Write a Task Definition for your app image. Deploy it as an ECS Service using Fargate", k: "code" },
          { t: "Quiz: What is the difference between ECS Fargate and ECS EC2 launch types?", k: "quiz" }
        ]
      },
      {
        day: "Day 73", label: "AWS Load Balancers & Auto Scaling", tasks: [
          { t: "Concept: Application Load Balancers (ALB), Target Groups, Auto Scaling Groups (ASG), scaling policies", k: "concept" },
          { t: "Code: Configure an ALB to route traffic to your ECS service instances based on health checks", k: "code" },
          { t: "Quiz: What is target tracking scaling policy? How does an ALB health check work?", k: "quiz" }
        ]
      },
      {
        day: "Day 74", label: "AWS Elastic Kubernetes Service (EKS) I", tasks: [
          { t: "Concept: Managed Kubernetes clusters, control plane pricing, node groups (managed vs self-managed)", k: "concept" },
          { t: "Code: Create an EKS cluster using eksctl or Terraform. Connect kubectl locally to EKS", k: "code" },
          { t: "Quiz: What does eksctl automate behind the scenes?", k: "quiz" }
        ]
      },
      {
        day: "Day 75", label: "AWS Elastic Kubernetes Service (EKS) II", tasks: [
          { t: "Concept: EKS IAM Roles for Service Accounts (IRSA), AWS ALB Ingress Controller", k: "concept" },
          { t: "Code: Deploy a web app deployment to EKS and expose it through an AWS Application Load Balancer", k: "code" },
          { t: "Quiz: How does EKS IRSA associate IAM permissions with Kubernetes Pods?", k: "quiz" }
        ]
      },
      {
        day: "Day 76", label: "GitOps philosophy & ArgoCD", tasks: [
          { t: "Concept: Git as single source of truth for infrastructure. Pull vs push deployment models. ArgoCD architecture", k: "concept" },
          { t: "Code: Install ArgoCD into your Kubernetes cluster. Connect it to a public GitHub repository", k: "code" },
          { t: "Quiz: Why is GitOps pull model considered more secure than traditional CI/CD push model?", k: "quiz" }
        ]
      },
      {
        day: "Day 77", label: "ArgoCD applications & deployments", tasks: [
          { t: "Concept: Application CRD, sync options (auto vs manual), self-healing, pruning resources", k: "concept" },
          { t: "Code: Define an ArgoCD Application in YAML. Synchronize a deployment from GitHub to your cluster", k: "code" },
          { t: "Quiz: What does self-healing do in ArgoCD? Explain resource pruning.", k: "quiz" }
        ]
      },
      {
        day: "Day 78", label: "GitOps with Helm & Kustomize", tasks: [
          { t: "Concept: Managing environment variations (Dev/Prod) in GitOps. ArgoCD integration with Helm and Kustomize", k: "concept" },
          { t: "Code: Deploy a Helm chart through ArgoCD, overriding parameter values dynamically in the Application manifest", k: "code" },
          { t: "Quiz: How does ArgoCD render Helm charts before applying them to Kubernetes?", k: "quiz" }
        ]
      },
      {
        day: "Day 79", label: "Secrets management in GitOps", tasks: [
          { t: "Concept: Handling secrets in Git repositories. HashiCorp Vault, Sealed Secrets, External Secrets Operator", k: "concept" },
          { t: "Code: Install Sealed Secrets. Encrypt a local secret into a SealedSecret manifest that can be safely committed to Git", k: "code" },
          { t: "Quiz: How does Sealed Secrets decrypt the manifest inside the cluster?", k: "quiz" }
        ]
      },
      {
        day: "Day 80", label: "GitOps drift detection", tasks: [
          { t: "Concept: Detecting differences between cluster state and Git code repository, out-of-sync indicators", k: "concept" },
          { t: "Code: Manually modify a deployment in the cluster using kubectl. Observe drift in ArgoCD and trigger auto-sync to revert it", k: "code" },
          { t: "Quiz: What is configuration drift?", k: "quiz" }
        ]
      }
    ]
  },
  {
    title: "Phase 6 — Observability & Capstone", days: "Days 81–90", icon: "◉", color: "#ffc850", dim: "rgba(255,200,80,.1)", data: [
      {
        day: "Day 81", label: "Observability principles", tasks: [
          { t: "Concept: The three pillars of observability — Metrics, Logs, Traces. White-box vs black-box monitoring", k: "concept" },
          { t: "Code: Set up basic application health endpoints (/health, /metrics) in a web application", k: "code" },
          { t: "Quiz: Explain the difference between Monitoring and Observability.", k: "quiz" }
        ]
      },
      {
        day: "Day 82", label: "Prometheus monitoring", tasks: [
          { t: "Concept: Time-series database, pull-based metric collection, scrapers, PromQL query language", k: "concept" },
          { t: "Code: Install Prometheus in your cluster. Configure it to scrape metrics from your application service", k: "code" },
          { t: "Quiz: How does pull-based scraping work? What is a target in Prometheus?", k: "quiz" }
        ]
      },
      {
        day: "Day 83", label: "Grafana dashboards", tasks: [
          { t: "Concept: Data visualization, connecting Grafana to Prometheus, panel types, variables in dashboards", k: "concept" },
          { t: "Code: Install Grafana, connect to Prometheus, import the node-exporter dashboard, and create a custom panel", k: "code" },
          { t: "Quiz: What is a data source in Grafana?", k: "quiz" }
        ]
      },
      {
        day: "Day 84", label: "Log aggregation (Loki/ELK)", tasks: [
          { t: "Concept: Centralized logging, log shippers (Promtail, Fluentd), indexing logs vs time-series", k: "concept" },
          { t: "Code: Deploy Promtail and Loki to aggregate logs from all container namespaces in your cluster", k: "code" },
          { t: "Quiz: Why is centralizing logs critical in containerized environments?", k: "quiz" }
        ]
      },
      {
        day: "Day 85", label: "Tracing with Jaeger/OpenTelemetry", tasks: [
          { t: "Concept: Distributed tracing, spans, trace context propagation, debugging latency in microservices", k: "concept" },
          { t: "Code: Instrument a simple app with OpenTelemetry SDK to record spans and export them to Jaeger", k: "code" },
          { t: "Quiz: What is a span? How does trace context get sent between different service requests?", k: "quiz" }
        ]
      },
      {
        day: "Day 86", label: "Capstone project — Architecture", tasks: [
          { t: "Project: Design a multi-tier microservice application (Frontend, Backend API, Database) to be fully automated", k: "project" },
          { t: "Code: Create the repository, configure standard Dockerfiles, and verify local docker-compose configuration", k: "code" },
          { t: "Quiz: Draw/explain the architectural design of the capstone project.", k: "quiz" }
        ]
      },
      {
        day: "Day 87", label: "Capstone project — Provisioning", tasks: [
          { t: "Project: Automate EKS cluster, RDS Database, VPC, and Security Groups creation using Terraform", k: "project" },
          { t: "Code: Write and execute the Terraform files. Verify the AWS resources are created and accessible", k: "code" },
          { t: "Quiz: Explain the dependency order of the resources provisioned.", k: "quiz" }
        ]
      },
      {
        day: "Day 88", label: "Capstone project — GitOps setup", tasks: [
          { t: "Project: Set up ArgoCD in the EKS cluster, creating Application definitions pointing to the capstone repository", k: "project" },
          { t: "Code: Push Helm templates of the microservices to GitHub. Trigger ArgoCD sync and verify pods run correctly", k: "code" },
          { t: "Quiz: How does the backend microservice authenticate with the RDS database in this setup?", k: "quiz" }
        ]
      },
      {
        day: "Day 89", label: "Capstone project — Monitoring", tasks: [
          { t: "Project: Integrate Prometheus/Grafana stack in EKS. Set up dashboards for CPU, memory, database load", k: "project" },
          { t: "Code: Trigger high traffic to the app. Monitor the Grafana graphs and verify autoscaling works under load", k: "code" },
          { t: "Quiz: What metrics did you use to define scaling events?", k: "quiz" }
        ]
      },
      {
        day: "Day 90", label: "Capstone project — Final review", tasks: [
          { t: "Project: Run end-to-end integration checks. Clean up all provisioned AWS resources using Terraform destroy", k: "project" },
          { t: "Code: Write a detailed project write-up detailing architecture, automation, pipelines, and monitoring metrics", k: "code" },
          { t: "Quiz: Present your DevOps pipeline out loud. What were the main engineering challenges you resolved?", k: "quiz" }
        ]
      }
    ]
  },
];

let PHASES = FRONTEND_PHASES;
