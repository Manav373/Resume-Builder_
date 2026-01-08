import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function Executive({ data }: TemplateProps) {
    return (
        <div className="bg-[#f8f9fa] text-slate-900 max-w-[210mm] mx-auto min-h-[297mm] font-serif">
            {/* Header */}
            <div className="bg-[#1e293b] text-white p-12 text-center">
                <h1 className="text-4xl font-serif tracking-wide mb-4">{data.personalInfo.fullName}</h1>
                <div className="flex justify-center flex-wrap gap-6 text-[#94a3b8] text-sm uppercase tracking-widest">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </div>

            <div className="p-12">
                {/* Executive Summary */}
                {data.summary && (
                    <div className="mb-10 text-center max-w-2xl mx-auto">
                        <p className="text-lg leading-relaxed text-slate-600 italic">
                            "{data.summary}"
                        </p>
                    </div>
                )}

                <div className="space-y-10">
                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-serif text-[#1e293b] border-b-2 border-[#1e293b] pb-2 mb-6">Professional Experience</h2>
                            <div className="space-y-8">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                                            <h3 className="text-xl font-bold text-slate-800">{exp.position}</h3>
                                            <span className="text-[#64748b] bg-slate-200 px-3 py-1 text-sm rounded-full">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                        </div>
                                        <div className="text-lg text-[#334155] font-serif italic mb-3">{exp.company}, {exp.location}</div>
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
                            <h2 className="text-2xl font-serif text-[#1e293b] border-b-2 border-[#1e293b] pb-2 mb-6">Significant Projects</h2>
                            <div className="space-y-6">
                                {data.projects.map((project, i) => (
                                    <div key={i}>
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                                            <h3 className="text-xl font-bold text-slate-800">{project.name}</h3>
                                            <span className="text-[#64748b] bg-slate-200 px-3 py-1 text-sm rounded-full">{project.startDate} – {project.endDate || 'Present'}</span>
                                        </div>
                                        {project.link && (
                                            <div className="text-[#334155] font-serif italic mb-2 text-sm">
                                                <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline">{project.link.replace(/^https?:\/\//, '')}</a>
                                            </div>
                                        )}
                                        <p className="text-slate-600 leading-relaxed mb-2">
                                            {project.description}
                                        </p>
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="text-slate-500 text-sm">
                                                <span className="font-bold">Technologies: </span>{project.technologies.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-serif text-[#1e293b] border-b-2 border-[#1e293b] pb-2 mb-6">Certifications</h2>
                            <div className="space-y-4">
                                {data.certifications.map((cert, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-dashed border-[#1e293b] pb-2">
                                        <div>
                                            <span className="text-lg font-bold text-slate-800">{cert.name}</span>
                                            <span className="text-[#64748b] italic mx-2">-</span>
                                            <span className="text-[#334155]">{cert.issuer}</span>
                                            {cert.link && (
                                                <a href={cert.link} target="_blank" rel="noreferrer" className="ml-2 text-sm text-blue-800 hover:underline">
                                                    (View)
                                                </a>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-[#64748b]">{cert.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif text-[#1e293b] border-b-2 border-[#cbd5e1] pb-2 mb-4">Education</h2>
                                <div className="space-y-4">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <div className="font-bold text-lg">{edu.school}</div>
                                            <div className="text-slate-600 italic">{edu.degree}</div>
                                            <div className="text-slate-400 text-sm mt-1">{edu.startDate} – {edu.endDate || 'Present'}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Core Competencies (Skills) */}
                        {data.skills && data.skills.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif text-[#1e293b] border-b-2 border-[#cbd5e1] pb-2 mb-4">Core Competencies</h2>
                                <ul className="grid grid-cols-2 gap-2">
                                    {data.skills.map((skill, i) => (
                                        <li key={i} className="flex items-center text-slate-700">
                                            <span className="w-1.5 h-1.5 bg-[#1e293b] rounded-full mr-2"></span>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
