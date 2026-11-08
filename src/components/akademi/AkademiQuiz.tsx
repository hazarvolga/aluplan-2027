'use client';

import { useEffect, useMemo, useState } from 'react';
import type { QuizQuestion } from '@/data/akademi-content';
import styles from './AkademiQuiz.module.css';

interface SavedResult {
  score: number;
  total: number;
  at: number;
}

/** localStorage key for a module's self-assessment result (per-browser only). */
function storageKey(moduleCode: string): string {
  return `akademi-quiz-${moduleCode}`;
}

function readSaved(moduleCode: string): SavedResult | null {
  try {
    const raw = window.localStorage.getItem(storageKey(moduleCode));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedResult;
    if (typeof parsed.score === 'number' && typeof parsed.total === 'number') return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeSaved(moduleCode: string, result: SavedResult): void {
  try {
    window.localStorage.setItem(storageKey(moduleCode), JSON.stringify(result));
  } catch {
    // Private windows or blocked storage: the quiz still works, it just isn't remembered.
  }
}

function correctIndex(question: QuizQuestion): number {
  return question.options.findIndex((o) => o.correct);
}

/**
 * Interactive self-assessment quiz. One shot per question: pick an option, see whether it
 * was right and read the explanation. Results live only in this browser's localStorage.
 */
export function AkademiQuiz({
  moduleCode,
  questions,
}: {
  moduleCode: string;
  questions: readonly QuizQuestion[];
}) {
  const total = questions.length;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<SavedResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(readSaved(moduleCode));
    setHydrated(true);
  }, [moduleCode]);

  const answeredCount = Object.keys(answers).length;
  const score = useMemo(
    () =>
      questions.reduce((sum, q) => {
        const picked = answers[q.id];
        return picked !== undefined && q.options[picked]?.correct ? sum + 1 : sum;
      }, 0),
    [answers, questions],
  );

  const allAnswered = answeredCount === total && total > 0;

  useEffect(() => {
    if (allAnswered) {
      const result = { score, total, at: Date.now() };
      writeSaved(moduleCode, result);
      setSaved(result);
    }
  }, [allAnswered, score, total, moduleCode]);

  function pick(questionId: string, optionIndex: number): void {
    setAnswers((prev) => (prev[questionId] !== undefined ? prev : { ...prev, [questionId]: optionIndex }));
  }

  function reset(): void {
    setAnswers({});
    try {
      window.localStorage.removeItem(storageKey(moduleCode));
    } catch {
      // ignore
    }
    setSaved(null);
  }

  if (total === 0) return null;

  return (
    <div className={styles.quiz}>
      <div className={styles.head}>
        <p className={styles.progress}>
          {answeredCount} / {total} yanıtlandı
          {answeredCount > 0 && <span className={styles.score}> · {score} doğru</span>}
        </p>
        {hydrated && saved && answeredCount === 0 && (
          <p className={styles.savedNote}>
            Daha önce çözdünüz: {saved.score}/{saved.total}.{' '}
            <button type="button" className={styles.linkButton} onClick={reset}>
              Tekrar çöz
            </button>
          </p>
        )}
      </div>

      <ol className={styles.questions}>
        {questions.map((question, qi) => {
          const picked = answers[question.id];
          const answered = picked !== undefined;
          const correct = correctIndex(question);
          return (
            <li key={question.id} className={styles.question}>
              <fieldset className={styles.fieldset}>
                <legend className={styles.prompt}>
                  <span className={styles.qNo}>{qi + 1}.</span> {question.prompt}
                </legend>
                <div className={styles.options} role="group">
                  {question.options.map((option, oi) => {
                    const isCorrect = oi === correct;
                    const isPicked = oi === picked;
                    const state = !answered
                      ? 'idle'
                      : isCorrect
                      ? 'correct'
                      : isPicked
                      ? 'wrong'
                      : 'muted';
                    return (
                      <button
                        key={oi}
                        type="button"
                        className={styles.option}
                        data-state={state}
                        aria-pressed={isPicked}
                        aria-disabled={answered}
                        onClick={() => {
                          if (!answered) pick(question.id, oi);
                        }}
                      >
                        <span className={styles.marker} aria-hidden="true">
                          {answered && isCorrect ? '✓' : answered && isPicked ? '✕' : String.fromCharCode(65 + oi)}
                        </span>
                        {answered && isCorrect && <span className={styles.srOnly}>Doğru cevap: </span>}
                        <span className={styles.optionText}>{option.text}</span>
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className={styles.explanation} role="status">
                    <p className={styles.verdict}>
                      {question.options[picked]?.correct ? 'Doğru.' : 'Yanlış.'}
                    </p>
                    <p className={styles.explanationText}>{question.explanation}</p>
                    {(question.bloom || question.difficulty || question.outcomeCode) && (
                      <p className={styles.tags}>
                        {question.difficulty && <span className={styles.tag}>{question.difficulty}</span>}
                        {question.bloom && <span className={styles.tag}>{question.bloom}</span>}
                        {question.outcomeCode && <span className={styles.tagCode}>{question.outcomeCode}</span>}
                      </p>
                    )}
                  </div>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {allAnswered && (
        <div className={styles.result} role="status">
          <p className={styles.resultScore}>
            Sonuç: {score} / {total} doğru
          </p>
          <button type="button" className={styles.linkButton} onClick={reset}>
            Tekrar çöz
          </button>
        </div>
      )}
    </div>
  );
}
