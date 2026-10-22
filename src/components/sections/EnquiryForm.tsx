import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { site } from '@/content/site';
import { isEmail, submitForm, type FormKind } from '@/lib/forms';
import { Button } from '@/components/ui/primitives';
import { FormSuccess, Select, TextArea, TextField } from '@/components/ui/Form';

export interface EnquiryField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  autoComplete?: string;
  full?: boolean;
}

/** Config-driven form used by Contact, Volunteer and Partner pages. */
export function EnquiryForm({ kind, fields, submitLabel = 'Send message', successTitle = 'Thank you!' }: { kind: FormKind; fields: EnquiryField[]; submitLabel?: string; successTitle?: string }) {
  const empty = Object.fromEntries(fields.map((f) => [f.name, ''])) as Record<string, string>;
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'mailto' | 'demo' | 'error'>('idle');

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.name].trim();
      if (f.required && !v) e[f.name] = `${f.label} is required`;
      else if (f.type === 'email' && v && !isEmail(v)) e[f.name] = 'Enter a valid email address';
    }
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementsByName(Object.keys(e)[0])[0]?.focus();
      return;
    }
    setStatus('submitting');
    try {
      const res = await submitForm(kind, values);
      setStatus(res.via);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent' || status === 'mailto' || status === 'demo') {
    return (
      <FormSuccess title={successTitle} onReset={() => { setValues(empty); setStatus('idle'); }}>
        {status === 'sent' ? (
          <p>Your message has been received. A member of our team will get back to you shortly.</p>
        ) : status === 'demo' ? (
          <p>
            <strong>Demo preview:</strong> the form validated and was captured, but nothing was sent. On the live site this is delivered to {site.email} through the configured form service.
          </p>
        ) : (
          <p>
            Your email app has opened with your message ready to send to <strong>{site.email}</strong>. If nothing opened, email us directly and we’ll get back to you.
          </p>
        )}
      </FormSuccess>
    );
  }

  const set = (name: string) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const common = { name: f.name, label: f.label, required: f.required, error: errors[f.name], value: values[f.name], onChange: set(f.name), className: f.full || f.type === 'textarea' ? 'sm:col-span-2' : undefined };
        if (f.type === 'textarea') return <TextArea key={f.name} placeholder={f.placeholder} {...common} />;
        if (f.type === 'select') return <Select key={f.name} options={f.options ?? []} {...common} />;
        return <TextField key={f.name} type={f.type ?? 'text'} placeholder={f.placeholder} autoComplete={f.autoComplete} {...common} />;
      })}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-500">Fields marked * are required. We only use your details to respond to you.</p>
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : submitLabel} <Send className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      {status === 'error' && (
        <p role="alert" className="text-sm font-medium text-red-700 sm:col-span-2">
          Something went wrong. Please try again or email {site.email}.
        </p>
      )}
    </form>
  );
}
