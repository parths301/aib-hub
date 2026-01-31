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
    // The database trigger (handle_new_user) automatically creates both
    // the profiles and creators rows using the metadata we pass here
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
      // Profile and creator are auto-created by database trigger
      setSuccess(true);
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
            <select
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50 bg-white"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            >
              <option value="">Select your city</option>
              <option value="Agra">Agra</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Amritsar">Amritsar</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Bhubaneswar">Bhubaneswar</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Dehradun">Dehradun</option>
              <option value="Delhi">Delhi</option>
              <option value="Goa">Goa</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Guwahati">Guwahati</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Indore">Indore</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Jammu">Jammu</option>
              <option value="Kanpur">Kanpur</option>
              <option value="Kochi">Kochi</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Ludhiana">Ludhiana</option>
              <option value="Mangalore">Mangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Mysore">Mysore</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Nashik">Nashik</option>
              <option value="Noida">Noida</option>
              <option value="Patna">Patna</option>
              <option value="Pune">Pune</option>
              <option value="Raipur">Raipur</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Srinagar">Srinagar</option>
              <option value="Surat">Surat</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram</option>
              <option value="Udaipur">Udaipur</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Vijayawada">Vijayawada</option>
              <option value="Visakhapatnam">Visakhapatnam</option>
            </select>
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
