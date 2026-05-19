import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  BookOpen, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { setCredentials } from '../../features/authSlice';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';
import ThemeToggle from '../../components/ThemeToggle';
import toast from 'react-hot-toast';

/* ── tiny inline error component ── */
const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  ) : null;

/* ── password strength bar ── */
const StrengthBar = ({ password }) => {
  const score =
    [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
      r.test(password)
    ).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colours = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300
              ${i <= score ? colours[score] : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${colours[score].replace('bg-', 'text-').replace('-4', '-5').replace('-5', '-500')}`}>
        {labels[score]}
      </p>
    </div>
  );
};

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // clear field error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setApiError('');
  };

  /* ── client-side validation ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';

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
      const { data } = await authService.signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department,
      });
      dispatch(setCredentials({ user: data, token: data.token }));
      toast.success(`Welcome to StudyBuddy, ${data.name}! 🎉`);
      navigate('/onboarding');
    } catch (err) {
      const msg = getErrorMessage(err);
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const DEPARTMENTS = [
    'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical',
    'Physics', 'Mathematics', 'Biology', 'Economics', 'Business', 'Arts', 'Other',
  ];

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
              Create your account ✨
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Join thousands of students on StudyBuddy
            </p>
          </div>
        </div>

        {/* Global API error */}
        {apiError && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border
                          border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600
                          dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <label className="label" htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Enter your full name"
              className={`input ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
              autoComplete="name"
              autoFocus
            />
            <FieldError msg={errors.name} />
          </div>

          {/* Email */}
          <div>
            <label className="label" htmlFor="signup-email">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                className={`input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                autoComplete="email"
              />
            </div>
            <FieldError msg={errors.email} />
          </div>

          {/* Department (optional) */}
          <div>
            <label className="label" htmlFor="signup-dept">
              Department <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              id="signup-dept"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="input appearance-none"
            >
              <option value="">Select your department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="label" htmlFor="signup-password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="signup-password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className={`input pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                autoComplete="new-password"
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
            <StrengthBar password={form.password} />
            <FieldError msg={errors.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label" htmlFor="signup-confirm">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`input pl-10 pr-10
                  ${errors.confirmPassword ? 'border-red-400 focus:ring-red-300' : ''}
                  ${form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword
                    ? 'border-emerald-400 focus:ring-emerald-300' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {/* Match tick */}
              {form.confirmPassword && form.password === form.confirmPassword && (
                <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4
                                         text-emerald-500 pointer-events-none" />
              )}
            </div>
            <FieldError msg={errors.confirmPassword} />
          </div>

          {/* Submit */}
          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-secondary font-semibold hover:underline transition-colors"
            >
              Sign in
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

export default Signup;
