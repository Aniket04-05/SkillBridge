import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [fileName, setFileName] = useState(""); 
    const [resumeFile, setResumeFile] = useState(null); // Added state to hold the actual file
    const [isDragging, setIsDragging] = useState(false); // Added state for drag visuals
    const [error, setError] = useState(""); 
    
    const resumeInputRef = useRef(null);
    const navigate = useNavigate();

    // 1. DRAG AND DROP HANDLERS
    const handleDragOver = (e) => {
        e.preventDefault(); // Prevents browser from opening the file
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            // Basic validation for PDF
            if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
                setFileName(droppedFile.name);
                setResumeFile(droppedFile);
                setError("");
            } else {
                setError("Please upload a valid PDF file.");
            }
        }
    };

    // 2. CLICK UPLOAD HANDLER
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            setResumeFile(e.target.files[0]);
            setError(""); 
        }
    };

    const handleGenerateReport = async () => {
        setError(""); 
        
        if (!jobDescription.trim()) {
            return setError("Target Job Description is required.");
        }
        
        // Uses the state file instead of the ref
        if (!resumeFile && !selfDescription.trim()) {
            return setError("Please provide either a Resume or a Quick Self-Description.");
        }

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile });
            if (data && data._id) {
                navigate(`/interview/${data._id}`);
            }
        } catch (err) {
            setError(err.message || "Failed to generate report. Please try again.");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-100">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900 mb-4"></div>
                <h1 className="text-zinc-600 font-medium">Generating your interview strategy...</h1>
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-2xl mx-auto mb-10">
                <h1 className="text-3xl font-bold text-zinc-900">
                    Create Your Custom <span className="text-zinc-500">Interview Plan</span>
                </h1>
                <p className="mt-3 text-zinc-600">
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
            </header>

            {error && (
                <div className="w-full max-w-5xl mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg text-center">
                    {error}
                </div>
            )}

            <div className="w-full max-w-5xl bg-zinc-50 border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
                <div className="flex-1 p-6 lg:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-zinc-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            <h2 className="text-lg font-semibold">Target Job Description</h2>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-zinc-200 text-zinc-700 text-xs font-medium">Required</span>
                    </div>
                    
                    <div className="relative">
                        <textarea
                            onChange={(e) => {
                                setJobDescription(e.target.value);
                                if (error) setError(""); 
                            }}
                            value={jobDescription}
                            className="w-full h-80 p-4 bg-white border border-zinc-300 rounded-xl focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-zinc-900 placeholder-zinc-400 resize-none"
                            placeholder="Paste the full job description here...&#10;&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                            maxLength={5000}
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-zinc-400">
                            {jobDescription.length} / 5000 chars
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-zinc-200 my-8"></div>
                <div className="block lg:hidden h-px w-full bg-zinc-200 mx-8"></div>

                <div className="flex-1 p-6 lg:p-8 space-y-6">
                    <div className="flex items-center space-x-3 text-zinc-900 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-zinc-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        <h2 className="text-lg font-semibold">Your Profile</h2>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-700">Upload Resume</label>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">Best Results</span>
                        </div>
                        {/* 3. ATTACH DRAG EVENTS AND DYNAMIC STYLING HERE */}
                        <label 
                            className={`relative block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                                isDragging ? "border-zinc-900 bg-zinc-100" : "border-zinc-300 hover:border-zinc-400 hover:bg-white"
                            }`}
                            htmlFor="resume"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-zinc-400 mb-3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                            {fileName ? (
                                <p className="text-sm font-medium text-zinc-900">{fileName}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-zinc-900">Click to upload or drag & drop</p>
                                    <p className="text-xs text-zinc-500 mt-1">PDF format only (Max 3MB)</p>
                                </>
                            )}
                            <input ref={resumeInputRef} onChange={handleFileChange} hidden type="file" id="resume" name="resume" accept=".pdf" />
                        </label>
                    </div>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-zinc-200"></div>
                        <span className="flex-shrink-0 mx-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">OR</span>
                        <div className="flex-grow border-t border-zinc-200"></div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700" htmlFor="selfDescription">Quick Self-Description</label>
                        <textarea
                            onChange={(e) => {
                                setSelfDescription(e.target.value);
                                if (error) setError("");
                            }}
                            value={selfDescription}
                            id="selfDescription"
                            className="w-full h-32 p-3 bg-white border border-zinc-300 rounded-xl focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-zinc-900 placeholder-zinc-400 resize-none text-sm"
                            placeholder="Briefly describe your key skills and years of experience if you don't have a resume handy..."
                        />
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-200/50 px-4 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2" /></svg>
                    Either a Resume or a Self Description is required.
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 w-full sm:w-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                    Generate Interview Strategy
                </button>
            </div>

            {reports && reports.length > 0 && (
                <section className="w-full max-w-5xl mt-16 space-y-6">
                    <h2 className="text-xl font-semibold text-zinc-900">My Recent Interview Plans</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reports.map(report => (
                            <li 
                                key={report._id} 
                                onClick={() => navigate(`/interview/${report._id}`)}
                                className="p-5 bg-white border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:shadow-sm transition-all group flex flex-col h-full"
                            >
                                <h3 className="font-medium text-zinc-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                    {report.title || 'Untitled Position'}
                                </h3>
                                <div className="mt-auto flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className={`font-medium ${report.matchScore >= 80 ? 'text-green-600' : report.matchScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                        {report.matchScore}% Match
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <footer className="mt-auto pt-16 pb-8 flex space-x-6 text-sm text-zinc-500">
                <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-zinc-900 transition-colors">Help Center</a>
            </footer>
        </div>
    );
};

export default Home;