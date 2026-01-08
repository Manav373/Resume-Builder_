import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function Creative({ data }: TemplateProps) {
    return (
        <div className="bg-white text-slate-800 shadow-2xl max-w-[210mm] mx-auto min-h-[297mm] font-sans overflow-hidden">
            {/* Header / Banner */}
            <header className="bg-rose-500 text-white p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 flex items-center gap-8">
                    {data.personalInfo.photoUrl && (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg flex-shrink-0">
                            <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">{data.personalInfo.fullName}</h1>
                        {data.summary && (
                            <p className="text-rose-100 text-lg font-medium leading-relaxed max-w-2xl">
                                {data.summary.slice(0, 150)}{data.summary.length > 150 ? '...' : ''}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-[3fr_1fr] min-h-[calc(297mm-200px)]">
                {/* Main Column */}
                <main className="p-10 space-y-10">

                    {/* Contact Info (Inlined for Creative look) */}
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                        {data.personalInfo.email && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">{data.personalInfo.email}</span>}
                        {data.personalInfo.phone && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">{data.personalInfo.phone}</span>}
                        {data.personalInfo.location && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">{data.personalInfo.location}</span>}
                        {data.personalInfo.linkedin && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">LinkedIn</span>}
                    </div>

                    {/* Summary (Full) */}
                    {data.summary && (
                        <section>
                            <h2 className="text-2xl font-bold text-rose-500 mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-rose-500 rounded-full"></span> About Me
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-rose-500 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-rose-500 rounded-full"></span> Experience
                            </h2>
                            <div className="space-y-8">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-6 border-l-2 border-rose-100">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-white"></div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                            <h3 className="font-bold text-xl text-slate-800">{exp.position}</h3>
                                            <span className="text-sm font-bold text-rose-400 bg-rose-50 px-2 py-1 rounded">
                                                {exp.startDate} – {exp.endDate || 'Present'}
                                            </span>
                                        </div>
                                        <div className="text-md font-semibold text-slate-500 mb-2">
                                            {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-rose-500 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-rose-500 rounded-full"></span> Projects
                            </h2>
                            <div className="space-y-8">
                                {data.projects.map((project, i) => (
                                    <div key={i} className="relative pl-6 border-l-2 border-rose-100">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-white"></div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                            <h3 className="font-bold text-xl text-slate-800">{project.name}</h3>
                                            <span className="text-sm font-bold text-rose-400 bg-rose-50 px-2 py-1 rounded">
                                                {project.startDate} – {project.endDate || 'Present'}
                                            </span>
                                        </div>
                                        {project.link && (
                                            <div className="text-sm text-rose-500 font-medium mb-2">
                                                <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline">{project.link.replace(/^https?:\/\//, '')}</a>
                                            </div>
                                        )}
                                        <p className="text-slate-600 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-rose-500 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-rose-500 rounded-full"></span> Certifications
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.certifications.map((cert, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between">
                                        <div>
                                            <div className="font-bold text-slate-800">{cert.name}</div>
                                            <div className="text-rose-500 text-sm">{cert.issuer}</div>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-2 text-right">
                                            {cert.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-rose-500 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-rose-500 rounded-full"></span> Education
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <div className="font-bold text-lg text-slate-800">{edu.school}</div>
                                        <div className="text-rose-500 font-medium">{edu.degree}</div>
                                        <div className="text-sm text-slate-400 mt-2">
                                            {edu.startDate} – {edu.endDate || 'Present'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Sidebar Column (Right) */}
                <aside className="bg-slate-50 p-8 border-l border-slate-100">
                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div className="sticky top-8">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">My Skills</h3>
                            <div className="flex flex-col gap-3">
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 border-l-4 border-l-rose-400">
                                        <span className="font-medium text-slate-700">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
