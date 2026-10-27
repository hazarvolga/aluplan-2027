'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Native modal top layer isolates the background; explicit Tab wrapping retains focus at its edges. */
export function MediaDialog({
  label,
  onClose,
  children,
  className = 'alu-video-modal'
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.querySelector<HTMLElement>('[data-media-dialog-initial-focus], [data-media-dialog-close]')?.focus();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={className}
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        // Native media controls have an internal focus sequence; do not skip it.
        if (document.activeElement instanceof HTMLMediaElement ||
            document.activeElement instanceof HTMLIFrameElement) return;
        const dialog = event.currentTarget;
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, iframe, video[controls], audio[controls], [tabindex]'
        )).filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') &&
          !element.hidden && element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) {
          event.preventDefault();
          dialog.focus();
        } else if (!dialog.contains(document.activeElement) || document.activeElement === dialog) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
