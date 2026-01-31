import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Creator, User, UserRole } from '../types';
import { supabase } from '../supabaseClient';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Sign up with Supabase
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          city: formData.city,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (user) {
      const userId = user.id;

      // Profile is now auto-created by database trigger on auth.users insert
      // Just create the 'creators' row with linked_user_id
      const { error: creatorError } = await supabase.from('creators').insert([
        {
          linked_user_id: userId, // Link to the profiles table
          full_name: formData.fullName,
          email: formData.email,
          city: formData.city,
          skills: [],
          purchased_tags: [],
          bio: '',
          status: 'PENDING',
          tier: 'BASE',
          is_featured: false,
          profile_photo: `https://picsum.photos/seed/${userId}/400/400`
        }
      ]);

      if (creatorError) {
        console.error('Creator profile creation failed:', creatorError);
        setError('Account created but creator profile setup failed. Please try again.');
      } else {
        setSuccess(true);
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white border-2 border-black p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">Check Your Inbox</h1>
          <p className="mb-6 font-bold text-gray-600">We have sent a confirmation link to {formData.email}.</p>
          <p className="text-xs uppercase tracking-widest text-gray-400">Please verify your account to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white border-2 border-black p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black text-black mb-4 text-center uppercase tracking-tighter">Registration</h1>
        <p className="text-gray-400 mb-10 text-center font-mono text-[10px] uppercase tracking-widest">Apply for Creator Membership</p>

        {error && <div className="mb-6 text-white text-xs font-black bg-black p-4 uppercase tracking-widest rounded-lg">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Full Legal Name</label>
            <input
              type="text"
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Email Identity</label>
            <input
              type="email"
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Base City</label>
            <input
              type="text"
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Security Code (Password)</label>
            <input
              type="password"
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition rounded-xl disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Initiate Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
