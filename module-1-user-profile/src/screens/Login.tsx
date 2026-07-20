import { useState } from 'react';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onGoRegister: () => void;
}

export default function Login({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState('sarah.mitchell@example.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-red-50 flex flex-col">
      <header className="px-6 pt-12 pb-6 text-center">
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
          <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">LifeLink AI</h1>
        <p className="mt-1 text-sm text-gray-500">Your emergency medical profile, always with you.</p>
      </header>

      <main className="flex-1 px-6 pb-8">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to access your medical ID.</p>

          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-red-200 ${
                    errors.email ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-red-200 ${
                    errors.password ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs font-medium text-red-600 hover:text-red-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-200 transition"
            >
              Login
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button onClick={onGoRegister} className="font-semibold text-red-600 hover:text-red-700">
              Register
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
