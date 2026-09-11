import React, { useState, useEffect } from 'react';
import { useInterview } from '../hooks/useInterview';
import { useParams } from 'react-router';

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
];

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white border border-zinc-200 rounded-xl mb-4 overflow-hidden shadow-sm transition-all">
            <button 
                onClick={() => setOpen(!open)}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-zinc-50 transition-colors focus:outline-none"
            >
                <span className="flex-shrink-0 bg-zinc-100 text-zinc-600 text-sm font-semibold py-1 px-3 rounded-lg">
                    Q{index + 1}
                </span>
                <p className="flex-1 font-medium text-zinc-900 mt-0.5">{item.question}</p>
                <span className={`flex-shrink-0 text-zinc-400 transition-transform duration-200 mt-1 ${open ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </button>
            
            {open && (
                <div className="p-5 pt-0 border-t border-zinc-100 bg-zinc-50/50 space-y-5">
                    <div className="mt-4">
                        <span className="inline-block px-2.5 py-1 mb-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md">Intention</span>
                        <p className="text-sm text-zinc-700 leading-relaxed">{item.intention}</p>
                    </div>
                    <div>
                        <span className="inline-block px-2.5 py-1 mb-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md">Model Answer</span>
                        <p className="text-sm text-zinc-700 leading-relaxed">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const RoadMapDay = ({ day }) => (
    <div className="relative pl-8 pb-8 border-l border-zinc-200 last:border-l-0 last:pb-0">
        <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-zinc-400"></div>
        <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 text-xs font-semibold text-zinc-900 bg-zinc-100 rounded-md">Day {day.day}</span>
                <h3 className="font-semibold text-zinc-800">{day.focus}</h3>
            </div>
            <ul className="space-y-2">
                {day.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-300" />
                        <span className="leading-relaxed">{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical');
    const { report, getReportById, loading, getResumePdf } = useInterview();
    const { interviewId } = useParams();

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId]);

    if (loading || !report) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900 mb-4"></div>
                <h1 className="text-zinc-600 font-medium">Loading your interview plan...</h1>
            </main>
        );
    }

    const scoreColors = report.matchScore >= 80 
        ? 'text-emerald-600 border-emerald-200 bg-emerald-50' 
        : report.matchScore >= 60 
            ? 'text-amber-600 border-amber-200 bg-amber-50' 
            : 'text-red-600 border-red-200 bg-red-50';

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col lg:flex-row">
            
            {/* ── Left Nav ── */}
            <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200 p-6 flex flex-col h-auto lg:h-screen lg:sticky lg:top-0">
                <div className="flex-1 space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-3">Sections</p>
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeNav === item.id 
                                ? 'bg-zinc-900 text-white' 
                                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                            }`}
                        >
                            <span className={activeNav === item.id ? 'opacity-100' : 'opacity-60'}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={() => getResumePdf(interviewId)}
                    className="mt-8 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-zinc-900"
                >
                    <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                    Download Resume
                </button>
            </aside>

            {/* ── Center Content ── */}
            <main className="flex-1 p-6 lg:p-10 lg:max-w-4xl mx-auto w-full">
                {activeNav === 'technical' && (
                    <section className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900">Technical Questions</h2>
                            <span className="px-3 py-1 bg-zinc-200 text-zinc-700 text-sm font-medium rounded-full">{report.technicalQuestions.length} questions</span>
                        </div>
                        <div>
                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </div>
                    </section>
                )}

                {activeNav === 'behavioral' && (
                    <section className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900">Behavioral Questions</h2>
                            <span className="px-3 py-1 bg-zinc-200 text-zinc-700 text-sm font-medium rounded-full">{report.behavioralQuestions.length} questions</span>
                        </div>
                        <div>
                            {report.behavioralQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </div>
                    </section>
                )}

                {activeNav === 'roadmap' && (
                    <section className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold text-zinc-900">Preparation Road Map</h2>
                            <span className="px-3 py-1 bg-zinc-200 text-zinc-700 text-sm font-medium rounded-full">{report.preparationPlan.length}-day plan</span>
                        </div>
                        <div className="ml-4">
                            {report.preparationPlan.map((day) => (
                                <RoadMapDay key={day.day} day={day} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* ── Right Sidebar ── */}
            <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-zinc-200 p-6 lg:p-8 flex flex-col h-auto lg:h-screen lg:sticky lg:top-0">
                
                {/* Match Score */}
                <div className="flex flex-col items-center text-center pb-8 border-b border-zinc-100">
                    <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Match Score</p>
                    <div className={`flex items-center justify-center w-32 h-32 rounded-full border-8 mb-3 ${scoreColors}`}>
                        <span className="text-4xl font-extrabold">{report.matchScore}</span>
                        <span className="text-xl font-bold ml-1">%</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-700">
                        {report.matchScore >= 80 ? 'Strong match for this role!' : report.matchScore >= 60 ? 'Moderate match. Needs prep.' : 'Low match. Heavy prep required.'}
                    </p>
                </div>

                {/* Skill Gaps */}
                <div className="pt-8 flex-1">
                    <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Skill Gaps</p>
                    <div className="flex flex-wrap gap-2">
                        {report.skillGaps.map((gap, i) => {
                            const severityStyles = 
                                gap.severity === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                                gap.severity === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-zinc-100 text-zinc-700 border-zinc-200';
                            
                            return (
                                <span key={i} className={`px-3 py-1.5 text-xs font-semibold border rounded-lg ${severityStyles}`}>
                                    {gap.skill}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Interview;