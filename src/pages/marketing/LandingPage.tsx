import { Link } from "react-router-dom";

const pillars = [
  {
    title: "Students",
    copy: "Catalog, enrollments, and submissions in a dedicated workspace — no grading or admin noise.",
    accent: "from-cyan-400/35 to-teal-800/45",
  },
  {
    title: "Instructors",
    copy: "Author courses, run a grading queue, and read teaching analytics without touching directory governance.",
    accent: "from-teal-400/35 to-emerald-900/40",
  },
  {
    title: "Admins",
    copy: "Users, audit trails, and platform reports via Azure-ready APIs — separate from classroom workflows.",
    accent: "from-teal-500/40 to-cyan-950/45",
  },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--mesh-a),_transparent_55%),radial-gradient(ellipse_at_bottom,_var(--mesh-b),_transparent_50%)]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-teal-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-950 text-lg font-black text-white shadow-[0_20px_50px_var(--brand-glow)] ring-2 ring-teal-200/30">
            A
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-[var(--link-soft)]">Alma LMS</p>
            <p className="text-xs text-[var(--muted)]">Depth-first learning OS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-[var(--text)] ring-1 ring-white/20 transition hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-teal-500 to-teal-900 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_40px_var(--brand-glow)]"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100 ring-1 ring-teal-400/25">
              Modular · Secure · Azure-ready
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A 3D-grade LMS experience for every role —{" "}
              <span className="bg-gradient-to-r from-teal-200 via-white to-cyan-200 bg-clip-text text-transparent">
                without mixing their worlds.
              </span>
            </h1>
            <p className="max-w-xl text-lg text-[var(--muted)]">
              Students learn in one lane, instructors teach in another, and admins govern the platform. OAuth with
              Microsoft Entra ID (Azure AD) is wired for single sign-on when you drop in tenant and client IDs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-teal-500 to-teal-950 px-6 py-3 text-base font-semibold text-white shadow-[0_22px_55px_var(--brand-glow)]"
              >
                Start free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-[var(--text)] shadow-inner backdrop-blur transition hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
            <dl className="grid grid-cols-3 gap-4 pt-4 text-center sm:max-w-lg">
              {[
                ["120+", "Courses"],
                ["8k+", "Learners"],
                ["99.9%", "Uptime goal"],
              ].map(([k, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                >
                  <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{l}</dt>
                  <dd className="text-xl font-bold text-[var(--text)]">{k}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative" style={{ perspective: "1200px" }}>
            <div
              className="relative transform-gpu transition-transform duration-700 hover:[transform:perspective(1200px)_rotateX(3deg)_rotateY(-4deg)_translateZ(0)]"
              style={{
                transformStyle: "preserve-3d",
                transform: "perspective(1200px) rotateX(6deg) rotateY(-8deg)",
              }}
            >
              <div
                className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal-500/45 via-transparent to-cyan-400/25 blur-2xl"
                style={{ transform: "translateZ(-40px)" }}
              />
              <div
                className="relative space-y-4 rounded-[2rem] border border-white/15 bg-[var(--panel)]/80 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                style={{ transform: "translateZ(24px)" }}
              >
                <p className="text-sm font-semibold text-teal-100">Live stack</p>
                <ul className="space-y-3 text-sm text-[var(--muted)]">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_12px_#2dd4bf]" />
                    Express API layered with factories, strategies, and decorators
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                    Redux Toolkit + Axios + role-scoped React routes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                    Microsoft identity (MSAL) optional — same email as an LMS user
                  </li>
                </ul>
                <div
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 text-xs text-teal-50/95"
                  style={{ transform: "translateZ(40px)" }}
                >
                  Tip: run <code className="text-white">npm run dev</code> — the API is embedded in Vite so login
                  always reaches the server (no proxy ECONNREFUSED).
                </div>
              </div>
              <div
                className="pointer-events-none absolute -bottom-8 right-4 h-28 w-44 rounded-2xl border border-white/10 bg-white/10 opacity-80 shadow-xl"
                style={{ transform: "translateZ(8px) rotateY(12deg)" }}
              />
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="card-3d group rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-[var(--shadow-3d)]"
            >
              <div
                className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${p.accent}`}
              >
                {p.title}
              </div>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{p.copy}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
