import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/siteConfig';
import { Inquiry } from '../../types';

interface InquiryFormProps {
  communityId?: string;
  builderId?: string;
  communityName?: string;
}

export function InquiryForm({ communityId, builderId, communityName }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', budget: '', timeframe: '',
    preferredAreas: '', message: '', wantUpdates: false, wantHelp: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const inquiry: Inquiry = {
      id: Date.now().toString(), name: form.name, email: form.email,
      phone: form.phone || undefined, budget: form.budget || undefined,
      timeframe: form.timeframe || undefined,
      preferredAreas: form.preferredAreas ? form.preferredAreas.split(',').map(s => s.trim()) : [],
      communityId, builderId, message: form.message, createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('mbnh_inquiries') || '[]');
      localStorage.setItem('mbnh_inquiries', JSON.stringify([...existing, inquiry]));
    } catch {}
    setSubmitted(true);
  };

  const set = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  if (submitted) return (
    <div className="bg-teal-light rounded-xl p-8 text-center">
      <CheckCircle size={40} className="text-teal mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-primary mb-2">Request Received</h3>
      <p className="text-muted text-sm">Thanks — your request has been saved for this demo. In production, this would be sent to the site owner or CRM.</p>
    </div>
  );

  const inputClass = (k: string) =>
    `w-full border ${errors[k] ? 'border-error' : 'border-border'} rounded-lg px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-teal bg-white`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {communityName && (
        <div className="bg-sand-light rounded-lg px-4 py-3 text-sm text-primary">
          Inquiring about: <strong>{communityName}</strong>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inq-name" className="block text-sm font-medium text-primary mb-1">Name *</label>
          <input id="inq-name" value={form.name} onChange={e => set('name', e.target.value)} className={inputClass('name')} placeholder="Your name" />
          {errors.name && <p className="text-error text-xs mt-1" role="alert">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="inq-email" className="block text-sm font-medium text-primary mb-1">Email *</label>
          <input id="inq-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass('email')} placeholder="you@example.com" />
          {errors.email && <p className="text-error text-xs mt-1" role="alert">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="inq-phone" className="block text-sm font-medium text-primary mb-1">Phone</label>
          <input id="inq-phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass('phone')} placeholder="(optional)" />
        </div>
        <div>
          <label htmlFor="inq-timeframe" className="block text-sm font-medium text-primary mb-1">Move Timeframe</label>
          <select id="inq-timeframe" value={form.timeframe} onChange={e => set('timeframe', e.target.value)} className={inputClass('timeframe')}>
            <option value="">Select…</option>
            <option>ASAP</option><option>1–3 months</option><option>3–6 months</option>
            <option>6–12 months</option><option>12+ months</option><option>Just exploring</option>
          </select>
        </div>
        <div>
          <label htmlFor="inq-budget" className="block text-sm font-medium text-primary mb-1">Budget Range</label>
          <select id="inq-budget" value={form.budget} onChange={e => set('budget', e.target.value)} className={inputClass('budget')}>
            <option value="">Select…</option>
            <option>Under $250K</option><option>$250K–$350K</option><option>$350K–$500K</option>
            <option>$500K–$750K</option><option>$750K+</option>
          </select>
        </div>
        <div>
          <label htmlFor="inq-areas" className="block text-sm font-medium text-primary mb-1">Preferred Areas</label>
          <input id="inq-areas" value={form.preferredAreas} onChange={e => set('preferredAreas', e.target.value)} className={inputClass('preferredAreas')} placeholder="e.g. Conway, Carolina Forest" />
        </div>
      </div>
      <div>
        <label htmlFor="inq-message" className="block text-sm font-medium text-primary mb-1">Message</label>
        <textarea id="inq-message" rows={4} value={form.message} onChange={e => set('message', e.target.value)} className={inputClass('message')} placeholder="Tell us what you're looking for…" />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
          <input type="checkbox" checked={form.wantUpdates} onChange={e => set('wantUpdates', e.target.checked)} className="rounded border-border text-teal" />
          I want updates when this community's pricing or status changes
        </label>
        <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
          <input type="checkbox" checked={form.wantHelp} onChange={e => set('wantHelp', e.target.checked)} className="rounded border-border text-teal" />
          I want help comparing new construction communities
        </label>
      </div>
      <p className="text-xs text-muted">By submitting, you agree that your information may be shared with local real estate professionals. We respect your privacy and will not sell your data.</p>
      <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
        <Send size={16} /> Send Request
      </Button>
      <p className="text-xs text-muted text-center">{siteConfig.phone} · {siteConfig.email}</p>
    </form>
  );
}
