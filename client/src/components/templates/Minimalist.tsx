import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function Minimalist({ data }: TemplateProps) {
    return (
        <div className="bg-white text-slate-900 shadow-2xl max-w-[210mm] mx-auto min-h-[297mm] p-16 font-sans">
            {/* Header */}
            <header className="mb-12 border-b-2 border-slate-100 pb-8 flex flex-col items-start">
                {data.personalInfo.photoUrl && (
                    <div className="mb-6 w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
                        <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                )}
                <h1 className="text-5xl font-light tracking-tight text-slate-900 mb-4">{data.personalInfo.fullName}</h1>
                <div className="text-sm font-normal text-slate-500 flex flex-col gap-1">
                    {data.personalInfo.email && <span className="hover:text-slate-800 transition-colors">{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.linkedin && (
                        <span className="text-blue-600/80">{data.personalInfo.linkedin.replace(/https?:\/\//, '')}</span>
                    )}
                    {data.personalInfo.website && (
                        <span className="text-blue-600/80">{data.personalInfo.website.replace(/https?:\/\//, '')}</span>
                    )}
                </div>
            </header>

            {/* Content Grid */}
            <div className="space-y-12">

                {/* Summary */}
                {data.summary && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">About</h2>
                        <p className="text-lg leading-relaxed text-slate-700 font-light max-w-2xl">
                            {data.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Experience</h2>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="grid grid-cols-[1fr_3fr] gap-8 group">
                                    <div className="text-sm text-slate-400 pt-1 font-medium">
                                        {exp.startDate} — {exp.endDate || 'Present'}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-xl text-slate-800 flex items-center gap-2">
                                            {exp.position}
                                            <span className="font-normal text-slate-400">at {exp.company}</span>
                                        </h3>
                                        {exp.location && <div className="text-xs text-slate-400 uppercase tracking-wider">{exp.location}</div>}
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-line group-hover:text-slate-900 transition-colors">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Education</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, i) => (
                                <div key={i} className="grid grid-cols-[1fr_3fr] gap-8">
                                    <div className="text-sm text-slate-400 pt-1 font-medium">
                                        {edu.startDate} — {edu.endDate || 'Present'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-slate-800">{edu.school}</div>
                                        <div className="text-slate-600">{edu.degree}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="bg-slate-50 text-slate-600 px-3 py-1 text-sm rounded-md border border-slate-100">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}


                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Projects</h2>
                        <div className="space-y-10">
                            {data.projects.map((project, i) => (
                                <div key={i} className="grid grid-cols-[1fr_3fr] gap-8 group">
                                    <div className="text-sm text-slate-400 pt-1 font-medium">
                                        {project.startDate} — {project.endDate || 'Present'}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-xl text-slate-800">
                                            {project.name}
                                        </h3>
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">
                                                {project.link.replace(/https?:\/\//, '')}
                                            </a>
                                        )}
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-line group-hover:text-slate-900 transition-colors">
                                            {project.description}
                                        </p>
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {project.technologies.map((tech, t) => (
                                                    <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Certifications</h2>
                        <div className="space-y-6">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="grid grid-cols-[1fr_3fr] gap-8 items-baseline">
                                    <div className="text-sm text-slate-400 font-medium">
                                        {cert.date}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">{cert.name}</div>
                                        <div className="text-slate-500 text-sm mb-1">{cert.issuer}</div>
                                        {cert.link && (
                                            <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                                                Verification Link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
