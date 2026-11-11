import { OPERATION_LABELS, LEVELS, levelLabel } from '../data/questions.js';
import { loadStats, accuracyOf } from '../data/stats.js';

const MODULES = [
  { op: 'addition', emoji: '+', color: 'bg-warning/10 text-warning' },
  { op: 'subtraction', emoji: '−', color: 'bg-sky/10 text-sky' },
  { op: 'multiplication', emoji: '×', color: 'bg-lime/10 text-lime' },
  { op: 'division', emoji: '÷', color: 'bg-accent/10 text-accent' },
  { op: 'tables', emoji: '▥', color: 'bg-gold/10 text-gold' },
  { op: 'mixed_operations', emoji: '⇄', color: 'bg-tangerine/10 text-tangerine' },
  { op: 'decimal_addition', emoji: '∑', color: 'bg-primary/10 text-primary' },
  { op: 'decimal_subtraction', emoji: '∑', color: 'bg-destructive/10 text-destructive' }
];

export default function Dashboard({ user, level, onLevel, onPick, onHome, onSignOut }) {
  const displayName = user?.user_metadata?.full_name || user?.email || 'Student';
  const stats = loadStats(user?.id);
  const accuracy = accuracyOf(stats);

  const cards = [
    { label: 'Points', value: stats.points.toLocaleString(), icon: '★', color: 'bg-gold/10 text-gold' },
    { label: 'Day Streak', value: stats.streak, icon: '↗', color: 'bg-tangerine/10 text-tangerine' },
    { label: 'Accuracy', value: accuracy == null ? '—' : `${accuracy}%`, icon: '◎', color: 'bg-success/10 text-success' },
    { label: 'Level', value: levelLabel(level), icon: '9', color: 'bg-sky/10 text-sky' }
  ];

  const isNew = stats.sessions === 0;

  return (
    <div className="min-h-screen bg-background dashboard-page">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow-primary">
              <span className="text-lg font-black text-primary-foreground" aria-hidden="true">A</span>
            </div>
            <span className="text-lg font-extrabold">Abakids</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onHome}
              className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </button>
            <button
              onClick={onSignOut}
              className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* welcome banner */}
        <section className="animate-slide-up mb-8 overflow-hidden rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-glow-primary md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-foreground/90">Welcome back</p>
              <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">Hi, {displayName}!</h1>
              <p className="mt-2 max-w-xl text-sm text-primary-foreground/90">
                {isNew
                  ? "You're just getting started. Pick a module below and solve your first drill to start earning points."
                  : `You've completed ${stats.sessions} drill${stats.sessions === 1 ? '' : 's'}. Keep the streak going!`}
              </p>
            </div>
            <div className="hidden text-5xl font-black md:block" aria-hidden="true">+ ×</div>
          </div>
        </section>

        {/* stats */}
        <div className="animate-slide-up stagger-1 mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 transition-smooth hover-lift">
              <div className={`mb-3 inline-flex rounded-xl p-2 text-xl ${s.color}`}>{s.icon}</div>
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* skill level */}
        <div className="animate-slide-up stagger-2 mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Skill Level:</span>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => onLevel(l)}
                className={
                  'inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors ' +
                  (l === level
                    ? 'bg-gradient-hero text-primary-foreground shadow-glow-primary'
                    : 'border border-border bg-card hover:bg-muted')
                }
              >
                {levelLabel(l)}
              </button>
            ))}
          </div>
        </div>

        {/* modules */}
        <h2 className="animate-slide-up stagger-2 mb-4 text-xl font-extrabold">Choose a module</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m, i) => (
            <button
              key={m.op}
              onClick={() => onPick(m.op, level)}
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
              className="animate-slide-up group rounded-2xl border border-border bg-card p-5 text-left transition-smooth hover-lift"
            >
              <div className={`mb-3 inline-flex rounded-xl p-3 text-2xl ${m.color}`}>{m.emoji}</div>
              <h3 className="mb-1 font-bold">{OPERATION_LABELS[m.op]}</h3>
              <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary">Start practice →</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
