
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-5xl font-black text-black mb-8 uppercase tracking-tighter">Support</h1>
      <p className="text-lg text-gray-500 font-light mb-16 uppercase tracking-widest">Inquiry Protocol & Communication</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
        <div className="bg-white p-10 border-2 border-black rounded-2xl shadow-xl">
          <h2 className="text-xl font-black mb-8 uppercase tracking-widest underline decoration-black underline-offset-8">DIRECT MESSAGE</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Legal Name</label>
              <input type="text" className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" required />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Email Identity</label>
              <input type="email" className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" required />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Narrative (Message)</label>
              <textarea className="w-full border-2 border-black rounded-lg px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" rows={5} required></textarea>
            </div>
            <button className="w-full bg-black text-white py-5 font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition rounded-xl">
              Transmit Data
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
