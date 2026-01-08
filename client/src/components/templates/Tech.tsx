import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function Tech({ data }: TemplateProps) {
    return (
        <div className="bg-[#1a1b26] text-[#a9b1d6] shadow-2xl max-w-[210mm] mx-auto min-h-[297mm] font-mono p-10">
            {/* Terminal Header */}
            <div className="border border-[#414868] rounded-lg bg-[#24283b] mb-8 overflow-hidden">
                <div className="bg-[#1f2335] px-4 py-2 flex gap-2 border-b border-[#414868]">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    <div className="ml-4 text-xs text-[#565f89]">user@{data.title.toLowerCase().replace(/\s+/g, '-')}:~</div>
                </div>
                <div className="p-6">
                    <div className="flex gap-6 items-start">
                        {data.personalInfo.photoUrl && (
                            <div className="w-24 h-24 rounded border-2 border-[#7aa2f7] overflow-hidden flex-shrink-0">
                                <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="text-[#bb9af7] text-sm md:text-base">$ whoami</div>
                            <h1 className="text-4xl font-bold text-[#c0caf5]">{data.personalInfo.fullName}</h1>
                            <div className="text-[#7aa2f7]">{data.personalInfo.email} <span className="text-[#565f89]">|</span> {data.personalInfo.phone}</div>
                            {data.personalInfo.linkedin && <div className="text-[#7aa2f7] text-sm break-all">{data.personalInfo.linkedin}</div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Summary */}
                {data.summary && (
                    <section>
                        <div className="text-[#e0af68] text-sm mb-2">$ cat summary.txt</div>
                        <div className="border-l-2 border-[#565f89] pl-4 text-[#9aa5ce] leading-relaxed">
                            {data.summary}
                        </div>
                    </section>
                )}

                {/* Skills - JSON Style */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <div className="text-[#e0af68] text-sm mb-2">$ cat skills.json</div>
                        <div className="bg-[#24283b] p-4 rounded border border-[#414868] text-sm">
                            <span className="text-[#bb9af7]">{"{"}</span>
                            <div className="pl-4">
                                <span className="text-[#7dcfff]">"technologies"</span>: <span className="text-[#9ece6a]">[</span>
                                <div className="pl-4 flex flex-wrap gap-2">
                                    {data.skills.map((skill, i) => (
                                        <span key={i} className="text-[#c0caf5]">
                                            "{skill}"{i < data.skills!.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[#9ece6a]">]</span>
                            </div>
                            <span className="text-[#bb9af7]">{"}"}</span>
                        </div>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <div className="text-[#e0af68] text-sm mb-4">$ ./show-experience.sh</div>
                        <div className="space-y-6">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#414868]"></div>
                                    <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-[#7aa2f7]"></div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-1">
                                        <h3 className="text-[#7aa2f7] font-bold text-lg">{exp.position}</h3>
                                        <span className="text-[#565f89] font-mono text-xs">
                                            [{exp.startDate} :: {exp.endDate || 'HEAD'}]
                                        </span>
                                    </div>
                                    <div className="text-[#bb9af7] mb-2">@ {exp.company}</div>
                                    <p className="text-[#a9b1d6] text-sm leading-relaxed">
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
                        <div className="text-[#e0af68] text-sm mb-4">$ ./show-projects.sh</div>
                        <div className="space-y-6">
                            {data.projects.map((project, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#414868]"></div>
                                    <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-[#7aa2f7]"></div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-1">
                                        <h3 className="text-[#7aa2f7] font-bold text-lg">{project.name}</h3>
                                        <span className="text-[#565f89] font-mono text-xs">
                                            [{project.startDate} :: {project.endDate || 'HEAD'}]
                                        </span>
                                    </div>
                                    {project.link && (
                                        <div className="text-[#bb9af7] mb-2 text-sm italic">
                                            <a href={project.link} target="_blank" rel="noreferrer">&lt;Link: {project.link.replace(/^https?:\/\//, '')} /&gt;</a>
                                        </div>
                                    )}
                                    <p className="text-[#a9b1d6] text-sm leading-relaxed mb-2">
                                        {project.description}
                                    </p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="text-[#565f89] text-xs font-mono">
                                            <span className="text-[#7dcfff]">const</span> <span className="text-[#e0af68]">stack</span> = <span className="text-[#9ece6a]">[{project.technologies.map(t => `'${t}'`).join(', ')}]</span>;
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
                        <div className="text-[#e0af68] text-sm mb-2">$ cat certifications.log</div>
                        <div className="space-y-2">
                            {data.certifications.map((cert, i) => (
                                <div key={i} className="bg-[#24283b] p-3 rounded border border-[#414868] flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-2">
                                    <div>
                                        <span className="text-[#7aa2f7] font-bold">{cert.name}</span>
                                        <span className="text-[#565f89] mx-2">|</span>
                                        <span className="text-[#a9b1d6]">{cert.issuer}</span>
                                        {cert.link && (
                                            <span className="ml-2 text-[#bb9af7]">
                                                (<a href={cert.link} target="_blank" rel="noreferrer" className="hover:underline">link</a>)
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[#9ece6a]">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <div className="text-[#e0af68] text-sm mb-2">$ ./show-education.sh</div>
                        <div className="grid gap-4">
                            {data.education.map((edu, i) => (
                                <div key={i} className="flex items-center gap-4 text-sm">
                                    <span className="text-[#9ece6a] min-w-[120px]">{edu.startDate}</span>
                                    <span className="text-[#565f89]">-&gt;</span>
                                    <span className="text-[#c0caf5] font-bold">{edu.school}</span>
                                    <span className="text-[#565f89]">::</span>
                                    <span className="text-[#7aa2f7]">{edu.degree}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            {/* Footer Cursor */}
            <div className="mt-12 flex items-center gap-2">
                <span className="text-[#9ece6a]">➜</span>
                <span className="text-[#7dcfff]">~</span>
                <span className="animate-pulse bg-[#a9b1d6] text-[#1a1b26] px-1">_</span>
            </div>
        </div>
    );
}
