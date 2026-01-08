import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function Ivy({ data }: TemplateProps) {
    return (
        <div className="bg-white text-black max-w-[210mm] mx-auto min-h-[297mm] font-serif p-12 leading-tight">
            {/* Header */}
            <div className="text-center border-b border-black pb-4 mb-4">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.personalInfo.fullName}</h1>
                <div className="text-sm flex justify-center gap-3 flex-wrap text-gray-800">
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.location && <span>|</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.phone && <span>|</span>}
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.linkedin && <span>|</span>}
                    {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
                    {data.personalInfo.github && <span>|</span>}
                    {data.personalInfo.github && <span>{data.personalInfo.github.replace(/^https?:\/\//, '')}</span>}
                    {data.personalInfo.twitter && <span>|</span>}
                    {data.personalInfo.twitter && <span>{data.personalInfo.twitter.replace(/^https?:\/\//, '')}</span>}
                </div>
            </div>

            <div className="space-y-4">
                {/* Education Section - Ivy League resumes often put Education first */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Education</h2>
                        <div className="space-y-2">
                            {data.education.map((edu, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="flex justify-between items-baseline">
                                        <div className="font-bold">{edu.school}</div>
                                        <div className="text-right text-sm">{edu.startDate} – {edu.endDate || 'Present'}</div>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <div className="italic text-sm">{edu.degree}</div>
                                    </div>
                                    {edu.description && (
                                        <p className="text-sm text-gray-800 mt-1 pl-2">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience Section */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Professional Experience</h2>
                        <div className="space-y-3">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <div className="font-bold">{exp.company}</div>
                                        <div className="text-sm">{exp.location}</div>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="italic text-sm">{exp.position}</div>
                                        <div className="text-right text-sm">{exp.startDate} – {exp.endDate || 'Present'}</div>
                                    </div>
                                    <p className="text-sm text-justify">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects Section */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Projects</h2>
                        <div className="space-y-3">
                            {data.projects.map((project, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold">{project.name}</div>
                                        <div className="text-right text-sm">{project.startDate} – {project.endDate || 'Present'}</div>
                                    </div>
                                    {project.link && (
                                        <div className="text-sm italic mb-1">
                                            <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline">{project.link.replace(/^https?:\/\//, '')}</a>
                                        </div>
                                    )}
                                    <p className="text-sm text-justify">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications Section */}
                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Certifications</h2>
                        <div className="space-y-2">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold">{cert.name}</span>
                                        <span className="text-sm">, {cert.issuer}</span>
                                    </div>
                                    <div className="text-right text-sm">{cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills Section */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Additional Information</h2>
                        <div className="text-sm">
                            <span className="font-bold">Skills: </span>
                            {data.skills.join(', ')}
                        </div>
                        {data.summary && (
                            <div className="text-sm mt-1">
                                <span className="font-bold">Summary: </span>
                                {data.summary}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
