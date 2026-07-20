import { useState } from 'react';
import { Activity, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface Props {
  onRegister: () => void;
  onGoLogin: () => void;
}

export default function Register({ onRegister, onGoLogin }: Props) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.fullName.trim().length < 2) errs.fullName = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 7) errs.phone = 'Enter a valid phone number.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onRegister();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-red-50 flex flex-col">
      <header className="px-6 pt-12 pb-6 text-center">
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
          <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Join LifeLink AI in under a minute.</p>
      </header>

      <main className="flex-1 px-6 pb-8">
        <div className="max-w-sm mx-auto">
          <form onSubmit={submit} className="space-y-4" noValidate>
            <Field icon={<User className="w-4 h-4" />} label="Full name" error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="Sarah Mitchell"
                className={inputCls(!!errors.fullName)}
              />
            </Field>
            <Field icon={<Mail className="w-4 h-4" />} label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className={inputCls(!!errors.email)}
              />
            </Field>
            <Field icon={<Phone className="w-4 h-4" />} label="Phone number" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+1 (555) 123-4567"
                className={inputCls(!!errors.phone)}
              />
            </Field>
            <Field icon={<Lock className="w-4 h-4" />} label="Password" error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  className={inputCls(!!errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field icon={<Lock className="w-4 h-4" />} label="Confirm password" error={errors.confirm}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="••••••••"
                className={inputCls(!!errors.confirm)}
              />
            </Field>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-200 transition mt-2"
            >
              Create account
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button onClick={onGoLogin} className="font-semibold text-red-600 hover:text-red-700">
              Login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full pl-10 pr-10 py-3 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-red-200 ${
    hasError ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
  }`;
}

function Field({
  icon,
  label,
  error,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
