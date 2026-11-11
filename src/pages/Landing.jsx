const FEATURES = [
  { icon: '🎲', title: 'Dynamic Questions', desc: 'Algorithmically generated — never the same drill twice!', color: 'bg-warning/10 text-warning' },
  { icon: '🪜', title: '9 Skill Levels', desc: 'From Junior to Level 8, perfectly matched to every learner.', color: 'bg-sky/10 text-sky' },
  { icon: '✖️', title: 'Tables Mastery', desc: 'Master multiplication tables 2× through 100× with speed challenges.', color: 'bg-lime/10 text-lime' },
  { icon: '🏆', title: 'Competitions', desc: 'Weekly challenges with fair seeding & leaderboards.', color: 'bg-gold/10 text-gold' },
  { icon: '🎖️', title: 'Earn Badges', desc: 'Speed Demon, Perfect Score, Streak Warrior & more!', color: 'bg-accent/10 text-accent' },
  { icon: '🔥', title: 'Day Streaks', desc: 'Build daily habits with streak tracking & milestone celebrations.', color: 'bg-tangerine/10 text-tangerine' },
  { icon: '📊', title: 'Leaderboards', desc: 'Compete on points, speed, and accuracy across all modules.', color: 'bg-primary/10 text-primary' },
  { icon: '⏱️', title: 'Timed Challenges', desc: 'Infinite mode, 2-10 min sessions — solve as many as you can!', color: 'bg-destructive/10 text-destructive' }
];

const STEPS = [
  { step: '1', title: 'Start a Drill', desc: 'Pick an operation and a difficulty level to begin.' },
  { step: '2', title: 'Race the Clock', desc: 'Solve 10 questions before the timer runs out.' },
  { step: '3', title: 'Instant Feedback', desc: 'Know right away if your answer was correct.' },
  { step: '4', title: 'Track Your Speed', desc: 'Review your score, accuracy and time per question.' }
];

export default function Landing({ user, onStart, onDashboard }) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow-primary">
              <span className="text-lg text-primary-foreground">🧮</span>
            </div>
            <span className="text-lg font-extrabold">Abakids</span>
          </div>
          <button
            onClick={onDashboard}
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        </div>
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-scale-in">
              <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-hero text-6xl shadow-glow-primary hover-scale-sm md:h-44 md:w-44 md:text-8xl">🧮</div>
            </div>
            <div className="animate-slide-up stagger-1 mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                ⚡ Test Your Math Speed
              </span>
            </div>
            <h1 className="animate-slide-up stagger-2 mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl lg:text-8xl">
              <span className="text-gradient-primary">Abakids</span>
              <br />
              <span className="text-foreground">Math Speed Challenge</span>
            </h1>
            <p className="animate-slide-up stagger-3 mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              How fast can you solve? Race the clock through addition, subtraction, multiplication, division, tables and decimals — with instant feedback and 9 difficulty levels.
            </p>
            <div className="animate-slide-up stagger-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-hero text-primary-foreground shadow-glow-primary hover:opacity-90 hover-lift text-base px-8 h-14 rounded-xl font-semibold transition-colors"
              >
                {user ? 'Start Practicing' : 'Get Started Free'}
                <span className="h-5 w-5">→</span>
              </button>
              <button
                onClick={onDashboard}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-input bg-background text-base px-8 h-14 font-semibold hover-scale-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="animate-slide-up text-3xl font-extrabold md:text-5xl mb-4">
              Why Kids <span className="text-gradient-primary">Love It</span>
            </h2>
            <p className="animate-slide-up stagger-1 text-muted-foreground text-lg">Built to sharpen mental math speed</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon, title, desc, color }, i) => (
              <div
                key={title}
                className="animate-slide-up group rounded-2xl border border-border bg-card p-5 transition-smooth hover-lift"
                style={{ animationDelay: `${0.05 * (i + 1)}s` }}
              >
                <div className={`mb-3 inline-flex rounded-xl p-3 text-2xl ${color}`}>{icon}</div>
                <h3 className="mb-2 font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="border-t border-border bg-secondary/40 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-extrabold md:text-5xl mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Four simple steps to math mastery</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="rounded-2xl border border-border bg-card p-6 transition-smooth hover-lift">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero font-bold text-primary-foreground shadow-glow-primary">
                  {step}
                </div>
                <h3 className="mb-2 font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="border-t border-border py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-hero p-10 text-center shadow-glow-primary">
            <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground md:text-4xl">Ready to test your speed?</h2>
            <p className="mb-8 text-primary-foreground/90">Warm up, hit start, and see how many you can solve before the clock runs out.</p>
            <button
              onClick={onStart}
              className="inline-flex h-14 items-center justify-center rounded-xl bg-card px-8 text-base font-semibold text-primary transition-colors hover:bg-muted"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <span>Abakids — Test Your Math Speed</span>
          <span>Timed mental math drills</span>
        </div>
      </footer>
    </div>
  );
}
