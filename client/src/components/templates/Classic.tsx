import type { ResumeData } from '@/lib/types';

interface TemplateProps {
    data: ResumeData;
}

export function Classic({ data }: TemplateProps) {
    return (
        <div className="bg-white text-slate-900 shadow-2xl max-w-[210mm] mx-auto min-h-[297mm] p-12 font-serif">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-6 mb-8 text-center">
                {data.personalInfo.photoUrl && (
                    <div className="mb-4 w-24 h-24 rounded-full overflow-hidden border border-slate-300 mx-auto">
                        <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                )}
                <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.personalInfo.fullName}</h1>
                <div className="text-sm flex flex-wrap justify-center gap-4 text-slate-600">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                    {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-4 pb-1">Professional Summary</h2>
                    <p className="text-slate-700 leading-relaxed text-justify">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-6 pb-1">Experience</h2>
                    <div className="space-y-6">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-lg">{exp.position}</h3>
                                    <span className="text-sm italic text-slate-600">
                                        {exp.startDate} – {exp.endDate || 'Present'}
                                    </span>
                                </div>
                                <div className="text-md font-semibold text-slate-700 mb-2">
                                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                                </div>
                                <p className="text-sm text-slate-600 whitespace-pre-line">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-6 pb-1">Education</h2>
                    <div className="space-y-4">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold">{edu.school}</div>
                                    <div className="text-slate-700 italic">{edu.degree}</div>
                                </div>
                                <div className="text-sm text-slate-600 italic">
                                    {edu.startDate} – {edu.endDate || 'Present'}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-4 pb-1">Skills</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {data.skills.map((skill, i) => (
                            <span key={i} className="text-slate-700">• {skill}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
