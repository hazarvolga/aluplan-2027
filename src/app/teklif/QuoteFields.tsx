import type { HTMLAttributes, ReactNode } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import type { QuoteOption } from '@/lib/quote-catalog';
import styles from './page.module.css';

export const fieldId = (field: string): string => `quote-${field}`;
export const errorId = (field: string): string => `quote-${field}-error`;

interface FieldErrorProps {
  field: string;
  message?: string;
}

/** Rendered only while the field is invalid, so assistive tech never reads a stale message. */
export function FieldError({ field, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="alu-msg alu-msg--error" id={errorId(field)}>
      <AluIcon name="circle-alert" size="sm" />
      <span>
        <span className={styles.srOnly}>Hata: </span>
        {message}
      </span>
    </p>
  );
}

function RequiredMark() {
  return (
    <span className="alu-label__req" aria-hidden="true">
      *
    </span>
  );
}

interface TextFieldProps {
  field: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  isIdentifier?: boolean;
}

export function TextField({
  field,
  label,
  value,
  onChange,
  error,
  hint,
  required = true,
  type = 'text',
  autoComplete,
  inputMode,
  isIdentifier = false,
}: TextFieldProps) {
  const hintId = hint ? `${fieldId(field)}-hint` : undefined;
  const describedBy = [hintId, error ? errorId(field) : undefined].filter(Boolean).join(' ') || undefined;
  // Identifiers (e-mail, phone, customer number) must not be auto-corrected or capitalised.
  const identifierProps = isIdentifier ? { autoCorrect: 'off', autoCapitalize: 'none', spellCheck: false } : {};

  return (
    <div className="alu-field" data-field={field}>
      <label className="alu-label" htmlFor={fieldId(field)}>
        {label}
        {required && <RequiredMark />}
      </label>
      <input
        className="alu-input"
        id={fieldId(field)}
        name={field}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        {...identifierProps}
      />
      {hint && (
        <p className="alu-hint" id={hintId}>
          {hint}
        </p>
      )}
      <FieldError field={field} message={error} />
    </div>
  );
}

interface ChoiceGroupProps {
  field: string;
  legend: string;
  options: readonly QuoteOption[];
  selected: readonly string[];
  onChange: (selected: string[]) => void;
  multiple: boolean;
  error?: string;
  required?: boolean;
  layout?: 'stack' | 'inline' | 'columns';
  children?: ReactNode;
}

/** Checkbox (multiple) or radio (single) group with one legend and one error message. */
export function ChoiceGroup({
  field,
  legend,
  options,
  selected,
  onChange,
  multiple,
  error,
  required = true,
  layout = 'inline',
  children,
}: ChoiceGroupProps) {
  const layoutClass = { stack: styles.choices, inline: styles.choicesInline, columns: styles.choicesColumns }[layout];
  const toggle = (id: string): void => {
    if (!multiple) return onChange([id]);
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  return (
    <fieldset
      className={styles.group}
      data-field={field}
      aria-describedby={error ? errorId(field) : undefined}
    >
      <legend className="alu-label">
        {legend}
        {required && <RequiredMark />}
      </legend>
      {children}
      <div className={layoutClass}>
        {options.map((option) => (
          <label className={styles.choice} key={option.id}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={field}
              value={option.id}
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldError field={field} message={error} />
    </fieldset>
  );
}
