import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const isRegister = mode === 'register';

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          onLogin(data.user);
        } else {
          setNotice('Account created. Check your email to confirm it, then sign in.');
          setMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow-primary">
            <span className="text-3xl text-primary-foreground">🧮</span>
          </div>
          <h1 className="text-3xl font-extrabold">Abakids</h1>
          <p className="mt-1 text-muted-foreground">Test Your Math Speed</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={
                'rounded-lg py-2 text-sm font-semibold transition-colors ' +
                (!isRegister ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')
              }
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={
                'rounded-lg py-2 text-sm font-semibold transition-colors ' +
                (isRegister ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')
              }
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary/50"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-hero px-4 py-3.5 font-semibold text-primary-foreground shadow-glow-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}
          {notice && <p className="mt-3 text-center text-sm text-success">{notice}</p>}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            onClick={() => switchMode(isRegister ? 'signin' : 'register')}
            className="font-semibold text-primary hover:underline"
          >
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </div>
    </div>
  );
}
