
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('contact_messages').insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message
      }
    ]);

    if (dbError) {
      setError('Failed to send message. Please try again.');
      console.error(dbError);
    } else {
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-16 border-2 border-black rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">Message Received</h1>
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-8">Our team will respond within 24 hours</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-black text-white px-8 py-4 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-5xl font-black text-black mb-8 uppercase tracking-tighter">Support</h1>
      <p className="text-lg text-gray-500 font-light mb-16 uppercase tracking-widest">Inquiry Protocol & Communication</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
        <div className="bg-white p-10 border-2 border-black rounded-2xl shadow-xl">
          <h2 className="text-xl font-black mb-8 uppercase tracking-widest underline decoration-black underline-offset-8">DIRECT MESSAGE</h2>

          {error && <div className="mb-6 text-white text-xs font-black bg-red-600 p-4 uppercase tracking-widest rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Email Identity</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Narrative (Message)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                rows={5}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition rounded-xl disabled:opacity-50"
            >
              {loading ? 'Transmitting...' : 'Transmit Data'}
            </button>
          </form>
        </div>

        <div className="space-y-12 py-10">
          <div>
            <h3 className="text-xs font-black text-black mb-4 uppercase tracking-widest border-b-2 border-black pb-2">Digital HQ</h3>
            <p className="text-gray-600 font-mono text-xs">support@aibhub.com</p>
          </div>
          <div>
            <h3 className="text-xs font-black text-black mb-4 uppercase tracking-widest border-b-2 border-black pb-2">Physical Axis</h3>
            <p className="text-gray-600 font-mono text-xs leading-relaxed">123 CREATIVE PLAZA, BKC<br />MUMBAI, INDIA 400051</p>
          </div>
          <div>
            <h3 className="text-xs font-black text-black mb-4 uppercase tracking-widest border-b-2 border-black pb-2">Network Channels</h3>
            <div className="flex gap-6 font-mono text-[10px] uppercase font-bold">
              <a href="#" className="text-black hover:underline">TW</a>
              <a href="#" className="text-black hover:underline">IG</a>
              <a href="#" className="text-black hover:underline">LI</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

