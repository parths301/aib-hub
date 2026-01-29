import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import supabase client

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Password</label>
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

      {/* Updated Demo Credentials Box */}
      <div className="mt-10 bg-black p-6 border-2 border-black text-white rounded-xl">
        <p className="font-black text-[10px] uppercase tracking-widest mb-3 text-gray-400">Restricted Access / Demo Logins</p>
        <div className="space-y-2 font-mono text-xs">
          <p className="text-gray-500">Note: Demo accounts require Supabase Auth to be mocked or actual accounts created.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
