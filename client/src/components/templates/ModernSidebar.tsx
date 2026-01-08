import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function ModernSidebar({ data }: TemplateProps) {
    return (
        <div className="bg-white text-slate-800 shadow-2xl max-w-[210mm] mx-auto min-h-[297mm] grid grid-cols-[1fr_2fr]">
            {/* Sidebar (Left Column) */}
            <aside className="bg-slate-900 text-white p-8 space-y-8">
                {/* Contact Info */}
                <div className="space-y-4">
                    {data.personalInfo.photoUrl && (
                        <div className="mb-6 w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 mx-auto">
                            <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold leading-tight tracking-tight">
                        {data.personalInfo.fullName}
                    </h1>
                    <div className="text-sm space-y-2 text-slate-300">
                        {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
                        {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                        {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                        {data.personalInfo.linkedin && (
                            <div className="break-all text-xs opacity-80">{data.personalInfo.linkedin.replace(/https?:\/\//, '')}</div>
                        )}
                        {data.personalInfo.website && (
                            <div className="break-all text-xs opacity-80">{data.personalInfo.website.replace(/https?:\/\//, '')}</div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="uppercase tracking-widest text-xs font-bold text-slate-400 border-b border-slate-700 pb-1">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education (Moved to sidebar for balance) */}
                {data.education && data.education.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="uppercase tracking-widest text-xs font-bold text-slate-400 border-b border-slate-700 pb-1">
                            Education
                        </h3>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i} className="text-sm">
                                    <div className="font-bold text-white mb-0.5">{edu.school}</div>
                                    <div className="text-slate-300 text-xs mb-1">{edu.degree}</div>
                                    <div className="text-slate-500 text-[10px] uppercase">
                                        {edu.startDate} – {edu.endDate || 'Present'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content (Right Column) */}
            <main className="p-8 space-y-8">
                {/* Summary */}
                {data.summary && (
                    <section>
                        <h2 className="uppercase tracking-widest text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-4">
                            Profile
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-600 text-justify">
                            {data.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="uppercase tracking-widest text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-900" />
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-900">{exp.position}</h3>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            {exp.startDate} – {exp.endDate || 'Present'}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-slate-700 mb-2">
                                        {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                                    </div>
                                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
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
                        <h2 className="uppercase tracking-widest text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6">
                            Projects
                        </h2>
                        <div className="space-y-6">
                            {data.projects.map((project, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-900" />
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-900">{project.name}</h3>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            {project.startDate} – {project.endDate || 'Present'}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-slate-700 mb-2">
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                {project.link.replace(/https?:\/\//, '')}
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
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
                        <h2 className="uppercase tracking-widest text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6">
                            Certifications
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="flex justify-between items-start border-b border-slate-100 pb-2">
                                    <div>
                                        <div className="font-bold text-slate-900">{cert.name}</div>
                                        <div className="text-sm text-slate-600">{cert.issuer}</div>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                        {cert.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
