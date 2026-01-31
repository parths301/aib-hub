import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const INDIAN_CITIES = [
  'Agra', 'Ahmedabad', 'Amritsar', 'Bengaluru', 'Bhopal', 'Bhubaneswar',
  'Chandigarh', 'Chennai', 'Coimbatore', 'Dehradun', 'Delhi', 'Goa',
  'Gurgaon', 'Guwahati', 'Hyderabad', 'Indore', 'Jaipur', 'Jammu',
  'Kanpur', 'Kochi', 'Kolkata', 'Lucknow', 'Ludhiana', 'Mangalore',
  'Mumbai', 'Mysore', 'Nagpur', 'Nashik', 'Noida', 'Patna', 'Pune',
  'Raipur', 'Rajkot', 'Ranchi', 'Srinagar', 'Surat', 'Thiruvananthapuram',
  'Udaipur', 'Vadodara', 'Varanasi', 'Vijayawada', 'Visakhapatnam'
];

const Register: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: '',
    password: '',
    profilePhoto: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Sign up with Supabase Auth
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
      setUserId(user.id);
      setStep(2); // Move to profile details step
    }
    setLoading(false);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError('');

    // Create profile entry
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: userId,
      email: formData.email,
      role: 'CREATOR'
    }]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Continue anyway - might already exist from trigger
    }

    // Create creator entry
    const { error: creatorError } = await supabase.from('creators').insert([{
      linked_user_id: userId,
      full_name: formData.fullName,
      email: formData.email,
      city: formData.city,
      skills: [],
      purchased_tags: [],
      bio: formData.bio || '',
      status: 'PENDING',
      tier: 'BASE',
      is_featured: false,
      profile_photo: formData.profilePhoto || `https://picsum.photos/seed/${userId}/400/400`
    }]);

    if (creatorError) {
      console.error('Creator creation error:', creatorError);
      setError('Failed to create profile. Please try again.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white border-2 border-black p-10 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">Profile Created!</h1>
          <p className="mb-6 font-bold text-gray-600">Your creator profile is now live.</p>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-8">
            We've sent a verification link to {formData.email}. You can verify later.
          </p>
          <div className="space-y-3">
            <Link
              to="/profile"
              className="block w-full bg-black text-white py-4 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition"
            >
              View My Profile
            </Link>
            <Link
              to="/dashboard"
              className="block w-full border-2 border-black text-black py-4 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-zinc-50 transition"
            >
              Go to Settings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white border-2 border-black p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black text-black mb-4 text-center uppercase tracking-tighter">
          {step === 1 ? 'Registration' : 'Complete Profile'}
        </h1>
        <p className="text-gray-400 mb-6 text-center font-mono text-[10px] uppercase tracking-widest">
          {step === 1 ? 'Step 1: Account Setup' : 'Step 2: Profile Details'}
        </p>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
        </div>

        {error && (
          <div className="mb-6 text-white text-xs font-black bg-black p-4 uppercase tracking-widest rounded-lg">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Email</label>
              <input
                type="email"
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Base City</label>
              <select
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50 bg-white"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              >
                <option value="">Select your city</option>
                {INDIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Password</label>
              <input
                type="password"
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition rounded-xl disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Continue →'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Profile Photo URL</label>
              <input
                type="url"
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                value={formData.profilePhoto}
                onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                placeholder="https://your-photo-url.com/image.jpg (optional)"
              />
              <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                Leave blank for a random avatar
              </p>
            </div>

            {formData.profilePhoto && (
              <div className="flex justify-center">
                <img
                  src={formData.profilePhoto}
                  alt="Preview"
                  className="w-24 h-24 rounded-xl border-2 border-black object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Bio (Optional)</label>
              <textarea
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell clients about yourself..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-black py-4 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-4 font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition rounded-xl disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Complete'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          Already have an account? <Link to="/login" className="text-black hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
