import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  BookOpen, Eye, EyeOff, Mail, Lock, AlertCircle,
} from 'lucide-react';
import { setCredentials } from '../../features/authSlice';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';
import ThemeToggle from '../../components/ThemeToggle';
import toast from 'react-hot-toast';

/* ── inline field error ── */
const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  ) : null;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  /* ── client-side validation ── */
  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.login({
        email: form.email.trim(),
        password: form.password,
      });
      dispatch(setCredentials({ user: data, token: data.token }));
      toast.success(`Welcome back, ${data.name}! 👋`);
      navigate(data.onboardingComplete ? '/dashboard' : '/onboarding');
    } catch (err) {
      const msg = getErrorMessage(err);
      setApiError(msg);
      // Highlight both fields on wrong credentials
      if (err?.response?.status === 401) {
        setErrors({ email: ' ', password: ' ' }); // space = highlight without duplicate text
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Theme toggle */}
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>

      <div className="card p-8 space-y-6">
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary
                          rounded-2xl flex items-center justify-center shadow-glow">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Sign in to your StudyBuddy account
            </p>
          </div>
        </div>

        {/* Global API error banner */}
        {apiError && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border
                          border-red-200 dark:border-red-800 rounded-xl p-3 text-sm
                          text-red-600 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="label" htmlFor="login-email">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                className={`input pl-10
                  ${errors.email && errors.email.trim()
                    ? 'border-red-400 focus:ring-red-300' : ''}`}
                autoComplete="email"
                autoFocus
              />
            </div>
            {errors.email && errors.email.trim() && <FieldError msg={errors.email} />}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label !mb-0" htmlFor="login-password">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-secondary font-medium hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input pl-10 pr-10
                  ${errors.password && errors.password.trim()
                    ? 'border-red-400 focus:ring-red-300' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && errors.password.trim() && (
              <FieldError msg={errors.password} />
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-secondary font-semibold hover:underline transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-5">
        Connect · Learn · Grow together 🚀
      </p>
    </div>
  );
};

export default Login;
