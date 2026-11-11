import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase.js';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Practice from './pages/Practice.jsx';

export default function App() {
  const [route, setRoute] = useState('landing');
  const [operation, setOperation] = useState('addition');
  const [level, setLevel] = useState('junior');
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const pick = (op, lvl) => {
    setOperation(op);
    if (lvl) setLevel(lvl);
    setRoute('practice');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRoute('landing');
  };

  return (
    <>
      {route === 'landing' && (
        <Landing
          user={user}
          onStart={() => setRoute(user ? 'dashboard' : 'login')}
          onDashboard={() => setRoute(user ? 'dashboard' : 'login')}
        />
      )}
      {route === 'login' && (
        <Login
          onLogin={(nextUser) => {
            setUser(nextUser);
            setRoute('dashboard');
          }}
        />
      )}
      {route === 'dashboard' && (
        <Dashboard
          user={user}
          level={level}
          onLevel={setLevel}
          onPick={pick}
          onHome={() => setRoute('landing')}
          onSignOut={signOut}
        />
      )}
      {route === 'practice' && (
        <Practice operation={operation} level={level} onBack={() => setRoute('dashboard')} userId={user?.id} />
      )}
    </>
  );
}
