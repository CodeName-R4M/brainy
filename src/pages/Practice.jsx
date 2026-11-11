import { useEffect, useRef, useState } from 'react';
import { generateSet, OPERATION_LABELS, levelLabel } from '../data/questions.js';
import { recordSession } from '../data/stats.js';

const QUESTION_COUNT = 10;
const DURATION_SECONDS = 120;

function ColumnQuestion({ numbers, operator, operators, isDecimal }) {
  const fmt = (c) => (isDecimal ? Number(c).toFixed(2) : String(c));
  const strs = numbers.map(fmt);
  const width = Math.max(...strs.map((s) => s.length));
  const small = numbers.length >= 6;
  const opAt = (i) => {
    if (i === 0) return '';
    if (operators && operators.length) return operators[i - 1] || operator;
    return i === numbers.length - 1 ? operator : '';
  };
  return (
    <div className={`inline-block font-mono font-bold ${small ? 'text-2xl leading-tight md:text-4xl md:leading-snug' : 'text-3xl leading-snug md:text-5xl md:leading-snug'}`}>
      {strs.map((s, i) => (
        <div key={i} className="flex items-baseline justify-end">
          <span className={`text-right text-muted-foreground select-none ${small ? 'w-6 md:w-10' : 'w-8 md:w-12'}`}>{opAt(i)}</span>
          <span className="text-foreground tracking-wider">{s.padStart(width, '\u00A0')}</span>
        </div>
      ))}
      <div className="flex justify-end">
        <span className={small ? 'w-6 md:w-10' : 'w-8 md:w-12'} />
        <div className="mt-1 w-full border-t-[3px] border-foreground" />
      </div>
    </div>
  );
}

export default function Practice({ operation, level, onBack, userId }) {
  const [questions, setQuestions] = useState(() => generateSet(operation, QUESTION_COUNT, level));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [value, setValue] = useState('');
  const [quotient, setQuotient] = useState('');
  const [remainder, setRemainder] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [seconds, setSeconds] = useState(DURATION_SECONDS);
  const [complete, setComplete] = useState(false);
  const startRef = useRef(Date.now());
  const inputRef = useRef(null);
  const recordedRef = useRef(false);

  const current = !complete && index < questions.length ? questions[index] : null;
  const correctCount = answers.filter((a) => a.correct).length;
  const accuracy = answers.length ? Math.round((correctCount / answers.length) * 100) : 0;

  useEffect(() => {
    if (complete) return;
    if (seconds <= 0) { setComplete(true); return; }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds, complete]);

  useEffect(() => {
    if (current && !feedback) inputRef.current?.focus();
  }, [index, feedback, current]);

  useEffect(() => {
    if (!complete || recordedRef.current) return;
    recordedRef.current = true;
    recordSession(userId, { score, correct: correctCount, total: answers.length });
  }, [complete, userId, score, correctCount, answers.length]);

  const submit = (e) => {
    e.preventDefault();
    if (!current || feedback) return;
    const elapsed = (Date.now() - startRef.current) / 1000;
    let correct, given, correctText;
    if (current.isDivision && current.divisionAnswer) {
      const q = parseInt(quotient, 10);
      const r = parseInt(remainder || '0', 10);
      correct = q === current.divisionAnswer.quotient && r === current.divisionAnswer.remainder;
      given = `Q:${quotient || '–'} R:${remainder || '0'}`;
      correctText = `Q:${current.divisionAnswer.quotient} R:${current.divisionAnswer.remainder}`;
    } else {
      const v = parseFloat(value);
      correct = !Number.isNaN(v) && Math.abs(v - current.answer) < 0.01;
      given = value;
      correctText = String(current.answer);
    }
    const points = correct ? 10 + (elapsed < 5 ? Math.floor(5 - elapsed) : 0) : 0;
    setScore((s) => s + points);
    setAnswers((a) => [...a, { questionText: current.questionText, answerGiven: given, correctAnswer: correctText, correct, timeSeconds: Math.round(elapsed * 10) / 10 }]);
    setFeedback({ correct, correctAnswer: correctText });

    setTimeout(() => {
      setFeedback(null);
      setValue(''); setQuotient(''); setRemainder('');
      startRef.current = Date.now();
      if (index + 1 >= questions.length) setComplete(true);
      else setIndex((i) => i + 1);
    }, 900);
  };

  const playAgain = () => {
    setQuestions(generateSet(operation, QUESTION_COUNT, level));
    setIndex(0); setAnswers([]); setScore(0); setComplete(false);
    setValue(''); setQuotient(''); setRemainder(''); setFeedback(null);
    setSeconds(DURATION_SECONDS); startRef.current = Date.now();
    recordedRef.current = false;
  };

  if (complete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md animate-scale-in">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-hero text-4xl shadow-glow-primary">🎉</div>
            <h1 className="text-3xl font-extrabold">Great job!</h1>
            <p className="mt-1 text-muted-foreground">{OPERATION_LABELS[operation]} · {levelLabel(level)}</p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Score', value: score },
              { label: 'Correct', value: `${correctCount}/${answers.length}` },
              { label: 'Accuracy', value: `${accuracy}%` }
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-6 max-h-64 overflow-y-auto rounded-xl border border-border bg-card divide-y divide-border">
            {answers.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className={a.correct ? 'text-success' : 'text-destructive'}>{a.correct ? '✅' : '❌'}</span>
                <span className="flex-1 truncate font-mono">{a.questionText}</span>
                {!a.correct && <span className="whitespace-nowrap text-xs text-muted-foreground">You: {a.answerGiven} · Ans: {a.correctAnswer}</span>}
                <span className="text-xs text-muted-foreground">{a.timeSeconds}s</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={playAgain} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-gradient-hero font-semibold text-primary-foreground shadow-glow-primary transition-colors hover:opacity-90">
              🔁 Play Again
            </button>
            <button onClick={onBack} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background font-semibold transition-colors hover:bg-accent hover:text-accent-foreground">
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background practice-page">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">← End</button>
        <div className={`font-mono text-2xl font-bold ${seconds <= 10 ? 'text-destructive animate-pulse' : 'text-warning'}`}>{seconds}s</div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="mb-4 text-sm text-muted-foreground">
          Question {Math.min(index + 1, questions.length)}/{questions.length} · ✅ {correctCount}
          {answers.length > 0 && ` · ${accuracy}%`}
        </p>

        <div className={`mb-6 ${feedback ? (feedback.correct ? 'animate-scale-in' : 'animate-shake') : 'animate-slide-up'}`}>
          {current.numbers && current.numbers.length > 0 ? (
            <ColumnQuestion
              numbers={current.numbers}
              operator={current.operator || '+'}
              operators={current.isMixedOps ? current.operators : undefined}
              isDecimal={['decimal_addition', 'decimal_subtraction', 'decimal_mixed'].includes(current.type)}
            />
          ) : (
            <div className="text-center font-mono text-4xl font-bold md:text-6xl">{current.questionText} = ?</div>
          )}
        </div>

        {feedback && (
          <div className={`mb-4 text-lg font-semibold ${feedback.correct ? 'text-success' : 'text-destructive'}`}>
            {feedback.correct ? '✅ Correct!' : `❌ Answer: ${feedback.correctAnswer}`}
          </div>
        )}

        {current.isDivision ? (
          <form onSubmit={submit} className="w-full max-w-xs space-y-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-muted-foreground">Quotient</label>
              <input
                ref={inputRef} type="text" inputMode="numeric" value={quotient} onChange={(e) => setQuotient(e.target.value)}
                disabled={!!feedback} placeholder="Quotient" autoComplete="off"
                className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-center font-mono text-2xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-muted-foreground">Remainder</label>
              <input
                type="text" inputMode="numeric" value={remainder} onChange={(e) => setRemainder(e.target.value)}
                disabled={!!feedback} placeholder="Remainder (blank = 0)" autoComplete="off"
                className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-center font-mono text-2xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button type="submit" disabled={!!feedback} className="w-full rounded-xl bg-gradient-hero py-4 text-lg font-bold text-primary-foreground shadow-glow-primary transition-opacity hover:opacity-90 disabled:opacity-50">
              Submit Answer
            </button>
          </form>
        ) : (
          <form onSubmit={submit} className="w-full max-w-xs">
            <input
              ref={inputRef} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)}
              disabled={!!feedback} placeholder="Your answer" autoComplete="off"
              className="mb-4 w-full rounded-xl border-2 border-border bg-card px-4 py-4 text-center font-mono text-2xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" disabled={!!feedback} className="w-full rounded-xl bg-gradient-hero py-4 text-lg font-bold text-primary-foreground shadow-glow-primary transition-opacity hover:opacity-90 disabled:opacity-50">
              Submit Answer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
