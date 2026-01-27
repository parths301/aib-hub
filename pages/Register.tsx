
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Creator, User, UserRole } from '../types';

interface RegisterProps {
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  creators: Creator[];
  setCreators: React.Dispatch<React.SetStateAction<Creator[]>>;
}

const Register: React.FC<RegisterProps> = ({ setCurrentUser, creators, setCreators }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newCreatorId = 'c' + (creators.length + 1);
    // Fix: Ensure all required fields from Creator interface are present and remove non-existent 'isPremium'
    const newCreator: Creator = {
      id: newCreatorId,
      fullName: formData.fullName,
      email: formData.email,
      city: formData.city,
      skills: [],
      purchasedTags: [],
      bio: '',
      experience: '',
      profilePhoto: `https://picsum.photos/seed/${newCreatorId}/400/400`,
      portfolio: [],
      whatsapp: '',
      isFeatured: false,
      tier: 'BASE',
      status: 'PENDING'
    };
    const newUser: User = {
      id: 'u' + Date.now(),
      email: formData.email,
      role: UserRole.CREATOR,
      creatorId: newCreatorId
    };
    setCreators([...creators, newCreator]);
    setCurrentUser(newUser);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white border-2 border-black p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black text-black mb-4 text-center uppercase tracking-tighter">Registration</h1>
        <p className="text-gray-400 mb-10 text-center font-mono text-[10px] uppercase tracking-widest">Apply for Creator Membership</p>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Full Legal Name</label>
            <input 
              type="text" 
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Email Identity</label>
            <input 
              type="email" 
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Base City</label>
            <input 
              type="text" 
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Security Code (Password)</label>
            <input 
              type="password" 
              className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-5 font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition rounded-xl">
            Initiate Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
