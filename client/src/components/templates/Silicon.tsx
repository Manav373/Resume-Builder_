import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function Silicon({ data }: TemplateProps) {
    return (
        <div className="bg-white text-slate-800 max-w-[210mm] mx-auto min-h-[297mm] font-sans p-10">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-light tracking-tight text-blue-600 mb-2">{data.personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                    {data.personalInfo.email && <span className="hover:text-blue-600 transition-colors cursor-pointer">{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.linkedin && <span className="hover:text-blue-600 transition-colors cursor-pointer">LinkedIn</span>}
                    {data.personalInfo.github && <span className="hover:text-blue-600 transition-colors cursor-pointer">GitHub</span>}
                    {data.personalInfo.twitter && <span className="hover:text-blue-600 transition-colors cursor-pointer">Twitter</span>}
                    {data.personalInfo.instagram && <span className="hover:text-blue-600 transition-colors cursor-pointer">Instagram</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Summary */}
                {data.summary && (
                    <section>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About</h2>
                        <p className="text-slate-700 leading-relaxed text-sm">
                            {data.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Experience</h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-medium text-slate-900">{exp.position}</h3>
                                        <span className="text-sm text-slate-400 font-mono">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                    </div>
                                    <div className="text-blue-600 text-sm mb-2">{exp.company}</div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
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
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Projects</h2>
                        <div className="space-y-6">
                            {data.projects.map((project, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-medium text-slate-900">{project.name}</h3>
                                        <span className="text-sm text-slate-400 font-mono">{project.startDate} — {project.endDate || 'Present'}</span>
                                    </div>
                                    {project.link && (
                                        <div className="text-blue-600 text-sm mb-2">
                                            <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline">{project.link.replace(/^https?:\/\//, '')}</a>
                                        </div>
                                    )}
                                    <p className="text-slate-600 text-sm leading-relaxed mb-2">
                                        {project.description}
                                    </p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies.map((tech, t) => (
                                                <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                                                    {tech}
                                                </span>
                                            ))}
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
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Certifications</h2>
                        <div className="space-y-4">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                                    <div>
                                        <div className="font-medium text-slate-900">{cert.name}</div>
                                        <div className="text-slate-500 text-xs mb-1">{cert.issuer}</div>
                                        {cert.link && (
                                            <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                                                View Credential
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-slate-400 text-xs font-mono">{cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-medium border border-slate-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Education</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <div className="font-medium text-slate-900">{edu.school}</div>
                                    <div className="text-slate-500 text-sm">{edu.degree}</div>
                                    <div className="text-slate-400 text-xs mt-1">{edu.startDate} – {edu.endDate || 'Present'}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
