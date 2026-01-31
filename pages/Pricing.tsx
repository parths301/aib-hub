
import React from 'react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const skillTags = [
    { id: 1, icon: '🎬', label: 'Video Editor', desc: 'Boost visibility for video editing jobs' },
    { id: 2, icon: '🎨', label: 'Logo Creator', desc: 'Higher ranking for identity briefs' },
    { id: 3, icon: '💻', label: 'Web Developer', desc: 'Highlight technical proficiency' },
    { id: 4, icon: '🎞', label: 'Motion Designer', desc: 'Verified animation expert' },
    { id: 5, icon: '📱', label: 'Social Designer', desc: 'Expert in platform growth' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16 pb-8 border-b-2 border-black">
        <h1 className="text-5xl font-black text-black uppercase tracking-tighter">Boost Your Profile</h1>
        <p className="text-gray-500 font-mono text-sm mt-2 uppercase">GET DISCOVERED BY CLIENTS FASTER</p>
      </div>

      {/* Membership Plans Section */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-black uppercase tracking-widest">Membership Plans</h2>
          <div className="flex-grow h-0.5 bg-black opacity-5"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Gold Plan */}
          <div className="bg-white border-2 border-[#bf953f] p-10 rounded-2xl shadow-xl flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 premium-gold-gradient text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">GOLD</div>
            <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Gold Plan</h3>
            <p className="text-5xl font-black mb-10 text-black">₹799<span className="text-sm font-light text-gray-400">/mo</span></p>

            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                <div className="w-5 h-5 rounded-full premium-gold-gradient flex items-center justify-center text-[10px]">✓</div>
                Verified creator badge
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-gray-400">
                <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[10px]">✓</div>
                Higher visibility in city search
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-gray-400">
                <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[10px]">✓</div>
                Unlimited job applications
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-gray-400">
                <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[10px]">✓</div>
                1 Skill Tag included
              </li>
            </ul>

            <button className="w-full premium-gold-gradient text-black py-5 font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition">
              Upgrade to Gold
            </button>
          </div>

          {/* Platinum Plan */}
          <div className="bg-white border-2 border-zinc-400 p-10 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden group premium-platinum-border platinum-glow">
            <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md animate-pulse">MOST POPULAR</div>
            <div className="absolute top-0 right-0 premium-platinum-gradient text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-zinc-500">PLATINUM</div>
            <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter premium-platinum-text">Platinum Plan</h3>
            <p className="text-5xl font-black mb-10 text-black">₹1499<span className="text-sm font-light text-gray-400">/mo</span></p>

            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                <div className="w-5 h-5 rounded-full premium-platinum-gradient text-black flex items-center justify-center text-[10px]">✓</div>
                Everything in Gold
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                <div className="w-5 h-5 rounded-full premium-platinum-gradient text-black flex items-center justify-center text-[10px]">✓</div>
                Top placement in city listings
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                <div className="w-5 h-5 rounded-full premium-platinum-gradient text-black flex items-center justify-center text-[10px]">✓</div>
                Homepage spotlight (city based)
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                <div className="w-5 h-5 rounded-full premium-platinum-gradient text-black flex items-center justify-center text-[10px]">✓</div>
                3 Skill Tags included
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                <div className="w-5 h-5 rounded-full premium-platinum-gradient text-black flex items-center justify-center text-[10px]">✓</div>
                Direct WhatsApp contact
              </li>
            </ul>

            <button className="w-full premium-platinum-gradient text-black py-5 font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition shadow-lg border border-zinc-500">
              Upgrade to Platinum
            </button>
          </div>
        </div>
      </section>

      {/* Skill Tags Section */}
      <section>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-black uppercase tracking-widest">Buy Skill Tags</h2>
          <div className="flex-grow h-0.5 bg-black opacity-5"></div>
        </div>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-12">Get hired for what you do best.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skillTags.map(tag => (
            <div key={tag.id} className="bg-white border-2 border-black p-6 rounded-2xl hover:bg-gray-50 transition flex flex-col">
              <div className="text-4xl mb-4">{tag.icon}</div>
              <h4 className="text-lg font-black uppercase tracking-tight mb-1">{tag.label}</h4>
              <p className="text-xs text-gray-400 mb-6 font-light">{tag.desc}</p>

              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-black tracking-widest">₹199<span className="text-[10px] text-gray-400"> /MO</span></p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">OR ₹499 / 3 MO</p>
                </div>
                <button className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-800 transition">
                  Buy Tag
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full premium-platinum-gradient opacity-5 pointer-events-none"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex-shrink-0 bg-white bg-opacity-10 flex items-center justify-center rounded-lg">🔔</div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
              Gold members get <span className="text-[#bf953f] font-black underline decoration-[#bf953f]">1 free tag</span> • Platinum members get <span className="text-zinc-400 font-black underline decoration-zinc-400">3 free tags</span>
            </p>
          </div>
          <Link to="/register" className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-200 transition">Get Started</Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
