
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { INITIAL_CREATORS, INITIAL_JOBS, INITIAL_USERS } from './data';
import { Creator, Job, User, UserRole } from './types';

// Pages
import Home from './pages/Home';
import CreatorListing from './pages/CreatorListing';
import CreatorDetail from './pages/CreatorDetail';
import MyProfile from './pages/MyProfile';
import JobsListing from './pages/JobsListing';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';
import About from './pages/About';
import Pricing from './pages/Pricing';

const AppContent: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>(() => {
    const saved = localStorage.getItem('creators');
    return saved ? JSON.parse(saved) : INITIAL_CREATORS;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [jobSubmitSuccess, setJobSubmitSuccess] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('creators', JSON.stringify(creators));
  }, [creators]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handlePostJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newJob: Job = {
      id: 'j' + Date.now(),
      title: formData.get('title') as string,
      city: formData.get('city') as string,
      requiredSkills: (formData.get('skills') as string).split(',').map(s => s.trim()),
      description: formData.get('description') as string,
      budget: formData.get('budget') as string,
      company: formData.get('company') as string || 'Guest Client',
      contactEmail: formData.get('email') as string,
      postedDate: new Date().toISOString().split('T')[0],
      whatsapp: formData.get('whatsapp') as string
    };

    setJobs(prev => [newJob, ...prev]);
    setJobSubmitSuccess(true);
    setTimeout(() => {
      setJobSubmitSuccess(false);
      setIsPostJobOpen(false);
    }, 2000);
  };

  const NavLinks = () => (
    <>
      <Link to="/creators" onClick={() => setIsMenuOpen(false)} className={`px-3 py-2 text-sm font-semibold uppercase tracking-widest ${location.pathname === '/creators' ? 'text-black font-black underline' : 'text-gray-600 hover:text-black'}`}>Creators</Link>
      <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className={`px-3 py-2 text-sm font-semibold uppercase tracking-widest ${location.pathname === '/jobs' ? 'text-black font-black underline' : 'text-gray-600 hover:text-black'}`}>Jobs</Link>
      <Link to="/membership" onClick={() => setIsMenuOpen(false)} className={`px-3 py-2 text-sm font-semibold uppercase tracking-widest ${location.pathname === '/membership' ? 'text-black font-black underline' : 'text-gray-600 hover:text-black'}`}>Membership</Link>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white pb-16 sm:pb-0">
      {/* Navigation */}
      <nav className="bg-white border-b border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-black text-black tracking-tighter uppercase">
                Aib HUB
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <NavLinks />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                {!currentUser ? (
                  <>
                    <Link to="/login" className="text-gray-600 hover:text-black px-3 py-2 text-sm font-semibold">Login</Link>
                    <Link to="/register" className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition uppercase tracking-widest">Join</Link>
                  </>
                ) : (
                  <>
                    {currentUser.role === UserRole.CREATOR && (
                      <>
                        <Link to="/profile" className="text-black hover:underline text-sm font-bold uppercase tracking-wider">My Profile</Link>
                        <Link to="/dashboard" className="text-zinc-400 hover:text-black text-sm font-bold uppercase tracking-wider">Settings</Link>
                      </>
                    )}
                    {currentUser.role === UserRole.ADMIN && (
                      <Link to="/admin" className="text-black hover:underline text-sm font-bold uppercase tracking-wider">Admin</Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-black text-sm font-semibold uppercase"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden text-black p-2 focus:outline-none"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t border-black animate-in fade-in slide-in-from-top duration-200">
            <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col text-center">
              <NavLinks />
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
                {!currentUser ? (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-black text-sm font-semibold uppercase">Login</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-black text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition uppercase tracking-widest">Join Aib HUB</Link>
                  </>
                ) : (
                  <>
                    {currentUser.role === UserRole.CREATOR && (
                      <>
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-black text-sm font-bold uppercase tracking-wider">My Profile</Link>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-black text-sm font-bold uppercase tracking-wider">Settings</Link>
                      </>
                    )}
                    {currentUser.role === UserRole.ADMIN && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-black text-sm font-bold uppercase tracking-wider">Admin Panel</Link>
                    )}
                    <button 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="text-red-500 text-sm font-semibold uppercase"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow relative">
        <Routes>
          <Route path="/" element={<Home creators={creators} jobs={jobs} />} />
          <Route path="/creators" element={<CreatorListing creators={creators} />} />
          <Route path="/creators/:id" element={<CreatorDetail creators={creators} />} />
          <Route 
            path="/profile" 
            element={currentUser?.role === UserRole.CREATOR ? <MyProfile user={currentUser} creators={creators} setCreators={setCreators} /> : <Navigate to="/login" />} 
          />
          <Route path="/jobs" element={<JobsListing jobs={jobs} />} />
          <Route path="/jobs/:id" element={<JobDetail jobs={jobs} />} />
          <Route path="/membership" element={<Pricing />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} users={INITIAL_USERS} />} />
          <Route path="/register" element={<Register setCurrentUser={setCurrentUser} creators={creators} setCreators={setCreators} />} />
          <Route 
            path="/dashboard" 
            element={currentUser?.role === UserRole.CREATOR ? <Dashboard user={currentUser} creators={creators} setCreators={setCreators} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={currentUser?.role === UserRole.ADMIN ? <AdminPanel creators={creators} setCreators={setCreators} jobs={jobs} setJobs={setJobs} /> : <Navigate to="/login" />} 
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* Floating Post Job Button */}
      <button 
        onClick={() => setIsPostJobOpen(true)}
        className="fixed bottom-20 sm:bottom-8 left-6 z-40 bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 group border border-zinc-700"
      >
        <div className="bg-white text-black p-1.5 rounded-lg group-hover:rotate-90 transition-transform">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
        </div>
        <span className="text-xs font-black uppercase tracking-[0.15em] pr-2">Post Job</span>
      </button>

      {/* Post Job Modal */}
      {isPostJobOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" onClick={() => !jobSubmitSuccess && setIsPostJobOpen(false)}></div>
          
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 border-2 border-black animate-in zoom-in duration-200">
            {jobSubmitSuccess ? (
              <div className="py-24 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Brief Received</h2>
                <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest mt-2">SYSTEM: LISTING COMMITTED TO DATABASE</p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b-2 border-black bg-zinc-50 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Submit a Brief</h2>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Direct creator recruitment protocol</p>
                  </div>
                  <button onClick={() => setIsPostJobOpen(false)} className="text-zinc-400 hover:text-black transition p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <form onSubmit={handlePostJob} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Job Title</label>
                      <input name="title" type="text" placeholder="e.g. Senior Video Editor" className="w-full border-2 border-black rounded-xl p-3 text-sm font-bold outline-none focus:bg-zinc-50" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">City / Remote</label>
                      <input name="city" type="text" placeholder="e.g. Indore or Remote" className="w-full border-2 border-black rounded-xl p-3 text-sm font-bold outline-none focus:bg-zinc-50" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Offer / Budget</label>
                    <input name="budget" type="text" placeholder="e.g. ₹5,000 / Project" className="w-full border-2 border-black rounded-xl p-3 text-sm font-bold outline-none focus:bg-zinc-50" required />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Competencies (comma separated)</label>
                    <input name="skills" type="text" placeholder="Premiere Pro, After Effects, Sound Design" className="w-full border-2 border-black rounded-xl p-3 text-sm font-bold outline-none focus:bg-zinc-50" required />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">The Brief (Details)</label>
                    <textarea name="description" rows={4} placeholder="Describe the mission and deliverables..." className="w-full border-2 border-black rounded-xl p-3 text-sm font-bold outline-none focus:bg-zinc-50" required></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Company / Client Name</label>
                      <input name="company" type="text" className="w-full border border-zinc-200 rounded-xl p-3 text-sm font-bold outline-none" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Contact Email</label>
                      <input name="email" type="email" className="w-full border border-zinc-200 rounded-xl p-3 text-sm font-bold outline-none" required />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-black text-white py-5 font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition shadow-xl mt-4">
                    Deploy Listing
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black px-6 py-3 flex justify-between items-center z-50">
        <Link to="/creators" className={`flex flex-col items-center gap-1 ${location.pathname === '/creators' ? 'text-black' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">Creators</span>
        </Link>
        <Link to="/jobs" className={`flex flex-col items-center gap-1 ${location.pathname === '/jobs' ? 'text-black' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">Jobs</span>
        </Link>
        <Link to="/membership" className="bg-black text-white px-4 py-2 rounded-lg flex flex-col items-center gap-0.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
          <span className="text-[7px] font-black uppercase tracking-widest">Upgrade</span>
        </Link>
      </div>

      <footer className="bg-black text-white py-12 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Aib HUB</h3>
          <div className="flex justify-center space-x-6 mb-6 font-mono text-[10px] uppercase tracking-widest">
            <Link to="/creators" className="hover:text-gray-400">Creators</Link>
            <Link to="/jobs" className="hover:text-gray-400">Jobs</Link>
            <Link to="/membership" className="hover:text-gray-400">Membership</Link>
            <Link to="/about" className="hover:text-gray-400">About</Link>
            <Link to="/contact" className="hover:text-gray-400">Support</Link>
          </div>
          <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">© 2024 Aib HUB. Professional Excellence.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
