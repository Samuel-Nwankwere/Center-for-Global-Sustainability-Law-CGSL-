import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const control =
  'block w-full rounded-[5px] border-0 bg-ink-50 px-5 py-4 text-ink-900 ring-1 ring-inset ring-transparent placeholder:text-ink-400 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-brand-500 focus:outline-none focus-visible:ring-offset-0';

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

function FieldShell({ id, label, error, hint, required, className, children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-ink-900">
        {label}
        {required && <span className="ml-0.5 text-brand-600" aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-700">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ label, error, hint, required, className, ...props }: FieldProps & ComponentPropsWithoutRef<'input'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <input
        id={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, error && 'ring-red-400')}
        {...props}
      />
    </FieldShell>
  );
}

export function TextArea({ label, error, hint, required, className, ...props }: FieldProps & ComponentPropsWithoutRef<'textarea'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        id={id}
        required={required}
        rows={5}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, 'resize-y', error && 'ring-red-400')}
        {...props}
      />
    </FieldShell>
  );
}

export function Select({ label, error, hint, required, className, options, ...props }: FieldProps & ComponentPropsWithoutRef<'select'> & { options: string[] }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <select id={id} required={required} aria-invalid={!!error} className={cn(control, 'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%237a7a7a%27%3E%3Cpath d=%27M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z%27/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10')} {...props}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </FieldShell>
  );
}

export function FormSuccess({ title, children, onReset }: { title: string; children: ReactNode; onReset?: () => void }) {
  return (
    <div role="status" className="animate-fade-up rounded-eco bg-brand-50 p-8 text-center ring-1 ring-brand-200">
      <CheckCircle2 className="mx-auto h-12 w-12 text-brand-600" aria-hidden />
      <h3 className="mt-4 font-serif text-2xl font-extrabold">{title}</h3>
      <div className="mx-auto mt-2 max-w-md text-ink-600">{children}</div>
      {onReset && (
        <button type="button" onClick={onReset} className="mt-6 text-sm font-semibold text-brand-700 hover:underline">
          Send another message
        </button>
      )}
    </div>
  );
}

/** Minimal form state + validation helper shared by all site forms. */
export type Errors<T> = Partial<Record<keyof T, string>>;
