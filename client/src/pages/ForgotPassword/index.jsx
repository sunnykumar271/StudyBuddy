// client/src/pages/ForgotPassword/index.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
       // Save email in sessionStorage so the next page knows the email
      sessionStorage.setItem('resetEmail', email);
      setSubmitted(true);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Theme toggle */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <div className="card p-8 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {submitted ? 'Check your email' : 'Reset password 🔑'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {submitted
                ? `We sent a reset link to ${email}`
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full
                              flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  If an account with <strong>{email}</strong> exists, you'll receive a password
                  reset link within a few minutes.
                </p>
                <p className="text-xs text-gray-400">
                  Don't forget to check your spam folder.
                </p>
              </div>
            </div>

            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="btn-outline w-full"
            >
              Try a different email
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="forgot-email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="input pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={loading || !email}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending link...
                </span>
              ) : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-secondary font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
