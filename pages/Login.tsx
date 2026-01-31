import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import supabase client

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Login successful, AuthProvider will detect session change
      // Navigate to dashboard or home
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `http://3.109.49.103:3000/#/login`,
    });

    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white border-2 border-black p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black text-black mb-8 text-center uppercase tracking-tighter">Login</h1>
        {error && <div className="mb-6 text-white text-xs font-black bg-black p-4 uppercase tracking-widest rounded-lg">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR@EMAIL.COM"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</label>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setResetEmail(email); }}
                className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition rounded-xl disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          New here? <Link to="/register" className="text-black hover:underline">Register Account</Link>
        </div>
      </div>

      {/* Demo Credentials Notice */}
      <div className="mt-10 bg-black p-6 border-2 border-black text-white rounded-xl">
        <p className="font-black text-[10px] uppercase tracking-widest mb-3 text-gray-400">Access Information</p>
        <div className="space-y-2 font-mono text-xs">
          <p className="text-gray-500">Register a new account or use credentials provided by admin.</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-80" onClick={() => { setShowForgotPassword(false); setResetSent(false); }}></div>
          <div className="bg-white w-full max-w-md rounded-2xl p-8 relative z-10 border-2 border-black">
            {resetSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Reset Link Sent</h2>
                <p className="text-zinc-500 text-sm">Check your email for the password reset link.</p>
                <button
                  onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                  className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Reset Password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Your Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 border-2 border-black py-3 rounded-xl font-black text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-black text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

