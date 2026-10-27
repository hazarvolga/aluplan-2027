import type React from 'react';

/** Automatic-activation keyboard behavior shared by the two structured tab families. */
export function handleStructuredTabKey(
  event: React.KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  select: (index: number) => void,
  vertical = false
) {
  const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
  const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
  const nextIndex = event.key === 'Home' ? 0
    : event.key === 'End' ? count - 1
    : event.key === nextKey ? (index + 1) % count
    : event.key === previousKey ? (index - 1 + count) % count
    : null;
  if (nextIndex === null || count === 0) return;
  event.preventDefault();
  const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  select(nextIndex);
  tabs?.[nextIndex]?.focus();
}
