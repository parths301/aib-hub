
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Job } from '../types';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, creatorId } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
      } else if (data) {
        setJob({
          id: data.id,
          title: data.title,
          city: data.city,
          requiredSkills: data.required_skills || [],
          description: data.description,
          budget: data.budget,
          company: data.company,
          contactEmail: data.contact_email,
          whatsapp: data.whatsapp,
          postedDate: data.posted_date
        });
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  // Check if user has already applied
  useEffect(() => {
    const checkApplication = async () => {
      if (!id || !creatorId) return;
      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('creator_id', creatorId)
        .single();

      if (data) {
        setHasAlreadyApplied(true);
      }
    };
    checkApplication();
  }, [id, creatorId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorId || !id) return;

    setApplying(true);
    const { error } = await supabase.from('applications').insert([
      {
        job_id: id,
        creator_id: creatorId,
        cover_letter: coverLetter,
        status: 'PENDING'
      }
    ]);

    if (error) {
      console.error('Application error:', error);
      alert('Failed to submit application. You may have already applied.');
    } else {
      setApplied(true);
      setHasAlreadyApplied(true);
    }
    setApplying(false);
  };

  if (loading) {
    return <div className="p-24 text-center text-sm font-black uppercase tracking-widest">Loading Brief...</div>;
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter">Job Not Found</h2>
        <Link to="/jobs" className="bg-black text-white px-8 py-3 text-xs font-black uppercase tracking-widest rounded-lg">Return to Job Board</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <Link to="/jobs" className="text-black inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to list
        </Link>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden rounded-2xl shadow-xl">
        <div className="p-10 border-b-2 border-black bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="flex-grow">
              <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tighter">{job.title}</h1>
              <p className="text-xl font-bold text-gray-400 font-mono uppercase mb-4">{job.company}</p>
              <div className="text-2xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded tracking-widest font-black">OFFERING</span>
                {job.budget}
              </div>
            </div>
            <span className="bg-black text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-widest mt-4 md:mt-0 rounded-md">CONTRACT</span>
          </div>

          <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              {job.city}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              POSTED: {new Date(job.postedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="p-10 space-y-12">
          <div>
            <h2 className="text-lg font-black text-black uppercase tracking-widest mb-6">Brief Details</h2>
            <div className="text-gray-600 font-light text-lg leading-relaxed whitespace-pre-line border-l-4 border-black pl-8 italic">
              "{job.description}"
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-black uppercase tracking-widest mb-6">Competencies Required</h2>
            <div className="flex flex-wrap gap-3">
              {job.requiredSkills.map(skill => (
                <span key={skill} className="bg-white border-2 border-black text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg">{skill}</span>
              ))}
            </div>
          </div>

          <div className="bg-black text-white p-10 border-t-8 border-gray-800 rounded-b-2xl">
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Submit Proposal</h3>
            <p className="text-gray-400 mb-8 font-light text-sm">Review the brief carefully before initiating contact.</p>
            <div className="flex flex-wrap gap-4">
              {job.whatsapp && (
                <a
                  href={`https://wa.me/${job.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-black px-10 py-5 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition flex items-center gap-3 rounded-xl shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Connect via WhatsApp
                </a>
              )}

              {user && creatorId ? (
                hasAlreadyApplied ? (
                  <div className="bg-green-900 bg-opacity-30 text-green-400 px-10 py-5 font-black text-xs uppercase tracking-widest rounded-xl border border-green-700 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Application Submitted
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="bg-white text-black px-10 py-5 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition rounded-xl shadow-lg"
                  >
                    Apply for This Job
                  </button>
                )
              ) : (
                <Link
                  to="/login"
                  className="bg-zinc-700 text-white px-10 py-5 font-black text-xs uppercase tracking-widest hover:bg-zinc-600 transition rounded-xl"
                >
                  Login to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-80" onClick={() => !applying && setShowApplyModal(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative z-10 border-2 border-black">
            {applied ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Application Sent!</h2>
                <p className="text-zinc-500 text-sm">The client will review your profile and reach out if interested.</p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Apply for {job.title}</h2>
                <p className="text-zinc-400 text-sm mb-6">Your profile will be shared with the client.</p>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Cover Letter (Optional)</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={5}
                      placeholder="Tell the client why you're a great fit..."
                      className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1 border-2 border-black py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="flex-1 bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;

