
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-5xl font-black text-black mb-12 text-center uppercase tracking-tighter italic">About Aib HUB</h1>
      <div className="space-y-10">
        <div className="border-l-4 border-black pl-10">
          <p className="text-xl text-gray-600 font-light leading-relaxed italic">
            "Aib HUB was founded with a singular directive: to bridge the gap between world-class creative talent and the visionary businesses that require them."
          </p>
        </div>
        
        <div className="prose prose-sm max-w-none text-gray-500 font-light space-y-6 leading-relaxed uppercase tracking-wider text-[11px]">
          <p>
            The platform serves as a curated index where professional creators—from technical developers and videographers to illustrators—can archive their portfolios and connect directly with verified clients.
          </p>
          <p>
            Unlike mass-market intermediaries, Aib HUB focuses on direct engagement protocols, allowing creators to maintain operational independence without taxative fees.
          </p>
        </div>

        <div className="bg-black p-16 text-center text-white">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Pure Professional Focus.</h2>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Accelerating the passion economy with secure data connection.</p>
        </div>

        <div className="text-gray-500 font-light text-sm leading-relaxed">
          <p>
            Whether you are a startup architecting your first interface or an enterprise seeking specialized skillsets, Aib HUB optimizes the discovery matrix for efficiency and aesthetic alignment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
