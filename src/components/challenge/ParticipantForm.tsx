import {
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Loader2,
  Timer,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { CHALLENGE_QUESTION_COUNT, QUESTION_TIME_SECONDS } from '@/lib/supabase';

export type ParticipantFormData = {
  fullName: string;
  email: string;
  phone: string;
  clinicAddress: string;
};

export type ParticipantFormErrors = Partial<Record<keyof ParticipantFormData, string>>;

export type FormNotice = 'taken' | 'phone_taken' | 'check_failed' | null;

type ParticipantFormProps = {
  formData: ParticipantFormData;
  errors: ParticipantFormErrors;
  onChange: (data: ParticipantFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  questionsStatus: 'loading' | 'ready' | 'error';
  checking: boolean;
  notice: FormNotice;
};

const fields = [
  { key: 'fullName' as const, label: 'Full Name', icon: User, type: 'text', placeholder: 'Enter your full name' },
  { key: 'email' as const, label: 'Email Address', icon: Mail, type: 'email', placeholder: 'name@example.com' },
  { key: 'phone' as const, label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+20' },
  { key: 'clinicAddress' as const, label: 'Clinic Address', icon: MapPin, type: 'text', placeholder: 'Clinic / Hospital Address' },
];

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice-error mb-6">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export default function ParticipantForm({
  formData,
  errors,
  onChange,
  onSubmit,
  onBack,
  questionsStatus,
  checking,
  notice,
}: ParticipantFormProps) {
  const submitDisabled = checking || questionsStatus !== 'ready';

  return (
    <div className="container-max py-12 lg:py-20">
      <div className="max-w-5xl mx-auto">
        {questionsStatus === 'error' && (
          <Notice>The challenge is not available right now. Please try again later.</Notice>
        )}
        {notice === 'taken' && (
          <Notice>This email has already completed the challenge. Each participant can take it once.</Notice>
        )}
        {notice === 'phone_taken' && (
          <Notice>This phone number has already completed the challenge. Each participant can take it once.</Notice>
        )}
        {notice === 'check_failed' && (
          <Notice>We could not verify your entry. Please check your connection and try again.</Notice>
        )}

        <Reveal direction="scale">
          <div className="card overflow-hidden grid lg:grid-cols-5">
            {/* Left: dark intro panel */}
            <aside className="ink-panel lg:col-span-2 p-8 lg:p-10 flex flex-col">
              <div aria-hidden className="absolute inset-0 dot-grid-light pointer-events-none" />
              <div aria-hidden className="absolute -right-24 -bottom-24 w-72 h-72 pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slower">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#5E94AE" strokeOpacity="0.45" strokeWidth="14" />
                  <circle cx="100" cy="100" r="92" fill="none" stroke="#C5A66A" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
                </svg>
              </div>

              <div className="relative">
                <div className="relative w-14 h-14 mb-8">
                  <span className="absolute inset-0 rounded-2xl border border-gold-400 animate-pulse-ring" />
                  <div className="relative w-full h-full rounded-2xl border border-gold-400/50 bg-white/5 flex items-center justify-center">
                    <ClipboardList className="w-7 h-7 text-gold-300" strokeWidth={1.75} />
                  </div>
                </div>
                <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-cream-50 leading-tight mb-4">
                  World Diabetes Day Challenge
                </h1>
                <p className="text-cream-300 leading-relaxed">
                  Enter your details to begin. Five clinical questions, one attempt per participant.
                </p>
              </div>

              {/* one marker per question */}
              <div className="relative mt-10 lg:mt-auto pt-6">
              <p className="flex items-center gap-2 text-sm text-gold-300 mb-3">
                <Timer className="w-4 h-4" />
                {QUESTION_TIME_SECONDS} seconds per question
              </p>
              <div className="flex items-center gap-2">
                {Array.from({ length: CHALLENGE_QUESTION_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full border border-gold-400/60 flex items-center justify-center font-serif italic text-xs text-gold-300 animate-pop"
                    style={{ animationDelay: `${400 + i * 90}ms` }}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
              </div>
            </aside>

            {/* Right: form */}
            <form onSubmit={onSubmit} className="lg:col-span-3 p-8 lg:p-10 space-y-5 bg-white">
              {questionsStatus === 'loading' && (
                <div className="flex items-center gap-2 text-ink-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                  Loading challenge questions...
                </div>
              )}

              {fields.map((field, i) => (
                <div
                  key={field.key}
                  className="animate-slide-up [animation-fill-mode:backwards]"
                  style={{ animationDelay: `${150 + i * 80}ms` }}
                >
                  <label htmlFor={field.key} className="input-label">
                    {field.label}
                  </label>
                  <div className="group relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300 pointer-events-none transition-colors duration-200 group-focus-within:text-gold-600" />
                    <input
                      id={field.key}
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) => onChange({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className={`input-field pl-12 ${errors[field.key] ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors[field.key] && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-slide-down">
                      <AlertCircle className="w-4 h-4" />
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={onBack} className="btn-secondary group">
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitDisabled}
                >
                  {checking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Begin Challenge
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
